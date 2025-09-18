import { Injectable } from '@nestjs/common';
import type { CreateRequestDto } from './dto/create-request.dto';
import type { UpdateRequestDto } from './dto/update-request.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class RequestsRepository {
  constructor(private prisma: PrismaService) {}
  create(createRequestDto: CreateRequestDto) {
    return this.prisma.request.create({
      data: createRequestDto,
    });
  }

  findAll() {
    return this.prisma.request.findMany();
  }

  findOne(id: string) {
    return this.prisma.request.findUnique({
      where: { id },
    });
  }

  update(id: string, updateRequestDto: UpdateRequestDto) {
    return this.prisma.request.update({
      where: { id },
      data: updateRequestDto,
    });
  }

  remove(id: string) {
    return this.prisma.request.delete({
      where: { id },
    });
  }
}
