import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateStudioRoomDto, UpdateStudioRoomDto } from './dto/studio-room.dto';

@Injectable()
export class StudioRoomsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(studioId: string) {
    return this.prisma.studioRoom.findMany({
      where: { studioId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async create(dto: CreateStudioRoomDto, studioId: string) {
    return this.prisma.studioRoom.create({
      data: {
        name: dto.name,
        roomType: (dto.roomType as any) || 'live',
        hourlyRate: dto.hourlyRate ?? 1500,
        capacity: dto.capacity ?? 4,
        description: dto.description || '',
        studioId,
      },
    });
  }

  async update(id: string, dto: UpdateStudioRoomDto, studioId: string) {
    const room = await this.prisma.studioRoom.findFirst({ where: { id, studioId } });
    if (!room) throw new NotFoundException('Stüdyo odası bulunamadı');

    const data: Record<string, unknown> = { ...dto };
    if (dto.roomType) data.roomType = dto.roomType as any;

    return this.prisma.studioRoom.update({ where: { id }, data });
  }
}
