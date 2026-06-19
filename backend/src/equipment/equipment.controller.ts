import { Controller, Get, Post, Patch, Delete, Body, Param, UseGuards, Request } from '@nestjs/common';
import { EquipmentService } from './equipment.service';
import { EquipmentDto, UpdateEquipmentDto } from './dto/equipment.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('equipment')
@UseGuards(JwtAuthGuard)
export class EquipmentController {
  constructor(private readonly equipmentService: EquipmentService) {}

  @Get()
  findAll(@Request() req: any) {
    return this.equipmentService.findAll(req.user.studioId);
  }

  @Post()
  create(@Body() dto: EquipmentDto, @Request() req: any) {
    return this.equipmentService.create(dto, req.user.studioId);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateEquipmentDto, @Request() req: any) {
    return this.equipmentService.update(id, dto, req.user.studioId);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Request() req: any) {
    return this.equipmentService.remove(id, req.user.studioId);
  }
}
