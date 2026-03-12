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
exports.WorkflowController = void 0;
const common_1 = require("@nestjs/common");
const workflow_service_1 = require("./workflow.service");
const create_workflow_dto_1 = require("./dto/create-workflow.dto");
const swagger_1 = require("@nestjs/swagger");
const workflow_entity_1 = require("../../database/entities/workflow.entity");
let WorkflowController = class WorkflowController {
    workflowService;
    constructor(workflowService) {
        this.workflowService = workflowService;
    }
    async createWorkflow(createWorkflowDto) {
        return this.workflowService.createWorkflow(createWorkflowDto);
    }
    async getWorkflowById(id) {
        return this.workflowService.getWorkflowById(id);
    }
    async getAllWorkflows() {
        return this.workflowService.getAllWorkflows();
    }
};
exports.WorkflowController = WorkflowController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new workflow' }),
    (0, swagger_1.ApiBody)({ type: create_workflow_dto_1.CreateWorkflowDto }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: 'Workflow created successfully',
        type: workflow_entity_1.Workflow,
    }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Invalid input' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_workflow_dto_1.CreateWorkflowDto]),
    __metadata("design:returntype", Promise)
], WorkflowController.prototype, "createWorkflow", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get a workflow by ID' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Workflow fetched successfully',
        type: workflow_entity_1.Workflow,
    }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Workflow not found' }),
    __param(0, (0, common_1.Body)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], WorkflowController.prototype, "getWorkflowById", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get all workflows' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Workflows fetched successfully',
        type: [workflow_entity_1.Workflow],
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], WorkflowController.prototype, "getAllWorkflows", null);
exports.WorkflowController = WorkflowController = __decorate([
    (0, common_1.Controller)('workflow'),
    (0, swagger_1.ApiTags)('Workflow'),
    __metadata("design:paramtypes", [workflow_service_1.WorkflowService])
], WorkflowController);
//# sourceMappingURL=workflow.controller.js.map