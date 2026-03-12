import { InjectQueue } from '@nestjs/bullmq';
import { Injectable } from '@nestjs/common';
import { Queue } from 'bullmq';
import { DagService } from 'src/service/dag/dag.service';
import { workflowGraph } from 'src/types/types';
import Redis from 'ioredis';
@Injectable()
export class OrchestratorService {
  private redis: Redis;

  constructor(
    private readonly dagService: DagService,
    @InjectQueue('orchestrator') private OrchestratorQueue: Queue,
  ) {
    this.redis = new Redis({
      host: 'localhost',
      port: 6379,
    });
  }

  async startInitialAgents(
    executionId: string,
    dependencyMap: Record<string, string[]>,
    workflowGraph: workflowGraph,
  ) {
    const agentsTobeExecuted = this.dagService.getReadyAgents(dependencyMap);

    await this.redis.set(
      `execution:${executionId}:context`,
      JSON.stringify({ dependencyMap, workflowGraph }),
    );

    //now we push it to the queue right

    await Promise.all(
      agentsTobeExecuted.map(async (agentId) => {
        const agent = workflowGraph.nodes.find((node) => node.id === agentId);
        await this.OrchestratorQueue.add('execute-agent', {
          executionId,
          agentId,
          agent,
        });
      }),
    );
  }
}
