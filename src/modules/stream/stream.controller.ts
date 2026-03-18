import { Controller, Get, Param, Res, Sse } from '@nestjs/common';
import { Response } from 'express';
import { StreamService } from './stream.service';
import { interval, map, Observable } from 'rxjs';

@Controller('stream')
export class StreamController {
  constructor(private readonly streamService: StreamService) {}

  @Get(':executionId')
  stream(
    @Param('executionId') executionId: string,
    @Res() response: Response,
  ): void {
    this.streamService.addClient(executionId, response);
  }
}
