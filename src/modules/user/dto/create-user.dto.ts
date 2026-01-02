import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateUserDto {
  //decorator swagger
  @ApiProperty({
    example: 'example',
    description: 'Nama user',
  })
  @IsString()
  @IsNotEmpty({ message: 'name wajib diisi' })
  name: string;

  @ApiPropertyOptional({
    example: 'example@mail.com',
    description: 'email user (opsional)',
  })
  @IsOptional()
  @IsEmail({}, { message: 'email tidak valid' })
  @IsString()
  email?: string;
}
