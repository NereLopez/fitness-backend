import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

class GymResponeDto {
  user = '';
  rol = '';
  message = '';
  horasRestantes = 0;
}

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) { }

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('gym')
  getGymMessage(): GymResponeDto {
    return {
      user: 'Nere',
      rol: 'Developer',
      message: 'Welcome to the gym!',
      horasRestantes: 3
    };
  }
}
