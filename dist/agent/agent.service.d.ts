import { workflowGraph } from 'src/types/types';
export declare class AgentService {
    private openRouter;
    private tools;
    getWeather(city: string): Promise<string>;
    getTime(timezone: string): Promise<string>;
    sendMessage(node: workflowGraph['nodes'][0], input: string): Promise<any>;
}
