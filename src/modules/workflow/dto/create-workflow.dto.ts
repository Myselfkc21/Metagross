import { IsObject, IsString } from 'class-validator';
import { workflowGraph } from 'src/types/types';

export class CreateWorkflowDto {
  @IsString()
  name: string;

  @IsObject()
  graph: workflowGraph;
}
