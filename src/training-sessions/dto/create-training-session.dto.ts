import { IsInt, IsNotEmpty, IsString, IsOptional, IsDateString } from 'class-validator';

export class CreateTrainingSessionDto {
  @IsDateString({ message: 'La fecha debe tener un formato válido (YYYY-MM-DD)' })
  @IsNotEmpty()
  date!: Date;

  @IsString()
  @IsNotEmpty({ message: 'El título de la sesión es obligatorio' })
  title!: string;

  @IsInt()
  @IsOptional()
  duration_minutes?: number;

  @IsInt()
  @IsOptional()
  calories_burned?: number;

  @IsInt()
  @IsNotEmpty({ message: 'El user_id es obligatorio' })
  user_id!: number;
}
