import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Inject } from '@nestjs/common';
import { Job } from 'bullmq';
import Redis from 'ioredis';
import { ExecutionService } from 'src/modules/execution/execution.service';
import { AgentService } from 'src/service/agent/agent.service';
import { REDIS_CLIENT } from 'src/redis/redis.constants';
import { StreamService } from 'src/modules/stream/stream.service';

@Processor('orchestrator')
export class AgentConsumer extends WorkerHost {
  constructor(
    private readonly agentService: AgentService,
    private readonly executionService: ExecutionService,
    private readonly streamService: StreamService,
    @Inject(REDIS_CLIENT) private readonly redis: Redis,
  ) {
    super();
  }
  async process(job: Job) {
    try {
      const { executionId, agentId, agent, input, combinedOutput } = job.data;

      //updating the status of the agent in the database to running
      await this.executionService.updateStatus(executionId, agentId, 'running');
      this.streamService.emit(executionId, { agentId, status: 'running' });
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

      this.streamService.emit(executionId, {
        agentId,
        status: 'completed',
        output,
      });

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
