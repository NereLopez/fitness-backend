import { IsInt, IsNotEmpty, IsPositive, IsString, IsIn, IsOptional, IsDateString } from 'class-validator';

export class CreateNutritionDto {
    @IsString()
    @IsNotEmpty({ message: 'El name is required' })
    name!: string;

    @IsInt()
    @IsPositive({ message: 'El calories must be a positive number' })
    calories!: number;

    @IsString()
    @IsIn(['breakfast', 'lunch', 'dinner', 'snack'], { message: 'El meal_type must be one of: breakfast, lunch, dinner, snack' })
    meal_type!: 'breakfast' | 'lunch' | 'dinner' | 'snack';

    @IsInt()
    protein!: number;

    @IsInt()
    carbs!: number;

    @IsInt()
    fats!: number;

    @IsDateString({ message: 'El log_date must be a valid date string (YYYY-MM-DD)' })
    @IsOptional()
    log_date?: Date;

    @IsInt()
    @IsNotEmpty({ message: 'El user_id is required to associate the nutrition entry with a user' })
    user_id!: number;
}
