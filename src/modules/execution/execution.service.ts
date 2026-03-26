import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Execution } from 'src/database/entities/execution.entity';
import { Repository } from 'typeorm';
import { createExecutionDto } from './dto/create-execution.dto';
import { WorkflowService } from '../workflow/workflow.service';
import { AgentExecution } from 'src/database/entities/agent-execution.entity';
import { OrchestratorService } from 'src/service/orchestrator/orchestrator.service';
import { DagService } from 'src/service/dag/dag.service';
import { REDIS_CLIENT } from 'src/redis/redis.constants';

@Injectable()
export class ExecutionService {
  constructor(
    @InjectRepository(Execution)
    private readonly executionRepository: Repository<Execution>,
    private readonly workflowService: WorkflowService,
    @InjectRepository(AgentExecution)
    private readonly agentExecutionRepository: Repository<AgentExecution>,
    @Inject(forwardRef(() => OrchestratorService))
    private readonly orchestratorService: OrchestratorService,
    private readonly dagService: DagService,
    @Inject(REDIS_CLIENT) private readonly redis,
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

    const dependencyMap = this.dagService.buildDependencyMap(
      graph.nodes,
      graph.edges,
    );

    await this.orchestratorService.startInitialAgents(
      executionToSave.id.toString(),
      dependencyMap,
      graph,
      input,
    );

    return {
      success: true,
      message: 'Execution created successfully',
      data: executionToSave,
    };
  }

  async updateStatus(
    executionId: number,
    agentId: string,
    status: string,
    output?: string,
  ) {
    const agent = await this.agentExecutionRepository.findOneBy({
      execution_id: executionId,
      agent_id: agentId,
    });
    if (!agent) {
      console.log('Agent execution not found');
      return {
        success: 0,
        message: 'Agent execution not found',
      };
    }
    console.log(
      `Updating status of agent ${agentId} in execution ${executionId} to ${status}`,
    );
    agent.status = status;
    agent.end_time = new Date();
    agent.output = output ? output : '';
    await this.agentExecutionRepository.save(agent);

    return {
      success: 1,
      message: 'Agent execution updated successfully',
    };
  }

  async updateExecutionStatus(executionId: number, status: string) {
    const execution = await this.executionRepository.findOneBy({
      id: executionId,
    });
    if (!execution) {
      return {
        success: 0,
        message: 'Execution not found',
      };
    }
    execution.status = status;
    execution.end_time = new Date();
    await this.executionRepository.save(execution);

    return {
      success: 1,
      message: 'Execution updated successfully',
    };
  }

  async getExecution(executionId: number) {
    if (!Number.isInteger(executionId) || executionId <= 0) {
      return {
        success: 0,
        message: 'Invalid execution id',
      };
    }

    const execution = await this.executionRepository.findOne({
      where: { id: executionId },
      relations: ['workflow'],
    });
    if (!execution) {
      return {
        success: 0,
        message: 'Execution not found',
      };
    }
    const agentExecutions = await this.agentExecutionRepository.findBy({
      execution_id: executionId,
    });

    return {
      success: 1,
      message: 'Execution fetched successfully',
      data: {
        ...execution,
        agents: agentExecutions,
      },
    };
  }

  async getAllExecutions(page?: number, limit?: number) {
    const sanitizedPage = Number.isInteger(page) && page && page > 0 ? page : 1;
    const sanitizedLimit =
      Number.isInteger(limit) && limit && limit > 0 ? Math.min(limit, 100) : 10;
    const skip = (sanitizedPage - 1) * sanitizedLimit;

    const [executions, total] = await this.executionRepository.findAndCount({
      relations: ['workflow'],
      skip,
      take: sanitizedLimit,
      order: { id: 'DESC' },
    });

    return {
      success: 1,
      message: 'Executions fetched successfully',
      data: {
        items: executions,
        pagination: {
          page: sanitizedPage,
          limit: sanitizedLimit,
          total,
          totalPages: Math.ceil(total / sanitizedLimit),
        },
      },
    };
  }

  async processHITL(ack: string, executionId: number) {
    if (ack == 'reject') {
      const execution = await this.executionRepository.findOneByOrFail({
        id: executionId,
      });
      execution.status = 'canclled';
      await this.executionRepository.save(execution);
      const agentsExecution = await this.agentExecutionRepository.findBy({
        execution_id: executionId,
      });
      agentsExecution.map(async (agent) => {
        agent.status = 'canclled';
        await this.agentExecutionRepository.save(agent);
      });
    } else {
      //we call checkAgentStatus here right?
      const executionAgent = await this.redis.get(
        `execution:${executionId}:hitl:agent`,
      );
      const agentId = executionAgent ? executionAgent : '';
      await this.orchestratorService.checkAgentStatus(
        executionId.toString(),
        agentId,
      );
    }
  }
}
