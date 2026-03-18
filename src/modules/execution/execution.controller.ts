import { Body, Controller, Post } from '@nestjs/common';
import { ExecutionService } from './execution.service';
import { ApiBody, ApiOperation } from '@nestjs/swagger';
import { createExecutionDto } from './dto/create-execution.dto';

@Controller('execution')
export class ExecutionController {
  constructor(private readonly executionService: ExecutionService) {}

  @Post('execute')
  @ApiOperation({ summary: 'Run a workflow execution' })
  @ApiBody({ type: createExecutionDto })
  async runExecution(@Body() createExecutionDto: createExecutionDto) {
    return this.executionService.createExecution(createExecutionDto);
  }
}
