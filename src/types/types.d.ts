import { ToolDefinitionJson } from '@openrouter/sdk/esm/models';

export type configObject = { [key: string]: string };

export type workflowGraph = {
  nodes: {
    id: string;
    type: string;
    prompt: string;
    tools: ToolDefinitionJson[];
  }[];
  edges: {
    source: string;
    target: string;
  }[];
};
