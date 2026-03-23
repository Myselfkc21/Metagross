import OpenAI from 'openai';

export type configObject = { [key: string]: string };

export type workflowGraph = {
  nodes: {
    id: string;
    type: string;
    prompt: string;
    tools: OpenAI.Chat.Completions.ChatCompletionTool[];
  }[];
  edges: {
    source: string;
    target: string;
  }[];
};
