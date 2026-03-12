import { OpenRouter } from "@openrouter/sdk";
import { ToolDefinitionJson } from "@openrouter/sdk/esm/models";

export class OpenaiService {

  private openRouter = new OpenRouter({
    apiKey:'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',
  });

  private tools: ToolDefinitionJson[] = [
    {
      type: "function",
      function: {
        name: "get_weather",
        description: "Get today's weather for a city",
        parameters: {
          type: "object",
          properties: {
            city: {
              type: "string",
              description: "City name like New York or Tokyo",
            },
          },
          required: ["city"],
        },
      },
    },
    {
        type: "function",
        function:{
            name:"get_time",
            description: "Get the current time in the given timezone",
            parameters: {
                type: "object",
                properties: {
                    timezone: {
                        type: "string",
                        description: "Timezone like Asia/Tokyo or America/New_York"
                    }
                },
            required: ["timezone"]
        },
    },
}

  ];

  async getWeather(city: string) {
    return JSON.stringify({
        city,
        temperature: 23,
        unit: "C"
      });
  }

  async getTime(timezone: string) {
    return JSON.stringify({
        timezone,
        time: new Date().toLocaleTimeString('en-US', { timeZone: timezone })
      });
  }

  async sendMessage(model: string, message: string) {

    const messages: any[] = [
      { role: "user", content: message },
    ];


let k=1;
while (true) {
    console.log('loop is running for ',k++)
    const completion = await this.openRouter.chat.send({
      chatGenerationParams: {
        model,
        messages,
        tools: this.tools,
        maxTokens: 300,
        stream: false   
      }
    });

    const msg = completion.choices[0].message;

    console.log("msg", msg);
    // TOOL CALL
    if (msg.toolCalls) {
        messages.push(msg);
        for (let i = 0; i < msg.toolCalls.length; i++) {
      let toolCall = msg.toolCalls[i];
      const args = JSON.parse(toolCall.function.arguments);

      let toolResult = "";

      if (toolCall.function.name === "get_weather") {
        toolResult = (await this.getWeather(args.city)).toString();
      }
      else if (toolCall.function.name === "get_time") {
        toolResult = (await this.getTime(args.timezone)).toString();
      }else{
        return "Invalid tool call";
      }
      messages.push({
        role: "tool",
        toolCallId:toolCall.id,
        content: toolResult
      });
    }
  
    }
    else{
        return msg.content;
      }
    }
  }
}