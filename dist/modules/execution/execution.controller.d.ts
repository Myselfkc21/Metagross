import { ExecutionService } from './execution.service';
import { createExecutionDto } from './dto/create-execution.dto';
export declare class ExecutionController {
    private readonly executionService;
    constructor(executionService: ExecutionService);
    getAllExecutions(): Promise<{
        success: number;
        message: string;
        data: import("../../database/entities/execution.entity").Execution[];
    }>;
    runExecution(createExecutionDto: createExecutionDto): Promise<{
        success: boolean;
        message: string;
        data?: undefined;
    } | {
        success: boolean;
        message: string;
        data: import("../../database/entities/execution.entity").Execution;
    }>;
    getExecutionStatus(executionId: number): Promise<{
        success: number;
        message: string;
        data?: undefined;
    } | {
        success: number;
        message: string;
        data: {
            agents: import("../../database/entities/agent-execution.entity").AgentExecution[];
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
}
