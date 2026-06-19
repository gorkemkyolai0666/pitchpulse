import { IsString, IsOptional, IsInt, IsEnum, IsDateString } from 'class-validator';

export class CreateSessionDto {
  @IsDateString()
  date: string;

  @IsOptional()
  @IsInt()
  duration?: number;

  @IsOptional()
  @IsEnum(['recording', 'mixing', 'mastering', 'rehearsal', 'podcast'])
  type?: string;

  @IsString()
  clientId: string;

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
