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
exports.StreamController = void 0;
const common_1 = require("@nestjs/common");
const stream_service_1 = require("./stream.service");
let StreamController = class StreamController {
    streamService;
    constructor(streamService) {
        this.streamService = streamService;
    }
    stream(executionId, response) {
        this.streamService.addClient(executionId, response);
    }
};
exports.StreamController = StreamController;
__decorate([
    (0, common_1.Get)(':executionId'),
    __param(0, (0, common_1.Param)('executionId')),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], StreamController.prototype, "stream", null);
exports.StreamController = StreamController = __decorate([
    (0, common_1.Controller)('stream'),
    __metadata("design:paramtypes", [stream_service_1.StreamService])
], StreamController);
//# sourceMappingURL=stream.controller.js.map