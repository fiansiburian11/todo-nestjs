import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty({ message: 'name wajib diisi' })
  @MaxLength(100)
  name: string;

  @IsOptional()
  @IsEmail({}, { message: 'email tidak valid' })
  @IsString()
  email?: string;
}
