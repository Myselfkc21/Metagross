import { Injectable } from '@nestjs/common';
import { OpenRouter } from '@openrouter/sdk';
import { ToolDefinitionJson } from '@openrouter/sdk/esm/models';
import { workflowGraph } from 'src/types/types';
import * as dotenv from 'dotenv';
dotenv.config();

@Injectable()
export class AgentService {
  private openRouter: OpenRouter;
  constructor() {
    this.openRouter = new OpenRouter({
      apiKey: process.env.OPENAI_API_KEY || '',
    });
  }

  private tools: ToolDefinitionJson[] = [
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

  async sendMessage(node: workflowGraph['nodes'][0], input: string) {
    const { prompt, type } = node;
    const messages: any[] = [
      { role: 'system', content: prompt },
      { role: 'user', content: input },
    ];
    let k = 1;
    while (true) {
      const completion = await this.openRouter.chat.send({
        chatGenerationParams: {
          model: 'openai/gpt-4o',
          messages,
          tools: node.tools,
          maxTokens: 300,
          stream: false,
        },
      });

      const msg = completion.choices[0].message;
      // TOOL CALL
      if (msg.toolCalls) {
        messages.push(msg);
        for (let i = 0; i < msg.toolCalls.length; i++) {
          let toolCall = msg.toolCalls[i];
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
            toolCallId: toolCall.id,
            content: toolResult,
          });
          console.log(`Tool call ${k++}:`, {
            name: toolCall.function.name,
            arguments: args,
            result: toolResult,
          });
        }
      } else {
        return msg.content;
      }
    }
  }
}
