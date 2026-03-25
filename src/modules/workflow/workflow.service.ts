import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Workflow } from 'src/database/entities/workflow.entity';
import { Repository } from 'typeorm';
import { CreateWorkflowDto } from './dto/create-workflow.dto';
import { UpdateWorkflowDto } from './dto/update-workflow.dto';

@Injectable()
export class WorkflowService {
  constructor(
    @InjectRepository(Workflow)
    private workflowRepository: Repository<Workflow>,
  ) {}

  async createWorkflow(createWorkflowDto: CreateWorkflowDto) {
    const { name } = createWorkflowDto;
    const workflow = new Workflow();
    workflow.name = name;
    workflow.graph = createWorkflowDto.graph || {};
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

  async getAllWorkflows(page?: number, limit?: number) {
    const sanitizedPage =
      Number.isInteger(page) && page && page > 0 ? page : 1;
    const sanitizedLimit =
      Number.isInteger(limit) && limit && limit > 0
        ? Math.min(limit, 100)
        : 10;
    const skip = (sanitizedPage - 1) * sanitizedLimit;

    const [workflows, total] = await this.workflowRepository.findAndCount({
      skip,
      take: sanitizedLimit,
      order: { id: 'DESC' },
    });

    return {
      success: 1,
      message: 'common.company.fetched',
      data: {
        items: workflows,
        pagination: {
          page: sanitizedPage,
          limit: sanitizedLimit,
          total,
          totalPages: Math.ceil(total / sanitizedLimit),
        },
      },
    };
  }

  async updateWorkflow(id: number, updateWorkflowDto: UpdateWorkflowDto) {
    console.log('updateWorkflowDto', updateWorkflowDto.graph?.nodes);
    const workflow = await this.workflowRepository.findOneBy({ id });
    if (!workflow) {
      throw new Error(`Workflow with id ${id} not found`);
    }
    const updatedWorkflow = new Workflow();
    updatedWorkflow.id = workflow.id;
    updatedWorkflow.name = updateWorkflowDto.name || workflow.name;
    updatedWorkflow.graph = updateWorkflowDto.graph || workflow.graph;
    await this.workflowRepository.save(updatedWorkflow);
    return {
      success: 1,
      message: 'common.company.updated',
      data: updatedWorkflow,
    };
  }

  async deleteWorkflow(id: number) {
    const workflow = await this.workflowRepository.findOneBy({ id });
    if (!workflow) {
      return {
        success: 0,
        message: 'Workflow not found',
      };
    }
    await this.workflowRepository.delete(id);
    return {
      success: 1,
      message: 'common.company.deleted',
    };
  }
}
