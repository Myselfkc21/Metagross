import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ExecutionService } from './execution.service';
import { ApiBody, ApiOperation, ApiParam, ApiQuery } from '@nestjs/swagger';
import { createExecutionDto } from './dto/create-execution.dto';

@Controller('execution')
export class ExecutionController {
  constructor(private readonly executionService: ExecutionService) {}

  @Get('')
  @ApiOperation({ summary: 'Get all executions' })
  @ApiQuery({ name: 'page', required: false, type: Number, example: 1 })
  @ApiQuery({ name: 'limit', required: false, type: Number, example: 10 })
  async getAllExecutions(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    const parsedPage = Number(page);
    const parsedLimit = Number(limit);

    return this.executionService.getAllExecutions(parsedPage, parsedLimit);
  }

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

  @Patch('/:executionId/:agentId/:status')
  @ApiOperation({ summary: 'accept or reject the agents flow' })
  @ApiParam({ name: 'executionId', type: Number, required: true })
  async InterventionStatus(
    @Param('executionId', ParseIntPipe) executionId: number,
    @Param('agentId') agentId: string,
    @Param('status') status: string,
  ) {
    return this.executionService.processHITL(status, executionId, agentId);
  }
}
