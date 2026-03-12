import { DataSource } from 'typeorm';
export declare const typeormConfig: {
    type: any;
    host: string | undefined;
    username: string | undefined;
    password: string | undefined;
    database: string | undefined;
    port: string | undefined;
    synchronize: boolean;
    logging: boolean;
    entities: string[];
    migrations: string[];
    migrationsTableName: string;
    autoLoadEntities: boolean;
    cli: {
        migrationsDir: string;
    };
};
declare const _default: DataSource;
export default _default;
