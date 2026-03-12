import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('workflow')
export class Workflow {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column('json')
  graph: any;

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
}
