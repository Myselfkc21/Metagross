import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Execution } from './execution.entity';

@Entity('agent_execution')
export class AgentExecution {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  execution_id: number;

  @Column()
  agent_id: string;

  @Column({ nullable: true })
  output: string;

  @Column({ nullable: true })
  status: string;

  @Column({ type: 'timestamp' })
  start_time: Date;

  @Column({ type: 'timestamp' })
  end_time: Date;

  @CreateDateColumn({
    type: 'timestamp',
    precision: 6,
    default: () => 'CURRENT_TIMESTAMP(6)',
  })
  public created_at: Date;

  @UpdateDateColumn({
    type: 'timestamp',
    precision: 6,
    default: () => 'CURRENT_TIMESTAMP(6)',
    onUpdate: 'CURRENT_TIMESTAMP(6)',
  })
  public updated_at: Date;

  @ManyToOne(() => Execution, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'execution_id' })
  execution: Execution;
}
