import { Execution } from 'src/database/entities/execution.entity';
import { Repository } from 'typeorm';
import { createExecutionDto } from './dto/create-execution.dto';
import { WorkflowService } from '../workflow/workflow.service';
import { AgentExecution } from 'src/database/entities/agent-execution.entity';
import { OrchestratorService } from 'src/service/orchestrator/orchestrator.service';
import { DagService } from 'src/service/dag/dag.service';
import { StreamService } from '../stream/stream.service';
export declare class ExecutionService {
    private readonly executionRepository;
    private readonly workflowService;
    private readonly agentExecutionRepository;
    private readonly orchestratorService;
    private readonly dagService;
    private readonly redis;
    private readonly streamService;
    constructor(executionRepository: Repository<Execution>, workflowService: WorkflowService, agentExecutionRepository: Repository<AgentExecution>, orchestratorService: OrchestratorService, dagService: DagService, redis: any, streamService: StreamService);
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
    getExecution(executionId: number): Promise<{
        success: number;
        message: string;
        data?: undefined;
    } | {
        success: number;
        message: string;
        data: {
            agents: AgentExecution[];
            id: number;
            workflow_id: number;
            input: string;
            status: string;
            start_time: Date;
            end_time: Date;
            created_at: Date;
            updated_at: Date;
            workflow: import("../../database/entities/workflow.entity").Workflow;
        };
    }>;
    getAllExecutions(page?: number, limit?: number): Promise<{
        success: number;
        message: string;
        data: {
            items: Execution[];
            pagination: {
                page: number;
                limit: number;
                total: number;
                totalPages: number;
            };
        };
    }>;
    processHITL(ack: string, executionId: number, agentId: string): Promise<{
        success: number;
        message: string;
    } | undefined>;
}
