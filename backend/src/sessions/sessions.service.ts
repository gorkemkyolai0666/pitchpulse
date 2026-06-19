import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateSessionDto } from './dto/create-session.dto';
import { UpdateSessionDto } from './dto/update-session.dto';

@Injectable()
export class SessionsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(studioId: string) {
    return this.prisma.session.findMany({
      where: { studioId },
      include: { client: true, studioRoom: true },
      orderBy: { date: 'asc' },
    });
  }

  async create(dto: CreateSessionDto, studioId: string) {
    return this.prisma.session.create({
      data: {
        date: new Date(dto.date),
        duration: dto.duration || 120,
        type: (dto.type as any) || 'recording',
        notes: dto.notes || '',
        engineerName: dto.engineerName || '',
        clientId: dto.clientId,
        studioRoomId: dto.studioRoomId || null,
        studioId,
      },
      include: { client: true, studioRoom: true },
    });
  }

  async update(id: string, dto: UpdateSessionDto, studioId: string) {
    const session = await this.prisma.session.findFirst({ where: { id, studioId } });
    if (!session) throw new NotFoundException('Seans bulunamadı');

    const data: Record<string, unknown> = { ...dto };
    if (dto.date) data.date = new Date(dto.date);
    if (dto.status) data.status = dto.status as any;
    if (dto.type) data.type = dto.type as any;

    return this.prisma.session.update({
      where: { id },
      data,
      include: { client: true, studioRoom: true },
    });
  }

  async remove(id: string, studioId: string) {
    const session = await this.prisma.session.findFirst({ where: { id, studioId } });
    if (!session) throw new NotFoundException('Seans bulunamadı');
    return this.prisma.session.delete({ where: { id } });
  }
}
