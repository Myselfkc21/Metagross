import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { WorkflowService } from './workflow.service';
import { CreateWorkflowDto } from './dto/create-workflow.dto';
import {
  ApiBody,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Workflow } from 'src/database/entities/workflow.entity';
import { UpdateWorkflowDto } from './dto/update-workflow.dto';

@Controller('workflow')
@ApiTags('Workflow')
export class WorkflowController {
  constructor(private readonly workflowService: WorkflowService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new workflow' })
  @ApiBody({ type: CreateWorkflowDto })
  @ApiResponse({
    status: 201,
    description: 'Workflow created successfully',
    type: Workflow,
  })
  @ApiResponse({ status: 400, description: 'Invalid input' })
  async createWorkflow(@Body() createWorkflowDto: CreateWorkflowDto) {
    return this.workflowService.createWorkflow(createWorkflowDto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a workflow by ID' })
  @ApiResponse({
    status: 200,
    description: 'Workflow fetched successfully',
    type: Workflow,
  })
  @ApiResponse({ status: 404, description: 'Workflow not found' })
  async getWorkflowById(@Param('id', ParseIntPipe) id: number) {
    return this.workflowService.getWorkflowById(id);
  }

  @Get()
  @ApiOperation({ summary: 'Get all workflows' })
  @ApiResponse({
    status: 200,
    description: 'Workflows fetched successfully',
    type: [Workflow],
  })
  @ApiQuery({ name: 'page', required: false, type: Number, example: 1 })
  @ApiQuery({ name: 'limit', required: false, type: Number, example: 10 })
  async getAllWorkflows(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    const parsedPage = Number(page);
    const parsedLimit = Number(limit);

    return this.workflowService.getAllWorkflows(parsedPage, parsedLimit);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a workflow by ID' })
  @ApiBody({ type: UpdateWorkflowDto })
  @ApiResponse({
    status: 200,
    description: 'Workflow updated successfully',
    type: Workflow,
  })
  @ApiResponse({ status: 400, description: 'Invalid input' })
  @ApiResponse({ status: 404, description: 'Workflow not found' })
  async updateWorkflow(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateWorkflowDto: UpdateWorkflowDto,
  ) {
    return this.workflowService.updateWorkflow(id, updateWorkflowDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a workflow by ID' })
  @ApiResponse({ status: 200, description: 'Workflow deleted successfully' })
  @ApiResponse({ status: 404, description: 'Workflow not found' })
  async deleteWorkflow(@Param('id', ParseIntPipe) id: number) {
    // Implement delete functionality in the service and call it here
    return this.workflowService.deleteWorkflow(id);
  }
}
