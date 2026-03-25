import { InjectQueue } from '@nestjs/bullmq';
import { forwardRef, Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { Queue } from 'bullmq';
import { DagService } from 'src/service/dag/dag.service';
import { workflowGraph } from 'src/types/types';
import Redis from 'ioredis';
import { ExecutionService } from 'src/modules/execution/execution.service';
import { REDIS_CLIENT, REDIS_SUBSCRIBER } from 'src/redis/redis.constants';
@Injectable()
export class OrchestratorService implements OnModuleInit {
  constructor(
    private readonly dagService: DagService,
    @InjectQueue('orchestrator') private OrchestratorQueue: Queue,
    @Inject(forwardRef(() => ExecutionService))
    private readonly executionService: ExecutionService,
    @Inject(REDIS_CLIENT) private readonly redis: Redis,
    @Inject(REDIS_SUBSCRIBER) private readonly redisSubscriber: Redis,
  ) {}

  onModuleInit() {
    this.redisSubscriber.subscribe('agent-completed', (err, count) => {
      console.log('Subscribed to agent-completed, count:', count, 'err:', err);
    });
    this.redisSubscriber.on('message', async (channel, message) => {
      console.log(`Received message on channel ${channel}:`, message);
      const { executionId, agentId } = JSON.parse(message);
      await this.checkAgentStatus(executionId, agentId);
    });
  }

  async startInitialAgents(
    executionId: string,
    dependencyMap: Record<string, string[]>,
    workflowGraph: workflowGraph,
    input: string,
  ) {
    const agentsTobeExecuted = this.dagService.getReadyAgents(dependencyMap);

    await this.redis.set(
      `execution:${executionId}:context`,
      JSON.stringify({ dependencyMap, workflowGraph, input }),
    );

    //now we push it to the queue right

    await Promise.all(
      agentsTobeExecuted.map(async (agentId) => {
        const agent = workflowGraph.nodes.find((node) => node.id === agentId);
        await this.OrchestratorQueue.add('execute-agent', {
          executionId,
          agentId,
          agent,
          input,
        });
      }),
    );
  }

  async checkAgentStatus(executionId: string, agentId: string) {
    await this.redis.sadd(`execution:${executionId}:completed`, agentId);

    const { dependencyMap, workflowGraph, input } = JSON.parse(
      (await this.redis.get(`execution:${executionId}:context`)) || '{}',
    );

    const dependentAgents = Object.keys(dependencyMap).filter((key) =>
      dependencyMap[key].includes(agentId),
    );

    const humanInterventionAgents = dependentAgents.filter(
      (agentId) => agentId === 'HITL',
    );

    if (humanInterventionAgents.length > 0) {
      //now we need to stop it here.
      //so we return here and wait for the users answer
      //so the frontend gets the popup then he answers it
      //another api is called whcih will update the status of the node with users answer in redis
      //in that method only, if he is accepting then we should resume this execution
      //it means we need to get the last executed agentId,
      //hows the thought processs so far or how wrong is this
    }

    for (const dependentAgentId of dependentAgents) {
      const dependencies = dependencyMap[dependentAgentId];

      const allDone = await Promise.all(
        dependencies.map((dependency: string) =>
          this.redis.sismember(
            `execution:${executionId}:completed`,
            dependency,
          ),
        ),
      );

      if (allDone.every((status) => status === 1)) {
        const agent = workflowGraph.nodes.find(
          (node: any) => node.id === dependentAgentId,
        );

        //now we need to get the output of all the dependencies and pass it as input
        let combinedOutput = '';
        for (const dependency of dependencies) {
          const output = await this.redis.get(
            `execution:${executionId}:agent:${dependency}:output`,
          );
          combinedOutput += output + '\n';
        }

        await this.OrchestratorQueue.add('execute-agent', {
          executionId,
          agentId: dependentAgentId,
          agent,
          input,
          combinedOutput,
        });
      }
    }

    // check if all agents are done
    const completedCount = await this.redis.scard(
      `execution:${executionId}:completed`,
    );
    const totalAgents = workflowGraph.nodes.length;

    if (completedCount === totalAgents) {
      await this.executionService.updateExecutionStatus(
        parseInt(executionId),
        'completed',
      );
    }
  }
}
