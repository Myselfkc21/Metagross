import { Injectable } from '@nestjs/common';
import OpenAI from 'openai';
import { workflowGraph } from 'src/types/types';
import * as dotenv from 'dotenv';
dotenv.config();

export class OpenAIQuotaExceededError extends Error {
  constructor(message = 'OpenAI credits exhausted. Please top up your account.') {
    super(message);
    this.name = 'OpenAIQuotaExceededError';
  }
}

@Injectable()
export class AgentService {
  private openai: OpenAI;
  constructor() {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY || '',
    });
  }

  private tools: OpenAI.Chat.Completions.ChatCompletionTool[] = [
    {
      type: 'function',
      function: {
        name: 'get_weather',
        description: "Get today's weather for a city",
        parameters: {
          type: 'object',
          properties: {
            city: {
              type: 'string',
              description: 'City name like New York or Tokyo',
            },
          },
          required: ['city'],
        },
      },
    },
    {
      type: 'function',
      function: {
        name: 'get_time',
        description: 'Get the current time in the given timezone',
        parameters: {
          type: 'object',
          properties: {
            timezone: {
              type: 'string',
              description: 'Timezone like Asia/Tokyo or America/New_York',
            },
          },
          required: ['timezone'],
        },
      },
    },
  ];

  async getWeather(city: string) {
    return JSON.stringify({
      city,
      temperature: 23,
      unit: 'C',
    });
  }

  async getTime(timezone: string) {
    return JSON.stringify({
      timezone,
      time: new Date().toLocaleTimeString('en-US', { timeZone: timezone }),
    });
  }

  private isOpenAIQuotaError(error: any): boolean {
    return (
      error?.status === 429 &&
      (error?.code === 'insufficient_quota' ||
        error?.type === 'insufficient_quota' ||
        error?.error?.code === 'insufficient_quota')
    );
  }

  async sendMessage(node: workflowGraph['nodes'][0], input: string) {
    const { prompt, type } = node;
    const messages: any[] = [
      { role: 'system', content: prompt },
      { role: 'user', content: input },
    ];
    let k = 1;
    while (true) {
      let completion;
      try {
        completion = await this.openai.chat.completions.create({
          model: 'gpt-4o',
          messages,
          tools: node.tools,
          max_tokens: 300,
          stream: false,
        });
      } catch (error) {
        if (this.isOpenAIQuotaError(error)) {
          throw new OpenAIQuotaExceededError();
        }
        throw error;
      }

      const msg = completion.choices[0].message;
      // TOOL CALL
      if (msg.tool_calls && msg.tool_calls.length > 0) {
        messages.push(msg);
        for (let i = 0; i < msg.tool_calls.length; i++) {
          const toolCall = msg.tool_calls[i];
          if (toolCall.type !== 'function') {
            continue;
          }

          const args = JSON.parse(toolCall.function.arguments);

          let toolResult = '';

          if (toolCall.function.name === 'get_weather') {
            toolResult = (await this.getWeather(args.city)).toString();
          } else if (toolCall.function.name === 'get_time') {
            toolResult = (await this.getTime(args.timezone)).toString();
          } else {
            return 'Invalid tool call';
          }
          messages.push({
            role: 'tool',
            tool_call_id: toolCall.id,
            content: toolResult,
          });
          console.log(`Tool call ${k++}:`, {
            name: toolCall.function.name,
            arguments: args,
            result: toolResult,
          });
        }
      } else {
        return msg.content ?? '';
      }
    }
  }
}
