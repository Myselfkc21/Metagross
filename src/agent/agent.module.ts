import { Module } from '@nestjs/common';
import { AgentService } from './agent.service';
import { AgentController } from './agent.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AgentExecution } from 'src/database/entities/agent-execution.entity';

@Module({
  imports: [TypeOrmModule.forFeature([AgentExecution])],
  controllers: [AgentController],
  providers: [AgentService],
})
export class AgentModule {}
