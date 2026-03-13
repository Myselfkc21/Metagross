import { ExecutionService } from './execution.service';
import { createExecutionDto } from './dto/create-execution.dto';
export declare class ExecutionController {
    private readonly executionService;
    constructor(executionService: ExecutionService);
    runExecution(createExecutionDto: createExecutionDto): Promise<{
        success: boolean;
        message: string;
        data?: undefined;
    } | {
        success: boolean;
        message: string;
        data: import("../../database/entities/execution.entity").Execution;
    }>;
}
