import { Module } from '@nestjs/common';
import { DagService } from './dag.service';
@Module({
  providers: [DagService],
})
export class DagModule {}
