import { Injectable } from '@nestjs/common';
import { OpenaiService } from './service/openai.service';

@Injectable()
export class AppService {

  constructor(private readonly openaiService: OpenaiService) {}

  async getHello(): Promise<string> {
    return await this.openaiService.sendMessage('openai/gpt-4o-mini', "What's the weather in Tokyo and based on that, what clothes should I pack? Also what time is it there right now?");
  }
}
