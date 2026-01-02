import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { TodoStatus } from '@prisma/client';
import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
} from 'class-validator';

export class CreateTodoDto {
  @ApiProperty({
    example: 'ini title',
    description: 'isi title todo',
  })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiPropertyOptional({
    example: 'isi deskripsi todo',
  })
  @IsString()
  @IsOptional()
  @MaxLength(1000)
  description?: string;

  @ApiPropertyOptional({
    example: 'TODO',
    description: 'wajib TODO | IN_PROGRESS | COMPLETED',
  })
  @IsEnum(TodoStatus)
  @IsOptional()
  status?: TodoStatus;

  @IsUUID()
  @IsNotEmpty()
  userId: string;
}
