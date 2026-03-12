import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { OpenaiService } from './service/openai.service';
import { WorkflowModule } from './modules/workflow/workflow.module';
import { ExecutionModule } from './modules/execution/execution.module';
import { OrchestratorModule } from './orchestrator/orchestrator.module';
import { DagModule } from './dag/dag.module';
import { AgentModule } from './agent/agent.module';
import { StreamModule } from './modules/stream/stream.module';
import { typeormConfig } from './config/typeorm.config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import {
  AcceptLanguageResolver,
  GraphQLWebsocketResolver,
  HeaderResolver,
  I18nModule,
  QueryResolver,
} from 'nestjs-i18n';
import { join } from 'path';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot(typeormConfig),
    I18nModule.forRoot({
      fallbackLanguage: 'en',
      loaderOptions: {
        path: join(__dirname, 'i18n'),
        watch: true,
      },
      resolvers: [
        new QueryResolver(['lang', 'l']),
        new HeaderResolver(['x-custom-lang']),
        AcceptLanguageResolver,
        GraphQLWebsocketResolver,
      ],
    }),
    WorkflowModule,
    ExecutionModule,
    OrchestratorModule,
    DagModule,
    AgentModule,
    StreamModule,
  ],
  controllers: [AppController],
  providers: [AppService, OpenaiService],
})
export class AppModule {}
