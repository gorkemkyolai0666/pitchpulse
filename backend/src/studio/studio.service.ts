import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateStudioDto } from './dto/update-studio.dto';

@Injectable()
export class StudioService {
  constructor(private readonly prisma: PrismaService) {}

  async getProfile(studioId: string) {
    const studio = await this.prisma.studio.findUnique({ where: { id: studioId } });
    if (!studio) {
      throw new NotFoundException('Stüdyo bulunamadı');
    }
    return studio;
  }

  async updateProfile(studioId: string, dto: UpdateStudioDto) {
    const studio = await this.prisma.studio.findUnique({ where: { id: studioId } });
    if (!studio) {
      throw new NotFoundException('Stüdyo bulunamadı');
    }

    return this.prisma.studio.update({
      where: { id: studioId },
      data: dto,
    });
  }
}
