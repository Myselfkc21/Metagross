import { IsObject, IsOptional, IsString } from 'class-validator';
import { workflowGraph } from 'src/types/types';

export class CreateWorkflowDto {
  @IsString()
  name: string;

  @IsObject()
  @IsOptional()
  graph: workflowGraph;
}
