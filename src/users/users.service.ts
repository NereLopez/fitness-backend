import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class UsersService {
  constructor(
        // @ts-ignore
    @InjectRepository(User) //Le decimos a NestJS: "Tráeme la herramienta para manejar la tabla User"
    private readonly userRepository: Repository<User>,// La guardamos en una variable interna llamada userRepository
  ) {}

  async create(createUserDto: CreateUserDto) : Promise<User> {
// Paso 1: Extraemos el email que nos llega desde la pantalla de Angular  
const email = createUserDto.email;
//2. Rompemos el mail por el @ y nos quedamos por la parte de l izquierda, que es el nombre de usuario
const extractedName = email.split('@')[0];
// 3. Preparamos el objeto con los datos que exige nuestra entidad/base de datos
const hashedPassword = await bcrypt.hash(createUserDto.password, 10); // Hasheamos la contraseña con bcrypt
const newUser = this.userRepository.create({ 
  email: createUserDto.email,
  password: hashedPassword,
  name: extractedName,
});
//4. Le decimos a TypeORM que ejecute el "INSERT INTO" en Postgres y esperamos a que se complete la operación
return await this.userRepository.save(newUser);
  }

  async findByEmail(email: string): Promise<User | null> {
    const user = await this.userRepository.findOne({ where: { email } });
    return user ?? null;
  }

  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;

    // 1. Buscamos si el usuario existe en Postgres
    const user = await this.findByEmail(email);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // 2. Comparamos la contraseña limpia con el hash de la BD
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // 3. Devolvemos la respuesta limpia
    return {
      message: 'Login successful',
      user: {
        id: user.id,
        email: user.email,
        name: user.name
      }
    };
  }

  async findAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  async findOne(id: number): Promise<User | null> {
  const user =await this.userRepository.findOne({ where: { id } });
  return user ?? null;
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<User | null> {
    await this.userRepository.update(id, updateUserDto);
    return await this.findOne(id);
  }

  async remove(id: number): Promise<{ message: string }> {
    await this.userRepository.delete(id);
    return { message: `User with id ${id} has been removed` };
  }
}
