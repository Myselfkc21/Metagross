export type configObject = { [key: string]: string };

export type workflowGraph = {
  nodes: {
    id: string;
    type: string;
    prompt: string;
  }[];
  edges: {
    source: string;
    target: string;
  }[];
};
