import { Controller, Get, Post, Patch, Delete, Body, Param, UseGuards, Request } from '@nestjs/common';
import { SessionsService } from './sessions.service';
import { CreateSessionDto } from './dto/create-session.dto';
import { UpdateSessionDto } from './dto/update-session.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('sessions')
@UseGuards(JwtAuthGuard)
export class SessionsController {
  constructor(private readonly sessionsService: SessionsService) {}

  @Get()
  findAll(@Request() req: any) {
    return this.sessionsService.findAll(req.user.studioId);
  }

  @Post()
  create(@Body() dto: CreateSessionDto, @Request() req: any) {
    return this.sessionsService.create(dto, req.user.studioId);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateSessionDto, @Request() req: any) {
    return this.sessionsService.update(id, dto, req.user.studioId);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Request() req: any) {
    return this.sessionsService.remove(id, req.user.studioId);
  }
}
