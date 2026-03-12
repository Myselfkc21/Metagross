import { Module } from '@nestjs/common';
import { ExecutionService } from './execution.service';
import { ExecutionController } from './execution.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Execution } from 'src/database/entities/execution.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Execution])],
  controllers: [ExecutionController],
  providers: [ExecutionService],
})
export class ExecutionModule {}
