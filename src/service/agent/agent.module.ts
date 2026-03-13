import { Module } from '@nestjs/common';
import { AgentService } from './agent.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AgentExecution } from 'src/database/entities/agent-execution.entity';

@Module({
  imports: [TypeOrmModule.forFeature([AgentExecution])],
  providers: [AgentService],
  exports: [AgentService],
})
export class AgentModule {}
