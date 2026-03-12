import { IsNumber, IsString } from 'class-validator';

export class createExecutionDto {
  @IsNumber()
  workflowId: number;

  @IsString()
  input: string;
}
