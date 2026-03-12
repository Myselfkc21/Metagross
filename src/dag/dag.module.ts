import { Module } from '@nestjs/common';
import { DagService } from './dag.service';
import { DagController } from './dag.controller';

@Module({
  controllers: [DagController],
  providers: [DagService],
})
export class DagModule {}
