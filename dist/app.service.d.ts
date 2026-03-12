import { OpenaiService } from './service/openai.service';
export declare class AppService {
    private readonly openaiService;
    constructor(openaiService: OpenaiService);
    getHello(): Promise<string>;
}
