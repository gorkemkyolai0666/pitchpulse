import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';

@Injectable()
export class ClientsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(studioId: string) {
    return this.prisma.client.findMany({
      where: { studioId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string, studioId: string) {
    const client = await this.prisma.client.findFirst({
      where: { id, studioId },
      include: {
        sessions: { orderBy: { date: 'desc' }, take: 5 },
        deliveries: { orderBy: { dueDate: 'desc' }, take: 5 },
      },
    });
    if (!client) throw new NotFoundException('Müşteri bulunamadı');
    return client;
  }

  async create(dto: CreateClientDto, studioId: string) {
    return this.prisma.client.create({
      data: {
        artistName: dto.artistName,
        contactName: dto.contactName || '',
        phone: dto.phone,
        email: dto.email || '',
        genre: dto.genre || '',
        city: dto.city || '',
        notes: dto.notes || '',
        studioId,
      },
    });
  }

  async update(id: string, dto: UpdateClientDto, studioId: string) {
    const client = await this.prisma.client.findFirst({ where: { id, studioId } });
    if (!client) throw new NotFoundException('Müşteri bulunamadı');
    return this.prisma.client.update({ where: { id }, data: dto });
  }

  async remove(id: string, studioId: string) {
    const client = await this.prisma.client.findFirst({ where: { id, studioId } });
    if (!client) throw new NotFoundException('Müşteri bulunamadı');

    await this.prisma.delivery.deleteMany({ where: { clientId: id } });
    await this.prisma.session.deleteMany({ where: { clientId: id } });

    return this.prisma.client.delete({ where: { id } });
  }
}
