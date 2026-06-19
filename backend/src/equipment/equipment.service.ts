import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { EquipmentDto, UpdateEquipmentDto } from './dto/equipment.dto';

@Injectable()
export class EquipmentService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(studioId: string) {
    return this.prisma.equipment.findMany({
      where: { studioId },
      include: { studioRoom: true },
      orderBy: { name: 'asc' },
    });
  }

  async create(dto: EquipmentDto, studioId: string) {
    return this.prisma.equipment.create({
      data: {
        name: dto.name,
        category: (dto.category as any) || 'other',
        brand: dto.brand || '',
        model: dto.model || '',
        serialNumber: dto.serialNumber || '',
        condition: (dto.condition as any) || 'good',
        studioRoomId: dto.studioRoomId || null,
        notes: dto.notes || '',
        studioId,
      },
      include: { studioRoom: true },
    });
  }

  async update(id: string, dto: UpdateEquipmentDto, studioId: string) {
    const item = await this.prisma.equipment.findFirst({ where: { id, studioId } });
    if (!item) throw new NotFoundException('Ekipman bulunamadı');

    const data: Record<string, unknown> = { ...dto };
    if (dto.category) data.category = dto.category as any;
    if (dto.condition) data.condition = dto.condition as any;

    return this.prisma.equipment.update({
      where: { id },
      data,
      include: { studioRoom: true },
    });
  }

  async remove(id: string, studioId: string) {
    const item = await this.prisma.equipment.findFirst({ where: { id, studioId } });
    if (!item) throw new NotFoundException('Ekipman bulunamadı');
    return this.prisma.equipment.delete({ where: { id } });
  }
}
