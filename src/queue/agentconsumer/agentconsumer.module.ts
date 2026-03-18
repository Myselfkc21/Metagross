import { Module } from '@nestjs/common';
import { AgentConsumer } from './agentconsumer.processor';
import { BullModule } from '@nestjs/bullmq';
import { AgentModule } from 'src/service/agent/agent.module';
import { ExecutionModule } from 'src/modules/execution/execution.module';
import { StreamModule } from 'src/modules/stream/stream.module';

@Module({
  imports: [
    BullModule.registerQueue({ name: 'orchestrator' }),
    AgentModule,
    ExecutionModule,
    StreamModule,
  ],
  providers: [AgentConsumer],
  exports: [AgentConsumer],
})
export class AgentConsumerModule {}
