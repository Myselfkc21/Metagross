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
exports.ExecutionController = void 0;
const common_1 = require("@nestjs/common");
const execution_service_1 = require("./execution.service");
const swagger_1 = require("@nestjs/swagger");
const create_execution_dto_1 = require("./dto/create-execution.dto");
let ExecutionController = class ExecutionController {
    executionService;
    constructor(executionService) {
        this.executionService = executionService;
    }
    async getAllExecutions(page, limit) {
        const parsedPage = Number(page);
        const parsedLimit = Number(limit);
        return this.executionService.getAllExecutions(parsedPage, parsedLimit);
    }
    async runExecution(createExecutionDto) {
        return this.executionService.createExecution(createExecutionDto);
    }
    async getExecutionStatus(executionId) {
        return this.executionService.getExecution(executionId);
    }
    async InterventionStatus(executionId, agentId, status) {
        return this.executionService.processHITL(status, executionId, agentId);
    }
};
exports.ExecutionController = ExecutionController;
__decorate([
    (0, common_1.Get)(''),
    (0, swagger_1.ApiOperation)({ summary: 'Get all executions' }),
    (0, swagger_1.ApiQuery)({ name: 'page', required: false, type: Number, example: 1 }),
    (0, swagger_1.ApiQuery)({ name: 'limit', required: false, type: Number, example: 10 }),
    __param(0, (0, common_1.Query)('page')),
    __param(1, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], ExecutionController.prototype, "getAllExecutions", null);
__decorate([
    (0, common_1.Post)('execute'),
    (0, swagger_1.ApiOperation)({ summary: 'Run a workflow execution' }),
    (0, swagger_1.ApiBody)({ type: create_execution_dto_1.createExecutionDto }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_execution_dto_1.createExecutionDto]),
    __metadata("design:returntype", Promise)
], ExecutionController.prototype, "runExecution", null);
__decorate([
    (0, common_1.Get)('/:executionId'),
    (0, swagger_1.ApiOperation)({ summary: 'Get the single execution' }),
    (0, swagger_1.ApiParam)({ name: 'executionId', type: Number, required: true }),
    __param(0, (0, common_1.Param)('executionId', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], ExecutionController.prototype, "getExecutionStatus", null);
__decorate([
    (0, common_1.Patch)('/:executionId/:agentId/:status'),
    (0, swagger_1.ApiOperation)({ summary: 'accept or reject the agents flow' }),
    (0, swagger_1.ApiParam)({ name: 'executionId', type: Number, required: true }),
    __param(0, (0, common_1.Param)('executionId', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Param)('agentId')),
    __param(2, (0, common_1.Param)('status')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, String, String]),
    __metadata("design:returntype", Promise)
], ExecutionController.prototype, "InterventionStatus", null);
exports.ExecutionController = ExecutionController = __decorate([
    (0, common_1.Controller)('execution'),
    __metadata("design:paramtypes", [execution_service_1.ExecutionService])
], ExecutionController);
//# sourceMappingURL=execution.controller.js.map