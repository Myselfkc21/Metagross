import { Inject, Injectable } from '@nestjs/common';
import { interval, map } from 'rxjs';
import { Response } from 'express';
import { REDIS_CLIENT, REDIS_SUBSCRIBER } from 'src/redis/redis.constants';
import Redis from 'ioredis';
import { Queue } from 'bullmq';
import { InjectQueue } from '@nestjs/bullmq';
import { Console } from 'console';
@Injectable()
export class StreamService {
  private clients: Map<string, Response[]> = new Map();
  constructor() {
    console.log('StreamService instance created');
  }
  addClient(executionId: string, response: Response) {
    response.setHeader('Content-Type', 'text/event-stream');
    response.setHeader('Cache-Control', 'no-cache');
    response.setHeader('Connection', 'keep-alive');
    response.write(`data: ${JSON.stringify({ status: 'connected' })}\n\n`);
    // add response to in-memory map
    const existing = this.clients.get(executionId) || [];
    this.clients.set(executionId, [...existing, response]);

    // clean up when client disconnects
    response.on('close', () => {
      const updated = (this.clients.get(executionId) || []).filter(
        (r) => r !== response,
      );
      if (updated.length === 0) {
        this.clients.delete(executionId);
      } else {
        this.clients.set(executionId, updated);
      }
    });
  }

  emit(executionId: string, data: any): void {
    console.log(`Emitting data for executionId ${executionId}:`, data);
    const clients = this.clients.get(executionId) || [];
    console.log(
      `Emitting to ${clients.length} clients for executionId ${executionId}:`,
      data,
    );
    const message = `data: ${JSON.stringify(data)}\n\n`;
    clients.forEach((res) => res.write(message));
  }
}
