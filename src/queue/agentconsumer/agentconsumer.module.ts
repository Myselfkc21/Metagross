import { Module } from '@nestjs/common';
import { AgentConsumer } from './agentconsumer.processor';
import { BullModule } from '@nestjs/bullmq';
import { AgentModule } from 'src/service/agent/agent.module';
import { ExecutionModule } from 'src/modules/execution/execution.module';

@Module({
  imports: [
    BullModule.registerQueue({ name: 'orchestrator' }),
    AgentModule,
    ExecutionModule,
  ],
  providers: [AgentConsumer],
  exports: [AgentConsumer],
})
export class AgentConsumerModule {}
