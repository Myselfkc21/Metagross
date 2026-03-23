import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
} from '@nestjs/common';
import { ExecutionService } from './execution.service';
import { ApiBody, ApiOperation, ApiParam } from '@nestjs/swagger';
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

  @Get('/:executionId')
  @ApiOperation({ summary: 'Get the single execution' })
  @ApiParam({ name: 'executionId', type: Number, required: true })
  async getExecutionStatus(
    @Param('executionId', ParseIntPipe) executionId: number,
  ) {
    return this.executionService.getExecution(executionId);
  }

  @Get('')
  @ApiOperation({ summary: 'Get all executions' })
  async getAllExecutions() {
    return this.executionService.getAllExecutions();
  }
}
