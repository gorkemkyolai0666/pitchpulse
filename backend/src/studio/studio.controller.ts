import { Body, Controller, Get, Patch, Request, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { UpdateStudioDto } from './dto/update-studio.dto';
import { StudioService } from './studio.service';

@Controller('studio')
@UseGuards(JwtAuthGuard)
export class StudioController {
  constructor(private readonly studioService: StudioService) {}

  @Get()
  getProfile(@Request() req: { user: { studioId: string } }) {
    return this.studioService.getProfile(req.user.studioId);
  }

  @Patch()
  updateProfile(
    @Request() req: { user: { studioId: string } },
    @Body() dto: UpdateStudioDto,
  ) {
    return this.studioService.updateProfile(req.user.studioId, dto);
  }
}
