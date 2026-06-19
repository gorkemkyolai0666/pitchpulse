import { Module } from '@nestjs/common';
import { StudioRoomsController } from './studio-rooms.controller';
import { StudioRoomsService } from './studio-rooms.service';

@Module({
  controllers: [StudioRoomsController],
  providers: [StudioRoomsService],
})
export class StudioRoomsModule {}
