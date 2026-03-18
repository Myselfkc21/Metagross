import { Workflow } from 'src/database/entities/workflow.entity';
import { Repository } from 'typeorm';
import { CreateWorkflowDto } from './dto/create-workflow.dto';
import { UpdateWorkflowDto } from './dto/update-workflow.dto';
export declare class WorkflowService {
    private workflowRepository;
    constructor(workflowRepository: Repository<Workflow>);
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
}
