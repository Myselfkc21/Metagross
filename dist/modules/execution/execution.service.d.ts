import { Execution } from 'src/database/entities/execution.entity';
import { Repository } from 'typeorm';
import { createExecutionDto } from './dto/create-execution.dto';
import { WorkflowService } from '../workflow/workflow.service';
import { AgentExecution } from 'src/database/entities/agent-execution.entity';
import { OrchestratorService } from 'src/service/orchestrator/orchestrator.service';
import { DagService } from 'src/service/dag/dag.service';
export declare class ExecutionService {
    private readonly executionRepository;
    private readonly workflowService;
    private readonly agentExecutionRepository;
    private readonly orchestratorService;
    private readonly dagService;
    constructor(executionRepository: Repository<Execution>, workflowService: WorkflowService, agentExecutionRepository: Repository<AgentExecution>, orchestratorService: OrchestratorService, dagService: DagService);
    createExecution(executiondto: createExecutionDto): Promise<{
        success: boolean;
        message: string;
        data?: undefined;
    } | {
        success: boolean;
        message: string;
        data: Execution;
    }>;
    updateStatus(executionId: number, agentId: string, status: string, output?: string): Promise<{
        success: number;
        message: string;
    }>;
    updateExecutionStatus(executionId: number, status: string): Promise<{
        success: number;
        message: string;
    }>;
}
