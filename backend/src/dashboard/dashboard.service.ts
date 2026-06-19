import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class DashboardService {
  constructor(private readonly prisma: PrismaService) {}

  async getStats(studioId: string) {
    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const todayEnd = new Date(todayStart.getTime() + 86400000);
    const weekEnd = new Date(todayStart.getTime() + 7 * 86400000);

    const [
      totalClients,
      todaySessions,
      weekSessions,
      pendingDeliveries,
      readyDeliveries,
      totalDeliveries,
      needsRepairEquipment,
      recentClients,
      upcomingSessions,
    ] = await Promise.all([
      this.prisma.client.count({ where: { studioId } }),
      this.prisma.session.count({
        where: { studioId, date: { gte: todayStart, lt: todayEnd } },
      }),
      this.prisma.session.count({
        where: { studioId, date: { gte: todayStart, lt: weekEnd } },
      }),
      this.prisma.delivery.count({
        where: { studioId, status: { in: ['quoted', 'in_progress'] } },
      }),
      this.prisma.delivery.count({
        where: { studioId, status: 'review' },
      }),
      this.prisma.delivery.count({ where: { studioId } }),
      this.prisma.equipment.count({
        where: { studioId, condition: 'needs_repair' },
      }),
      this.prisma.client.findMany({
        where: { studioId },
        orderBy: { createdAt: 'desc' },
        take: 5,
      }),
      this.prisma.session.findMany({
        where: {
          studioId,
          date: { gte: todayStart },
          status: { in: ['scheduled', 'confirmed'] },
        },
        include: { client: true, studioRoom: true },
        orderBy: { date: 'asc' },
        take: 5,
      }),
    ]);

    return {
      totalClients,
      todaySessions,
      weekSessions,
      pendingDeliveries,
      readyDeliveries,
      totalDeliveries,
      needsRepairEquipment,
      recentClients,
      upcomingSessions,
    };
  }
}
