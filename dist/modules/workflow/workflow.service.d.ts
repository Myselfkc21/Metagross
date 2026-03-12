import { Workflow } from 'src/database/entities/workflow.entity';
import { Repository } from 'typeorm';
import { CreateWorkflowDto } from './dto/create-workflow.dto';
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
}
