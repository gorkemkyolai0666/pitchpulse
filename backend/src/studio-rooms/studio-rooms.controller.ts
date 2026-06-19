import { Controller, Get, Post, Patch, Body, Param, UseGuards, Request } from '@nestjs/common';
import { StudioRoomsService } from './studio-rooms.service';
import { CreateStudioRoomDto, UpdateStudioRoomDto } from './dto/studio-room.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('studio-rooms')
@UseGuards(JwtAuthGuard)
export class StudioRoomsController {
  constructor(private readonly studioRoomsService: StudioRoomsService) {}

  @Get()
  findAll(@Request() req: any) {
    return this.studioRoomsService.findAll(req.user.studioId);
  }

  @Post()
  create(@Body() dto: CreateStudioRoomDto, @Request() req: any) {
    return this.studioRoomsService.create(dto, req.user.studioId);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateStudioRoomDto, @Request() req: any) {
    return this.studioRoomsService.update(id, dto, req.user.studioId);
  }
}
