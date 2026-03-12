"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const app_controller_1 = require("./app.controller");
const app_service_1 = require("./app.service");
const workflow_module_1 = require("./modules/workflow/workflow.module");
const execution_module_1 = require("./modules/execution/execution.module");
const orchestrator_module_1 = require("./orchestrator/orchestrator.module");
const dag_module_1 = require("./dag/dag.module");
const agent_module_1 = require("./agent/agent.module");
const stream_module_1 = require("./modules/stream/stream.module");
const typeorm_config_1 = require("./config/typeorm.config");
const typeorm_1 = require("@nestjs/typeorm");
const config_1 = require("@nestjs/config");
const nestjs_i18n_1 = require("nestjs-i18n");
const path_1 = require("path");
const bullmq_1 = require("@nestjs/bullmq");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            bullmq_1.BullModule.forRoot({
                connection: {
                    host: 'localhost',
                    port: 6379,
                },
            }),
            config_1.ConfigModule.forRoot({ isGlobal: true }),
            typeorm_1.TypeOrmModule.forRoot(typeorm_config_1.typeormConfig),
            nestjs_i18n_1.I18nModule.forRoot({
                fallbackLanguage: 'en',
                loaderOptions: {
                    path: (0, path_1.join)(__dirname, 'i18n'),
                    watch: true,
                },
                resolvers: [
                    new nestjs_i18n_1.QueryResolver(['lang', 'l']),
                    new nestjs_i18n_1.HeaderResolver(['x-custom-lang']),
                    nestjs_i18n_1.AcceptLanguageResolver,
                    nestjs_i18n_1.GraphQLWebsocketResolver,
                ],
            }),
            workflow_module_1.WorkflowModule,
            execution_module_1.ExecutionModule,
            orchestrator_module_1.OrchestratorModule,
            dag_module_1.DagModule,
            agent_module_1.AgentModule,
            stream_module_1.StreamModule,
        ],
        controllers: [app_controller_1.AppController],
        providers: [app_service_1.AppService],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map