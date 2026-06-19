import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { HealthModule } from './health/health.module';
import { ClientsModule } from './clients/clients.module';
import { SessionsModule } from './sessions/sessions.module';
import { DeliveriesModule } from './deliveries/deliveries.module';
import { StudioRoomsModule } from './studio-rooms/studio-rooms.module';
import { EquipmentModule } from './equipment/equipment.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { StudioModule } from './studio/studio.module';

@Module({
  imports: [
    PrismaModule,
    AuthModule,
    HealthModule,
    ClientsModule,
    SessionsModule,
    DeliveriesModule,
    StudioRoomsModule,
    EquipmentModule,
    DashboardModule,
    StudioModule,
  ],
})
export class AppModule {}
