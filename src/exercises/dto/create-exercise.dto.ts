import { IsNotEmpty, IsString, Length } from 'class-validator';

export class CreateExerciseDto {
    @IsString()
    @IsNotEmpty({ message: 'Exercise name is required' })
    @Length(1, 100, { message: 'Exercise name must be between 3 and 50 characters' })
    name!: string;

    @IsString()
    @IsNotEmpty({ message: 'Muscle group is required' })
    @Length(1, 50, { message: 'Muscle group must be between 3 and 50 characters' })
    muscle_group!: string;
}
