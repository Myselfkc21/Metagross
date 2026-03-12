import { workflowGraph } from 'src/types/types';
export declare class DagService {
    buildDependencyMap(nodes: workflowGraph['nodes'], edges: workflowGraph['edges']): Record<string, string[]>;
    getReadyAgents(dependencyMap: Record<string, string[]>): string[];
}
