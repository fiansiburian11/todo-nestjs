import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateUserDto) {
    try {
      return await this.prisma.user.create({ data: dto });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        throw new BadRequestException('Email sudah digunakan');
      }
      throw error;
    }
  }

  findAll() {
    return this.prisma.user.findMany({
      select: { id: true, name: true, createdAt: true, updatedAt: true },
    });
  }

  async findOne(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      //car pilih data apa saja yang akan dikembalikan
      select: { id: true, name: true, createdAt: true, updatedAt: true },
    });
    if (!user)
      throw new NotFoundException(`User dengan id ${id} tidak ditemukan`);
    return user;
  }

  async update(id: string, dto: UpdateUserDto) {
    try {
      return await this.prisma.user.update({
        where: { id },
        data: dto,
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw new NotFoundException(`User dengan id ${id} tidak ditemukan`);
        }
        if (error.code === 'P2002') {
          throw new BadRequestException('Email sudah digunakan');
        }
      }
      throw error;
    }
  }

  async remove(id: string) {
    try {
      await this.prisma.user.delete({ where: { id } });
      return { message: 'Berhasil menghapus user' };
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2025'
      ) {
        throw new NotFoundException(`User dengan id ${id} tidak ditemukan`);
      }
      throw error;
    }
  }
}
