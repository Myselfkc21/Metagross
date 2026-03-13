import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Job } from 'bullmq';
import Redis from 'ioredis';
import { ExecutionService } from 'src/modules/execution/execution.service';
import { AgentService } from 'src/service/agent/agent.service';

@Processor('orchestrator')
export class AgentConsumer extends WorkerHost {
  private redis: Redis;

  constructor(
    private readonly agentService: AgentService,
    private readonly executionService: ExecutionService,
  ) {
    super();
    this.redis = new Redis({
      host: 'localhost',
      port: 6379,
    });
  }
  async process(job: Job) {
    const { executionId, agentId, agent, input } = job.data;

    console.log('job data in consumer', job.data);
    //updating the status of the agent in the database to running
    await this.executionService.updateStatus(executionId, agentId, 'running');

    console.log('agent is running', agentId);
    //calling the openai service to run the agent and get the response
    const output = await this.agentService.sendMessage(
      { id: agentId, type: agent.type, prompt: agent.prompt },
      input,
    );
    console.log('output from agent service', output);
    //updating the status of the agent in the database to done
    await this.executionService.updateStatus(
      executionId,
      agentId,
      'completed',
      output,
    );

    //now we need to publish this data
    await this.redis.publish(
      'agent-completed',
      JSON.stringify({ executionId, agentId }),
    );
  }
}
