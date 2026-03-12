import { Execution } from 'src/database/entities/execution.entity';
import { Repository } from 'typeorm';
import { createExecutionDto } from './dto/create-execution.dto';
import { WorkflowService } from '../workflow/workflow.service';
import { AgentExecution } from 'src/database/entities/agent-execution.entity';
export declare class ExecutionService {
    private readonly executionRepository;
    private readonly workflowService;
    private readonly agentExecutionRepository;
    constructor(executionRepository: Repository<Execution>, workflowService: WorkflowService, agentExecutionRepository: Repository<AgentExecution>);
    createExecution(executiondto: createExecutionDto): Promise<{
        success: boolean;
        message: string;
        data?: undefined;
    } | {
        success: boolean;
        message: string;
        data: Execution;
    }>;
}
