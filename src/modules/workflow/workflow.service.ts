import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Workflow } from 'src/database/entities/workflow.entity';
import { Repository } from 'typeorm';
import { CreateWorkflowDto } from './dto/create-workflow.dto';

@Injectable()
export class WorkflowService {
  constructor(
    @InjectRepository(Workflow)
    private workflowRepository: Repository<Workflow>,
  ) {}

  async createWorkflow(createWorkflowDto: CreateWorkflowDto) {
    const workflow = this.workflowRepository.create(createWorkflowDto);
    await this.workflowRepository.save(workflow);
    return {
      success: 1,
      message: 'common.company.created',
      data: workflow,
    };
  }

  async getWorkflowById(id: number) {
    const workflow = await this.workflowRepository.findOneBy({ id });
    if (!workflow) {
      throw new Error(`Workflow with id ${id} not found`);
    }
    return {
      success: 1,
      message: 'common.company.fetched',
      data: workflow,
    };
  }

  async getAllWorkflows() {
    const workflows = await this.workflowRepository.find();
    return {
      success: 1,
      message: 'common.company.fetched',
      data: workflows,
    };
  }
}
