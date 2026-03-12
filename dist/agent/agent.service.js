"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AgentService = void 0;
const common_1 = require("@nestjs/common");
const sdk_1 = require("@openrouter/sdk");
let AgentService = class AgentService {
    openRouter = new sdk_1.OpenRouter({
        apiKey: process.env.OPENROUTER_API_KEY || '',
    });
    tools = [
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
    async getWeather(city) {
        return JSON.stringify({
            city,
            temperature: 23,
            unit: 'C',
        });
    }
    async getTime(timezone) {
        return JSON.stringify({
            timezone,
            time: new Date().toLocaleTimeString('en-US', { timeZone: timezone }),
        });
    }
    async sendMessage(node, input) {
        const { prompt, type } = node;
        const messages = [
            { role: 'system', content: prompt },
            { role: 'user', content: input },
        ];
        let k = 1;
        while (true) {
            console.log('loop is running for ', k++);
            const completion = await this.openRouter.chat.send({
                chatGenerationParams: {
                    model: 'gpt-4o',
                    messages,
                    tools: this.tools,
                    maxTokens: 300,
                    stream: false,
                },
            });
            const msg = completion.choices[0].message;
            console.log('msg', msg);
            if (msg.toolCalls) {
                messages.push(msg);
                for (let i = 0; i < msg.toolCalls.length; i++) {
                    let toolCall = msg.toolCalls[i];
                    const args = JSON.parse(toolCall.function.arguments);
                    let toolResult = '';
                    if (toolCall.function.name === 'get_weather') {
                        toolResult = (await this.getWeather(args.city)).toString();
                    }
                    else if (toolCall.function.name === 'get_time') {
                        toolResult = (await this.getTime(args.timezone)).toString();
                    }
                    else {
                        return 'Invalid tool call';
                    }
                    messages.push({
                        role: 'tool',
                        toolCallId: toolCall.id,
                        content: toolResult,
                    });
                }
            }
            else {
                return msg.content;
            }
        }
    }
};
exports.AgentService = AgentService;
exports.AgentService = AgentService = __decorate([
    (0, common_1.Injectable)()
], AgentService);
//# sourceMappingURL=agent.service.js.map