import { Module } from '@nestjs/common';
import { OrchestratorService } from './orchestrator.service';
import { OrchestratorController } from './orchestrator.controller';
import { DagModule } from 'src/dag/dag.module';
import { BullModule } from '@nestjs/bullmq';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  imports: [DagModule, BullModule.registerQueue({ name: 'orchestrator' })],
  controllers: [OrchestratorController],
  providers: [OrchestratorService],
  exports: [OrchestratorService],
})
export class OrchestratorModule {}
