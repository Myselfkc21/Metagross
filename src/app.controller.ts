import { Controller, Get, Sse } from '@nestjs/common';
import { AppService } from './app.service';
import { Observable } from 'rxjs';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  async getHello(): Promise<string> {
    return await this.appService.getHello();
  }
  @Sse('sse')
  sse() {
    return new Observable((observer) => {
      let count = 0;
      const interval = setInterval(() => {
        observer.next({ data: `event ${++count}` });
      }, 1000);

      return () => clearInterval(interval);
    });
  }
}
