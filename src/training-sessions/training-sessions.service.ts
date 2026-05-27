import { Injectable, NotFoundException} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TrainingSession } from './entities/training-session.entity';
import { CreateTrainingSessionDto } from './dto/create-training-session.dto';
import { UpdateTrainingSessionDto } from './dto/update-training-session.dto';
import { User } from '../users/entities/user.entity';

@Injectable()
export class TrainingSessionsService {
 constructor(
  @InjectRepository(TrainingSession)
    private readonly trainingSessionRepository: Repository<TrainingSession>,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(createTrainingSessionDto: CreateTrainingSessionDto): Promise<TrainingSession> {
    const { user_id, ...sessionData } = createTrainingSessionDto;

    // 1. Validamos si el usuario existe de verdad en Postgres
    const user = await this.userRepository.findOne({ where: { id: user_id } });
    if (!user) {
      throw new NotFoundException(`El usuario con ID ${user_id} no existe`);
    }

    // 2. Creamos la sesión y le asignamos el usuario
    const newSession = this.trainingSessionRepository.create({
      ...sessionData,
      user,
    });

    // 3. Guardamos en la tabla training_sessions
    return await this.trainingSessionRepository.save(newSession);
  }

  async findAll(): Promise<TrainingSession[]> {
    return await this.trainingSessionRepository.find({
      relations: ['user'], // Te hace el JOIN automático para ver de quién es cada entreno
    });
  }

  async findOne(id: number): Promise<TrainingSession> {
    const session = await this.trainingSessionRepository.findOne({
      where: { id },
      relations: ['user'],
    });
    if (!session) {
      throw new NotFoundException(`La sesión de entrenamiento con ID ${id} no existe`);
    }
    return session;
  }

  async update(id: number, updateTrainingSessionDto: UpdateTrainingSessionDto) {
    const session = await this.findOne(id);
    const updatedSession = this.trainingSessionRepository.merge(session, updateTrainingSessionDto);
    return await this.trainingSessionRepository.save(updatedSession);
  }

  async remove(id: number): Promise<{ message: string }> {
    const session = await this.findOne(id);
    await this.trainingSessionRepository.remove(session);
    return { message: `Sesión con ID ${id} eliminada correctamente` };
  }
}
 