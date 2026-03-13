import { forwardRef, Module } from '@nestjs/common';
import { OrchestratorService } from './orchestrator.service';
import { DagModule } from 'src/service/dag/dag.module';
import { BullModule } from '@nestjs/bullmq';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ExecutionModule } from 'src/modules/execution/execution.module';

@Module({
  imports: [
    DagModule,
    BullModule.registerQueue({ name: 'orchestrator' }),
    forwardRef(() => ExecutionModule),
  ],
  providers: [OrchestratorService],
  exports: [OrchestratorService],
})
export class OrchestratorModule {}
