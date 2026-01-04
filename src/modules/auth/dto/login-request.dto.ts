import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class RequestLoginDto {
  @ApiProperty({
    example: 'example@mail.com',
    description: 'email user',
  })
  @IsEmail({}, { message: 'email tidak valid' })
  @IsString()
  @IsNotEmpty({ message: 'email wajib diisi' })
  email: string;

  @IsString()
  @IsNotEmpty({ message: 'password wajib diisi' })
  password: string;
}
