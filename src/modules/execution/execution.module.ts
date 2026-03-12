import { Module } from '@nestjs/common';
import { ExecutionService } from './execution.service';
import { ExecutionController } from './execution.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Execution } from 'src/database/entities/execution.entity';
import { WorkflowModule } from '../workflow/workflow.module';
import { AgentExecution } from 'src/database/entities/agent-execution.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Execution, AgentExecution]),
    WorkflowModule,
  ],
  controllers: [ExecutionController],
  providers: [ExecutionService],
})
export class ExecutionModule {}
