import { IsString, IsOptional, IsInt, IsEnum, IsDateString } from 'class-validator';

export class UpdateSessionDto {
  @IsOptional()
  @IsDateString()
  date?: string;

  @IsOptional()
  @IsInt()
  duration?: number;

  @IsOptional()
  @IsEnum(['recording', 'mixing', 'mastering', 'rehearsal', 'podcast'])
  type?: string;

  @IsOptional()
  @IsEnum(['scheduled', 'confirmed', 'in_progress', 'completed', 'cancelled', 'no_show'])
  status?: string;

  @IsOptional()
  @IsString()
  studioRoomId?: string;

  @IsOptional()
  @IsString()
  notes?: string;

  @IsOptional()
  @IsString()
  engineerName?: string;
}
