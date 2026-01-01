import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';

@Injectable()
export class TodoService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createTodoDto: CreateTodoDto) {
    if (!createTodoDto.userId) {
      throw new BadRequestException('userId is required');
    }

    const user = await this.prisma.user.findUnique({
      where: { id: createTodoDto.userId },
    });
    if (!user) throw new BadRequestException('userId tidak ditemukan');

    return this.prisma.todo.create({
      data: {
        title: createTodoDto.title,
        description: createTodoDto.description,
        status: createTodoDto.status,
        userId: createTodoDto.userId,
      },
    });
  }

  findAll() {
    return `This action returns all todo`;
  }

  findOne(id: number) {
    return `This action returns a #${id} todo`;
  }

  update(id: number, updateTodoDto: UpdateTodoDto) {
    return `This action updates a #${id} todo`;
  }

  remove(id: number) {
    return `This action removes a #${id} todo`;
  }
}
