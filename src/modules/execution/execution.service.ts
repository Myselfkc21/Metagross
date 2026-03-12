import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Execution } from 'src/database/entities/execution.entity';
import { Repository } from 'typeorm';
import { createExecutionDto } from './dto/create-execution.dto';
import { WorkflowService } from '../workflow/workflow.service';
import { AgentExecution } from 'src/database/entities/agent-execution.entity';
import { OrchestratorService } from 'src/service/orchestrator/orchestrator.service';
import { DagService } from 'src/service/dag/dag.service';

@Injectable()
export class ExecutionService {
  constructor(
    @InjectRepository(Execution)
    private readonly executionRepository: Repository<Execution>,
    private readonly workflowService: WorkflowService,
    @InjectRepository(AgentExecution)
    private readonly agentExecutionRepository: Repository<AgentExecution>,
    private readonly orchestratorService: OrchestratorService,
    private readonly dagService: DagService,
  ) {}

  async createExecution(executiondto: createExecutionDto) {
    const { workflowId, input } = executiondto;
    const workflow = await this.workflowService.getWorkflowById(workflowId);

    if (!workflow) {
      return {
        success: false,
        message: 'Workflow not found',
      };
    }
    const execution = new Execution();
    execution.workflow_id = workflowId;
    execution.input = input;
    execution.status = 'pending';
    execution.start_time = new Date();

    const executionToSave = await this.executionRepository.save(execution);

    //looping through the dag to get the agents and setting their status to queue

    const graph = workflow.data.graph;
    await Promise.all(
      graph.nodes.map(async (node) => {
        const agentExecution = new AgentExecution();
        agentExecution.execution_id = executionToSave.id;
        agentExecution.agent_id = node.id;
        agentExecution.status = 'queue';
        await this.agentExecutionRepository.save(agentExecution);
      }),
    );

    return {
      success: true,
      message: 'Execution created successfully',
      data: executionToSave,
    };
  }
}
