import { Controller } from '@nestjs/common';
import { ExecutionService } from './execution.service';

@Controller('execution')
export class ExecutionController {
  constructor(private readonly executionService: ExecutionService) {}
}
