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
Object.defineProperty(exports, "__esModule", { value: true });
exports.StreamService = void 0;
const common_1 = require("@nestjs/common");
let StreamService = class StreamService {
    clients = new Map();
    constructor() {
        console.log('StreamService instance created');
    }
    addClient(executionId, response) {
        response.setHeader('Content-Type', 'text/event-stream');
        response.setHeader('Cache-Control', 'no-cache');
        response.setHeader('Connection', 'keep-alive');
        response.write(`data: ${JSON.stringify({ status: 'connected' })}\n\n`);
        const existing = this.clients.get(executionId) || [];
        this.clients.set(executionId, [...existing, response]);
        response.on('close', () => {
            const updated = (this.clients.get(executionId) || []).filter((r) => r !== response);
            if (updated.length === 0) {
                this.clients.delete(executionId);
            }
            else {
                this.clients.set(executionId, updated);
            }
        });
    }
    emit(executionId, data) {
        console.log(`Emitting data for executionId ${executionId}:`, data);
        const clients = this.clients.get(executionId) || [];
        console.log(`Emitting to ${clients.length} clients for executionId ${executionId}:`, data);
        const message = `data: ${JSON.stringify(data)}\n\n`;
        clients.forEach((res) => res.write(message));
    }
};
exports.StreamService = StreamService;
exports.StreamService = StreamService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], StreamService);
//# sourceMappingURL=stream.service.js.map