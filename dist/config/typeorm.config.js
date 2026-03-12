"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.typeormConfig = void 0;
const typeorm_1 = require("typeorm");
const dotenv = require("dotenv");
dotenv.config();
exports.typeormConfig = {
    type: process.env.DATABASE_TYPE,
    host: process.env.DATABASE_HOST,
    username: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_DATABASE,
    port: process.env.DATABASE_PORT,
    synchronize: process.env.DATABASE_SYNCHRONIZE === 'true',
    logging: process.env.DATABASE_LOGGING === 'true',
    entities: ['**/*.entity.ts'],
    migrations: ['src/database/migrations/*-migration.ts'],
    migrationsTableName: 'migrations',
    autoLoadEntities: true,
    cli: {
        migrationsDir: 'src/database/migrations',
    },
};
console.log('typeormConfig', exports.typeormConfig);
exports.default = new typeorm_1.DataSource(exports.typeormConfig);
//# sourceMappingURL=typeorm.config.js.map