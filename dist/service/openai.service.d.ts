export declare class OpenaiService {
    private openRouter;
    private tools;
    getWeather(city: string): Promise<string>;
    getTime(timezone: string): Promise<string>;
    sendMessage(model: string, message: string): Promise<any>;
}
