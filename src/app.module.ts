import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { User } from './users/entities/user.entity';
import { NutritionModule } from './nutrition/nutrition.module';
import { ExercisesModule } from './exercises/exercises.module';
import { TrainingSessionsModule } from './training-sessions/training-sessions.module';
import { Nutrition } from './nutrition/entities/nutrition.entity';
import { TrainingSession } from './training-sessions/entities/training-session.entity';
import { Exercise } from './exercises/entities/exercise.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'nerea',
      password: '1234',
      database: 'kinetic_app',
      entities: [User, Nutrition, Exercise, TrainingSession],
      synchronize: false,
    }),
  
    UsersModule,
  
    NutritionModule,
  
    TrainingSessionsModule,
  
    ExercisesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
