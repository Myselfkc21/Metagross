import { Response } from 'express';
import { StreamService } from './stream.service';
export declare class StreamController {
    private readonly streamService;
    constructor(streamService: StreamService);
    stream(executionId: string, response: Response): void;
}
