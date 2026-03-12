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
exports.ExecutionService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const execution_entity_1 = require("../../database/entities/execution.entity");
const typeorm_2 = require("typeorm");
const workflow_service_1 = require("../workflow/workflow.service");
const agent_execution_entity_1 = require("../../database/entities/agent-execution.entity");
const orchestrator_service_1 = require("../../orchestrator/orchestrator.service");
const dag_service_1 = require("../../dag/dag.service");
let ExecutionService = class ExecutionService {
    executionRepository;
    workflowService;
    agentExecutionRepository;
    orchestratorService;
    dagService;
    constructor(executionRepository, workflowService, agentExecutionRepository, orchestratorService, dagService) {
        this.executionRepository = executionRepository;
        this.workflowService = workflowService;
        this.agentExecutionRepository = agentExecutionRepository;
        this.orchestratorService = orchestratorService;
        this.dagService = dagService;
    }
    async createExecution(executiondto) {
        const { workflowId, input } = executiondto;
        const workflow = await this.workflowService.getWorkflowById(workflowId);
        if (!workflow) {
            return {
                success: false,
                message: 'Workflow not found',
            };
        }
        const execution = new execution_entity_1.Execution();
        execution.workflow_id = workflowId;
        execution.input = input;
        execution.status = 'pending';
        execution.start_time = new Date();
        const executionToSave = await this.executionRepository.save(execution);
        const graph = workflow.data.graph;
        await Promise.all(graph.nodes.map(async (node) => {
            const agentExecution = new agent_execution_entity_1.AgentExecution();
            agentExecution.execution_id = executionToSave.id;
            agentExecution.agent_id = node.id;
            agentExecution.status = 'queue';
            await this.agentExecutionRepository.save(agentExecution);
        }));
        return {
            success: true,
            message: 'Execution created successfully',
            data: executionToSave,
        };
    }
};
exports.ExecutionService = ExecutionService;
exports.ExecutionService = ExecutionService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(execution_entity_1.Execution)),
    __param(2, (0, typeorm_1.InjectRepository)(agent_execution_entity_1.AgentExecution)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        workflow_service_1.WorkflowService,
        typeorm_2.Repository,
        orchestrator_service_1.OrchestratorService,
        dag_service_1.DagService])
], ExecutionService);
//# sourceMappingURL=execution.service.js.map