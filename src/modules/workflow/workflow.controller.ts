import { Body, Controller, Get, Post } from '@nestjs/common';
import { WorkflowService } from './workflow.service';
import { CreateWorkflowDto } from './dto/create-workflow.dto';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Workflow } from 'src/database/entities/workflow.entity';

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
  async getWorkflowById(@Body('id') id: number) {
    return this.workflowService.getWorkflowById(id);
  }

  @Get()
  @ApiOperation({ summary: 'Get all workflows' })
  @ApiResponse({
    status: 200,
    description: 'Workflows fetched successfully',
    type: [Workflow],
  })
  async getAllWorkflows() {
    return this.workflowService.getAllWorkflows();
  }
}
