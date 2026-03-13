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
    try {
      const { executionId, agentId, agent, input, combinedOutput } = job.data;

      //updating the status of the agent in the database to running
      await this.executionService.updateStatus(executionId, agentId, 'running');

      //calling the openai service to run the agent and get the response
      const fullInput = combinedOutput
        ? `${input}\n\nContext from previous agents:\n${combinedOutput}`
        : input;

      console.log(`Executing agent ${agentId} with input:`, fullInput);
      const output = await this.agentService.sendMessage(
        {
          id: agentId,
          type: agent.type,
          prompt: agent.prompt,
          tools: agent.tools,
        },
        fullInput,
      );

      console.log(`Output from agent ${agentId}:`, output);
      //now we are gonna store the ages output in redis so that we can use this output when other agents are dependent on this agent and also we will update the status of the agent in the database to done
      await this.redis.set(
        `execution:${executionId}:agent:${agentId}:output`,
        JSON.stringify(output),
      );

      //updating the status of the agent in the database to done
      await this.executionService.updateStatus(
        executionId,
        agentId,
        'completed',
        output,
      );

      //now we need to publish this data
      const result = await this.redis.publish(
        'agent-completed',
        JSON.stringify({ executionId, agentId }),
      );
      console.log('Published to agent-completed, receivers:', result);
    } catch (error) {
      console.error('Error processing job:', error);
      throw error;
    }
  }
}
