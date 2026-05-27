import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class LoginDto {
  @IsEmail({}, { message: 'El email must be a valid email address' })
  @IsNotEmpty({ message: 'El email is required' })
  email!: string;

  @IsString()
  @IsNotEmpty({ message: 'El password is required' })
  @MinLength(6, { message: 'El password must be at least 6 characters long' })
  password!: string;
}