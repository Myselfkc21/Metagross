"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExecutionModule = void 0;
const common_1 = require("@nestjs/common");
const execution_service_1 = require("./execution.service");
const execution_controller_1 = require("./execution.controller");
const typeorm_1 = require("@nestjs/typeorm");
const execution_entity_1 = require("../../database/entities/execution.entity");
const workflow_module_1 = require("../workflow/workflow.module");
const agent_execution_entity_1 = require("../../database/entities/agent-execution.entity");
const dag_module_1 = require("../../service/dag/dag.module");
const orchestrator_module_1 = require("../../service/orchestrator/orchestrator.module");
const stream_module_1 = require("../stream/stream.module");
let ExecutionModule = class ExecutionModule {
};
exports.ExecutionModule = ExecutionModule;
exports.ExecutionModule = ExecutionModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([execution_entity_1.Execution, agent_execution_entity_1.AgentExecution]),
            workflow_module_1.WorkflowModule,
            dag_module_1.DagModule,
            stream_module_1.StreamModule,
            (0, common_1.forwardRef)(() => orchestrator_module_1.OrchestratorModule),
        ],
        controllers: [execution_controller_1.ExecutionController],
        providers: [execution_service_1.ExecutionService],
        exports: [execution_service_1.ExecutionService],
    })
], ExecutionModule);
//# sourceMappingURL=execution.module.js.map