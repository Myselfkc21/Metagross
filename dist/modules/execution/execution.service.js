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
const orchestrator_service_1 = require("../../service/orchestrator/orchestrator.service");
const dag_service_1 = require("../../service/dag/dag.service");
const redis_constants_1 = require("../../redis/redis.constants");
let ExecutionService = class ExecutionService {
    executionRepository;
    workflowService;
    agentExecutionRepository;
    orchestratorService;
    dagService;
    redis;
    constructor(executionRepository, workflowService, agentExecutionRepository, orchestratorService, dagService, redis) {
        this.executionRepository = executionRepository;
        this.workflowService = workflowService;
        this.agentExecutionRepository = agentExecutionRepository;
        this.orchestratorService = orchestratorService;
        this.dagService = dagService;
        this.redis = redis;
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
        const dependencyMap = this.dagService.buildDependencyMap(graph.nodes, graph.edges);
        await this.orchestratorService.startInitialAgents(executionToSave.id.toString(), dependencyMap, graph, input);
        return {
            success: true,
            message: 'Execution created successfully',
            data: executionToSave,
        };
    }
    async updateStatus(executionId, agentId, status, output) {
        const agent = await this.agentExecutionRepository.findOneBy({
            execution_id: executionId,
            agent_id: agentId,
        });
        if (!agent) {
            console.log('Agent execution not found');
            return {
                success: 0,
                message: 'Agent execution not found',
            };
        }
        console.log(`Updating status of agent ${agentId} in execution ${executionId} to ${status}`);
        agent.status = status;
        agent.end_time = new Date();
        agent.output = output ? output : '';
        await this.agentExecutionRepository.save(agent);
        return {
            success: 1,
            message: 'Agent execution updated successfully',
        };
    }
    async updateExecutionStatus(executionId, status) {
        const execution = await this.executionRepository.findOneBy({
            id: executionId,
        });
        if (!execution) {
            return {
                success: 0,
                message: 'Execution not found',
            };
        }
        execution.status = status;
        execution.end_time = new Date();
        await this.executionRepository.save(execution);
        return {
            success: 1,
            message: 'Execution updated successfully',
        };
    }
    async getExecution(executionId) {
        if (!Number.isInteger(executionId) || executionId <= 0) {
            return {
                success: 0,
                message: 'Invalid execution id',
            };
        }
        const execution = await this.executionRepository.findOne({
            where: { id: executionId },
            relations: ['workflow'],
        });
        if (!execution) {
            return {
                success: 0,
                message: 'Execution not found',
            };
        }
        const agentExecutions = await this.agentExecutionRepository.findBy({
            execution_id: executionId,
        });
        return {
            success: 1,
            message: 'Execution fetched successfully',
            data: {
                ...execution,
                agents: agentExecutions,
            },
        };
    }
    async getAllExecutions(page, limit) {
        const sanitizedPage = Number.isInteger(page) && page && page > 0 ? page : 1;
        const sanitizedLimit = Number.isInteger(limit) && limit && limit > 0 ? Math.min(limit, 100) : 10;
        const skip = (sanitizedPage - 1) * sanitizedLimit;
        const [executions, total] = await this.executionRepository.findAndCount({
            relations: ['workflow'],
            skip,
            take: sanitizedLimit,
            order: { id: 'DESC' },
        });
        return {
            success: 1,
            message: 'Executions fetched successfully',
            data: {
                items: executions,
                pagination: {
                    page: sanitizedPage,
                    limit: sanitizedLimit,
                    total,
                    totalPages: Math.ceil(total / sanitizedLimit),
                },
            },
        };
    }
    async processHITL(ack, executionId) {
        if (ack == 'reject') {
            const execution = await this.executionRepository.findOneByOrFail({
                id: executionId,
            });
            execution.status = 'canclled';
            await this.executionRepository.save(execution);
            const agentsExecution = await this.agentExecutionRepository.findBy({
                execution_id: executionId,
            });
            agentsExecution.map(async (agent) => {
                agent.status = 'canclled';
                await this.agentExecutionRepository.save(agent);
            });
        }
        else {
            const executionAgent = await this.redis.get(`execution:${executionId}:hitl:agent`);
            const agentId = executionAgent ? executionAgent : '';
            await this.orchestratorService.checkAgentStatus(executionId.toString(), agentId);
        }
    }
};
exports.ExecutionService = ExecutionService;
exports.ExecutionService = ExecutionService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(execution_entity_1.Execution)),
    __param(2, (0, typeorm_1.InjectRepository)(agent_execution_entity_1.AgentExecution)),
    __param(3, (0, common_1.Inject)((0, common_1.forwardRef)(() => orchestrator_service_1.OrchestratorService))),
    __param(5, (0, common_1.Inject)(redis_constants_1.REDIS_CLIENT)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        workflow_service_1.WorkflowService,
        typeorm_2.Repository,
        orchestrator_service_1.OrchestratorService,
        dag_service_1.DagService, Object])
], ExecutionService);
//# sourceMappingURL=execution.service.js.map