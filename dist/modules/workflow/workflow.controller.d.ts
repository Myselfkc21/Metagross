import { WorkflowService } from './workflow.service';
import { CreateWorkflowDto } from './dto/create-workflow.dto';
import { Workflow } from 'src/database/entities/workflow.entity';
import { UpdateWorkflowDto } from './dto/update-workflow.dto';
export declare class WorkflowController {
    private readonly workflowService;
    constructor(workflowService: WorkflowService);
    createWorkflow(createWorkflowDto: CreateWorkflowDto): Promise<{
        success: number;
        message: string;
        data: Workflow;
    }>;
    getWorkflowById(id: number): Promise<{
        success: number;
        message: string;
        data: Workflow;
    }>;
    getAllWorkflows(): Promise<{
        success: number;
        message: string;
        data: Workflow[];
    }>;
    updateWorkflow(id: number, updateWorkflowDto: UpdateWorkflowDto): Promise<{
        success: number;
        message: string;
        data: Workflow;
    }>;
    deleteWorkflow(id: number): Promise<{
        success: number;
        message: string;
    }>;
}
