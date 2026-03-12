import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Workflow } from './workflow.entity';

@Entity('execution')
export class Execution {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  workflow_id: number;

  @Column()
  input: string;

  @Column()
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

  @ManyToOne(() => Workflow, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'workflow_id' })
  workflow: Workflow;
}
