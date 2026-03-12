"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrchestratorService = void 0;
const bullmq_1 = require("@nestjs/bullmq");
const common_1 = require("@nestjs/common");
const bullmq_2 = require("bullmq");
const dag_service_1 = require("../service/dag/dag.service");
const ioredis_1 = require("ioredis");
let OrchestratorService = class OrchestratorService {
    dagService;
    OrchestratorQueue;
    redis;
    constructor(dagService, OrchestratorQueue) {
        this.dagService = dagService;
        this.OrchestratorQueue = OrchestratorQueue;
        this.redis = new ioredis_1.default({
            host: 'localhost',
            port: 6379,
        });
    }
    async startInitialAgents(executionId, dependencyMap, workflowGraph) {
        const agentsTobeExecuted = this.dagService.getReadyAgents(dependencyMap);
        await this.redis.set(`execution:${executionId}:context`, JSON.stringify({ dependencyMap, workflowGraph }));
        await Promise.all(agentsTobeExecuted.map(async (agentId) => {
            const agent = workflowGraph.nodes.find((node) => node.id === agentId);
            await this.OrchestratorQueue.add('execute-agent', {
                executionId,
                agentId,
                agent,
            });
        }));
    }
};
exports.OrchestratorService = OrchestratorService;
exports.OrchestratorService = OrchestratorService = __decorate([
    (0, common_1.Injectable)(),
    __param(1, (0, bullmq_1.InjectQueue)('orchestrator')),
    __metadata("design:paramtypes", [dag_service_1.DagService,
        bullmq_2.Queue])
], OrchestratorService);
//# sourceMappingURL=orchestrator.service.js.map