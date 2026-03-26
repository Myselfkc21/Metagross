import { forwardRef, Module } from '@nestjs/common';
import { ExecutionService } from './execution.service';
import { ExecutionController } from './execution.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Execution } from 'src/database/entities/execution.entity';
import { WorkflowModule } from '../workflow/workflow.module';
import { AgentExecution } from 'src/database/entities/agent-execution.entity';
import { DagModule } from 'src/service/dag/dag.module';
import { OrchestratorModule } from 'src/service/orchestrator/orchestrator.module';
import { StreamModule } from '../stream/stream.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Execution, AgentExecution]),
    WorkflowModule,
    DagModule,
    StreamModule,
    forwardRef(() => OrchestratorModule),
  ],
  controllers: [ExecutionController],
  providers: [ExecutionService],
  exports: [ExecutionService],
})
export class ExecutionModule {}
