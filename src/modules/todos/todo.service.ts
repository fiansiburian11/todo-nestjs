import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { CreateTodoDto } from './dto/create-todo.dto';
import { QueryTodoDto } from './dto/query-todo.dto';
import { UpdateAuthDto } from '../auth/dto/update-auth.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';

@Injectable()
export class TodoService {
  constructor(private readonly prisma: PrismaService) {}

  async create(userId: string, createTodoDto: CreateTodoDto) {
    try {
      return await this.prisma.todo.create({
        data: {
          title: createTodoDto.title,
          status: createTodoDto.status,
          description: createTodoDto.description,
          userId: userId,
        },
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        // FK constraint failed (misal userId tidak ada)
        if (error.code === 'P2003') {
          throw new NotFoundException(
            `User dengan id ${userId} tidak ditemukan`,
          );
        }
        // unique constraint
        if (error.code === 'P2002') {
          throw new ConflictException(`Title sudah digunakan`);
        }
      }
      throw error;
    }
  }

  async getTodo(userId: string, query: QueryTodoDto) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 10;

    const skip = (page - 1) * limit;

    const where = {
      userId,
      ...(query.status ? { status: query.status } : {}),
    };

    const orderBy = {
      createdAt: query.sort === 'asc' ? ('asc' as const) : ('desc' as const),
    };

    const [data, totalData] = await Promise.all([
      this.prisma.todo.findMany({
        where,
        orderBy,
        skip,
        take: limit,
      }),
      this.prisma.todo.count({ where }),
    ]);

    const totalPage = Math.ceil(totalData / limit); // bisa jadi 0 kalau totalData=0

    return {
      meta: {
        page,
        limit,
        totalData,
        totalPage,
        sort: query.sort ?? 'desc',
        status: query.status ?? null,
      },
      data,
    };
  }

  async updateTodo(
    userId: string,
    todoId: string,
    dto: UpdateTodoDto,
  ) {
    try {
      // 1. Pastikan ada field yang diupdate
      const hasUpdate =
        dto.title !== undefined ||
        dto.status !== undefined ||
        dto.description !== undefined;

      if (!hasUpdate) {
        throw new BadRequestException('Tidak ada data yang diupdate');
      }

      // 2. Update + ownership check
      const updated = await this.prisma.todo.updateMany({
        where: {
          id: todoId,
          userId,
        },
        data: {
          ...(dto.title !== undefined ? { title: dto.title } : {}),
          ...(dto.status !== undefined ? { status: dto.status } : {}),
          ...(dto.description !== undefined
            ? { description: dto.description }
            : {}),
        },
      });

      // 3. Tidak ditemukan atau bukan miliknya
      if (updated.count === 0) {
        throw new NotFoundException(
          'Todo tidak ditemukan atau bukan milik anda',
        );
      }

      // 4. Ambil data terbaru (opsional tapi rapi)
      return this.prisma.todo.findUnique({
        where: { id: todoId },
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        // unique constraint (misal title unique per user)
        if (error.code === 'P2002') {
          throw new BadRequestException('Title sudah digunakan');
        }
      }

      if (error instanceof BadRequestException) throw error;
      if (error instanceof NotFoundException) throw error;

      throw new InternalServerErrorException('Gagal mengupdate todo');
    }
  }

  async deleteTodo() {
    return;
  }
}
