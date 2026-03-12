import { Injectable } from '@nestjs/common';
import { workflowGraph } from 'src/types/types';

@Injectable()
export class DagService {
  buildDependencyMap(
    nodes: workflowGraph['nodes'],
    edges: workflowGraph['edges'],
  ) {
    const dependencyMap: Record<string, string[]> = {};

    /* this is the old implementation which is O(n*m) where n is number of nodes and m is number of edges. The new implementation is O(n+m) */
    // for (const node of nodes) {
    //   const currentNodeId = node.id;
    //   dependencyMap[currentNodeId] = [];

    //   for (const edge of edges) {
    //     if (edge.target === currentNodeId) {
    //       dependencyMap[currentNodeId].push(edge.source);
    //     }
    //   }
    // }
    // return dependencyMap;

    // this is the new implementation which is O(n+m)
    const nodeIds = new Set(nodes.map((node) => node.id));

    for (const edge of edges) {
      const { source, target } = edge;

      if (!nodeIds.has(source) || !nodeIds.has(target)) {
        throw new Error(
          `Invalid edge: source (${source}) or target (${target}) does not exist in nodes.`,
        );
      }

      if (!dependencyMap[target]) {
        dependencyMap[target] = [];
      }
      dependencyMap[target].push(source);
    }

    // Ensure all nodes are present in the dependency map, even if they have no dependencies
    for (const nodeId of nodeIds) {
      if (!dependencyMap[nodeId]) {
        dependencyMap[nodeId] = [];
      }
    }

    return dependencyMap;
  }

  getReadyAgents(dependencyMap: Record<string, string[]>) {
    const readyAgents: string[] = [];

    for (let agentId in dependencyMap) {
      if (dependencyMap[agentId].length === 0) {
        readyAgents.push(agentId);
      }
    }

    return readyAgents;
  }
}
