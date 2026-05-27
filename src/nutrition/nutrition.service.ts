import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Nutrition } from './entities/nutrition.entity';
import { CreateNutritionDto } from './dto/create-nutrition.dto';
import { UpdateNutritionDto } from './dto/update-nutrition.dto';
import { User } from '../users/entities/user.entity';

@Injectable()
export class NutritionService {
  constructor(
    @InjectRepository(Nutrition)
    private readonly nutritionRepository: Repository<Nutrition>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(createNutritionDto: CreateNutritionDto): Promise<Nutrition> {
    const { user_id, ...foodData } = createNutritionDto;

    // 1. Buscamos si el usuario existe de verdad
    const user = await this.userRepository.findOne({ where: { id: user_id } });
    if (!user) {
      throw new NotFoundException(`El usuario con ID ${user_id} no existe`);
    }

    // 2. Creamos la instancia de la comida asociándole el usuario
    const newFoodEntry = this.nutritionRepository.create({
      ...foodData,
      user, // Pasamos el objeto usuario completo para que TypeORM guarde la FK (user_id) automáticamente
    });

    // 3. Guardamos en la base de datos de Postgres
    return await this.nutritionRepository.save(newFoodEntry);
  }

  async findAll(): Promise<Nutrition[]> {
    return await this.nutritionRepository.find({
      relations: ['user'], // Esto te hace el JOIN automático para ver de quién es cada comida
    });
  }

  async findOne(id: number): Promise<Nutrition> {
    const food = await this.nutritionRepository.findOne({
      where: { id },
      relations: ['user'],
    });
    if (!food) {
      throw new NotFoundException(`El registro de comida con ID ${id} no existe`);
    }
    return food;
  }

  async update(id: number, updateNutritionDto: UpdateNutritionDto) {
    const food = await this.findOne(id); // Reutilizamos la lógica para comprobar si existe
    
    // Fusionamos los cambios nuevos sobre el registro viejo
    const updatedFood = this.nutritionRepository.merge(food, updateNutritionDto);
    return await this.nutritionRepository.save(updatedFood);
  }

  async remove(id: number): Promise<{ message: string }> {
    const food = await this.findOne(id);
    await this.nutritionRepository.remove(food);
    return { message: `Registro de comida con ID ${id} eliminado correctamente` };
  }
}