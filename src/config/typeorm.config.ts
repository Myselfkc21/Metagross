import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';
dotenv.config();
export const typeormConfig = {
  type: process.env.DATABASE_TYPE as any,
  host: process.env.DATABASE_HOST,
  username: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_DATABASE,
  port: process.env.DATABASE_PORT,
  synchronize: process.env.DATABASE_SYNCHRONIZE === 'true',
  logging: process.env.DATABASE_LOGGING === 'true',
  entities: ['**/*.entity.ts'],
  migrations: ['src/database/migrations/*.ts'],
  migrationsTableName: 'migrations',
  autoLoadEntities: true,
  cli: {
    migrationsDir: 'src/database/migrations',
  },
};

console.log('typeormConfig', typeormConfig);
export default new DataSource(typeormConfig);
