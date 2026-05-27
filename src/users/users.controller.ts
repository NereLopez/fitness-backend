import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  @Post() // Escucha peticiones de tipo POST
  create(@Body() createUserDto: CreateUserDto) {
    // FRecibe el mail y password, y se lo pasa al servicio
    return this.usersService.create(createUserDto);
  }

}

