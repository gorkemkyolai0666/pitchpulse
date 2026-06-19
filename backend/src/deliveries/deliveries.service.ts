import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateDeliveryDto } from './dto/create-delivery.dto';
import { UpdateDeliveryDto } from './dto/update-delivery.dto';

@Injectable()
export class DeliveriesService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(studioId: string) {
    return this.prisma.delivery.findMany({
      where: { studioId },
      include: { client: true, session: true },
      orderBy: { dueDate: 'desc' },
    });
  }

  async create(dto: CreateDeliveryDto, studioId: string) {
    return this.prisma.delivery.create({
      data: {
        clientId: dto.clientId,
        sessionId: dto.sessionId || null,
        title: dto.title || '',
        type: (dto.type as any) || 'mix',
        totalPrice: dto.totalPrice || 0,
        paidAmount: dto.paidAmount || 0,
        dueDate: new Date(dto.dueDate),
        notes: dto.notes || '',
        studioId,
      },
      include: { client: true, session: true },
    });
  }

  async update(id: string, dto: UpdateDeliveryDto, studioId: string) {
    const delivery = await this.prisma.delivery.findFirst({ where: { id, studioId } });
    if (!delivery) throw new NotFoundException('Teslimat bulunamadı');

    const data: Record<string, unknown> = { ...dto };
    if (dto.type) data.type = dto.type as any;
    if (dto.status) data.status = dto.status as any;
    if (dto.dueDate) data.dueDate = new Date(dto.dueDate);
    if (dto.deliveredDate) data.deliveredDate = new Date(dto.deliveredDate);

    return this.prisma.delivery.update({
      where: { id },
      data,
      include: { client: true, session: true },
    });
  }
}
