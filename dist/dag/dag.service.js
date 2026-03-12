"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DagService = void 0;
const common_1 = require("@nestjs/common");
let DagService = class DagService {
    buildDependencyMap(nodes, edges) {
        const dependencyMap = {};
        const nodeIds = new Set(nodes.map((node) => node.id));
        for (const edge of edges) {
            const { source, target } = edge;
            if (!nodeIds.has(source) || !nodeIds.has(target)) {
                throw new Error(`Invalid edge: source (${source}) or target (${target}) does not exist in nodes.`);
            }
            if (!dependencyMap[target]) {
                dependencyMap[target] = [];
            }
            dependencyMap[target].push(source);
        }
        for (const nodeId of nodeIds) {
            if (!dependencyMap[nodeId]) {
                dependencyMap[nodeId] = [];
            }
        }
        return dependencyMap;
    }
    getReadyAgents(dependencyMap) {
        const readyAgents = [];
        for (let agentId in dependencyMap) {
            if (dependencyMap[agentId].length === 0) {
                readyAgents.push(agentId);
            }
        }
        return readyAgents;
    }
};
exports.DagService = DagService;
exports.DagService = DagService = __decorate([
    (0, common_1.Injectable)()
], DagService);
//# sourceMappingURL=dag.service.js.map