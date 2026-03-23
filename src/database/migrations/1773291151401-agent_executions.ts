import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm';

export class AgentExecutions1773291151401 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'agent_execution',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'execution_id',
            type: 'int',
            isNullable: true,
          },
          {
            name: 'agent_id',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'output',
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
      }),
    );
    await queryRunner.createForeignKey(
      'agent_execution',
      new TableForeignKey({
        columnNames: ['execution_id'],
        referencedTableName: 'execution',
        referencedColumnNames: ['id'],
        onDelete: 'CASCADE',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('agent_execution');
  }
}
