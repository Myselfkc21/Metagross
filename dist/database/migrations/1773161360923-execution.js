"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.migration1773161360923 = void 0;
const typeorm_1 = require("typeorm");
class migration1773161360923 {
    async up(queryRunner) {
        await queryRunner.createTable(new typeorm_1.Table({
            name: 'execution',
            columns: [
                {
                    name: 'id',
                    type: 'int',
                    isPrimary: true,
                    isGenerated: true,
                    generationStrategy: 'increment',
                },
                {
                    name: 'workflow_id',
                    type: 'int',
                    isNullable: true,
                },
                {
                    name: 'input',
                    type: 'varchar',
                    isNullable: true,
                },
                {
                    name: 'status',
                    type: 'varchar',
                    isNullable: true,
                },
                {
                    name: 'start_time',
                    type: 'timestamp',
                    isNullable: true,
                },
                {
                    name: 'end_time',
                    type: 'timestamp',
                    isNullable: true,
                },
                {
                    name: 'created_at',
                    type: 'timestamp',
                    default: 'CURRENT_TIMESTAMP',
                },
                {
                    name: 'updated_at',
                    type: 'timestamp',
                    default: 'CURRENT_TIMESTAMP',
                    onUpdate: 'CURRENT_TIMESTAMP',
                },
            ],
        }));
        await queryRunner.createForeignKey('execution', new typeorm_1.TableForeignKey({
            columnNames: ['workflow_id'],
            referencedTableName: 'workflow',
            referencedColumnNames: ['id'],
            onDelete: 'CASCADE',
        }));
    }
    async down(queryRunner) {
        await queryRunner.dropForeignKey('execution', 'FK_execution_workflow');
        await queryRunner.dropTable('execution');
    }
}
exports.migration1773161360923 = migration1773161360923;
//# sourceMappingURL=1773161360923-execution.js.map