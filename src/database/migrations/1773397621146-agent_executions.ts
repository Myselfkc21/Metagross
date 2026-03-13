import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AgentExecutions1773397621146 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('agent_execution', 'output');
    await queryRunner.addColumn(
      'agent_execution',
      new TableColumn({
        name: 'output',
        type: 'text',
        isNullable: true,
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
