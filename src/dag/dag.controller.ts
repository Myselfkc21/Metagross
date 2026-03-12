import { Controller } from '@nestjs/common';
import { DagService } from './dag.service';

@Controller('dag')
export class DagController {
  constructor(private readonly dagService: DagService) {}
}
