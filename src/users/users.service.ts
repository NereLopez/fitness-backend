import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) //Le decimos a NestJS: "Tráeme la herramienta para manejar la tabla User"
    private readonly userRepository: Repository<User>,// La guardamos en una variable interna llamada userRepository
  ) {}

  async create(createUserDto: CreateUserDto) : Promise<User> {
// Paso 1: Extraemos el email que nos llega desde la pantalla de Angular  
const email = createUserDto.email;
//2. Rompemos el mail por el @ y nos quedamos por la parte de l izquierda, que es el nombre de usuario
const extractedName = email.split('@')[0];
// 3. Preparamos el objeto con los datos que exige nuestra entidad/base de datos
const newUser = this.userRepository.create({ 
  email: createUserDto.email,
  password: createUserDto.password,
  name: extractedName,
});
//4. Le decimos a TypeORM que ejecute el "INSERT INTO" en Postgres y esperamos a que se complete la operación
return await this.userRepository.save(newUser);
  }

  findAll() {
    return `This action returns all users`;
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
