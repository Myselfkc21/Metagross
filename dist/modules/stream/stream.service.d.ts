import { Response } from 'express';
export declare class StreamService {
    private clients;
    constructor();
    addClient(executionId: string, response: Response): void;
    emit(executionId: string, data: any): void;
}
