import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Connection } from 'typeorm';
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

    private readonly connection: Connection,
  ) { }

  async create(createDto: any): Promise<TrainingSession> {
    //1. Separamos el user_id del resto de datos de la sesión, porque el user_id no forma parte de la tabla training_sessions, sino que es una referencia a la tabla users
    const { user_id, ...sessionData } = createDto;

    //2. Buscamos al usuario en SU tabla usando SOLO su id
    const user = await this.userRepository.findOne({ where: { id: user_id } });
    if (!user) {
      throw new NotFoundException(`El usuario con ID ${user_id} no existe`);
    }
// 4. Le pedimos al gerente que nos cree el "Query Runner" (el encargado de la transacción)
    const queryRunner = this.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

try {
      // 4. PASO 1: Creamos y guardamos la Sesión Principal (Post-it Azul)
      const session = queryRunner.manager.create(TrainingSession, {
        ...sessionData,
        user,
      });
      const savedSession = await queryRunner.manager.save(session);

      // 5. PASO 2: Si vienen ejercicios en el JSON, los recorremos uno a uno
      if (createDto.exercises && createDto.exercises.length > 0) {
        for (const exData of createDto.exercises) {
          
          // Creamos el Ejercicio de la Sesión asignándole el ID de la sesión que acabamos de guardar
          const sessionExercise = queryRunner.manager.create('session_exercise', {
            session_id: savedSession.id, // 👈 Vinculación con la sesión principal
            exercise_id: exData.exercise_id,
            exercise_type: exData.exercise_type,
            notes: exData.notes,
          });
          
          // Guardamos el ejercicio en el borrador
          const savedExercise = await queryRunner.manager.save(sessionExercise);

          // 6. PASO 3: Si este ejercicio tiene series, las recorremos una a una
          if (exData.sets && exData.sets.length > 0) {
            for (const setData of exData.sets) {
              
              // Creamos la serie asignándole el ID del ejercicio que acabamos de guardar
              const exerciseSet = queryRunner.manager.create('exercise_set', {
                session_exercise_id: (savedExercise as any).id, // 👈 Vinculación con su ejercicio
                set_number: setData.set_number,
                weight: setData.weight,
                reps: setData.reps,
                duration_seconds: setData.duration_seconds,
                completed: setData.completed || false,
              });
              
              // Guardamos la serie en el borrador
              await queryRunner.manager.save(exerciseSet);
            }
          }
        }
      }

      // Si todo el bucle ha ido sobre ruedas, confirmamos y grabamos de verdad en Postgres
      await queryRunner.commitTransaction();
      return savedSession;

    } catch (error) {
      // Si cualquier línea falla, borramos el borrador y Postgres no sufre cambios
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      // Pase lo que pase, cerramos el encargado para no consumir memoria
      await queryRunner.release();
    }
  }
}