import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Exercise } from './entities/exercise.entity';
import { CreateExerciseDto } from './dto/create-exercise.dto';
import { UpdateExerciseDto } from './dto/update-exercise.dto';

@Injectable()
export class ExercisesService {
  constructor(
    @InjectRepository(Exercise)
    private readonly exerciseRepository: Repository<Exercise>,
  ) { }

  async create(createExerciseDto: CreateExerciseDto): Promise<Exercise> {
    const newExercise = this.exerciseRepository.create(createExerciseDto);
    return await this.exerciseRepository.save(newExercise);
  }

  async findAll(): Promise<Exercise[]> {
    return await this.exerciseRepository.find();
  }

  async findOne(id: number): Promise<Exercise> {
    const exercise = await this.exerciseRepository.findOne({ where: { id } });
    if (!exercise) {
      throw new NotFoundException(`Exercise with ID ${id} not found`);
    }
    return exercise;
  }

  async update(id: number, updateExerciseDto: UpdateExerciseDto) {
    const exercise = await this.findOne(id);
    const updated = this.exerciseRepository
    return await this.exerciseRepository.save(exercise);
  }

  async remove(id: number){
    const exercise = await this.findOne(id);
    await this.exerciseRepository.remove(exercise);
    return { message: `Exercise with ID ${id} has been removed` };
  }
}
