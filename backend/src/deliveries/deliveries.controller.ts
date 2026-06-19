import { Controller, Get, Post, Patch, Body, Param, UseGuards, Request } from '@nestjs/common';
import { DeliveriesService } from './deliveries.service';
import { CreateDeliveryDto } from './dto/create-delivery.dto';
import { UpdateDeliveryDto } from './dto/update-delivery.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('deliveries')
@UseGuards(JwtAuthGuard)
export class DeliveriesController {
  constructor(private readonly deliveriesService: DeliveriesService) {}

  @Get()
  findAll(@Request() req: any) {
    return this.deliveriesService.findAll(req.user.studioId);
  }

  @Post()
  create(@Body() dto: CreateDeliveryDto, @Request() req: any) {
    return this.deliveriesService.create(dto, req.user.studioId);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateDeliveryDto, @Request() req: any) {
    return this.deliveriesService.update(id, dto, req.user.studioId);
  }
}
