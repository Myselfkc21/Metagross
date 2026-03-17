import { Controller, Sse } from '@nestjs/common';
import { StreamService } from './stream.service';

@Controller('stream')
export class StreamController {
  constructor(private readonly streamService: StreamService) {}

  @Sse('agent-updates')
  streamAgentUpdates() {
    return this.streamService.getAgentUpdateStream();
  }
}
