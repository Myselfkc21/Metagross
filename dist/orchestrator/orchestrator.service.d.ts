import { Queue } from 'bullmq';
import { DagService } from 'src/service/dag/dag.service';
import { workflowGraph } from 'src/types/types';
export declare class OrchestratorService {
    private readonly dagService;
    private OrchestratorQueue;
    private redis;
    constructor(dagService: DagService, OrchestratorQueue: Queue);
    startInitialAgents(executionId: string, dependencyMap: Record<string, string[]>, workflowGraph: workflowGraph): Promise<void>;
}
