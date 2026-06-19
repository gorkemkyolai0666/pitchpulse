import { IsString, IsOptional, IsNumber, IsEnum } from 'class-validator';

export class CreateStudioRoomDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsEnum(['live', 'vocal', 'mix', 'mastering', 'podcast'])
  roomType?: string;

  @IsOptional()
  @IsNumber()
  hourlyRate?: number;

  @IsOptional()
  @IsNumber()
  capacity?: number;

  @IsOptional()
  @IsString()
  description?: string;
}

export class UpdateStudioRoomDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsEnum(['live', 'vocal', 'mix', 'mastering', 'podcast'])
  roomType?: string;

  @IsOptional()
  @IsNumber()
  hourlyRate?: number;

  @IsOptional()
  @IsNumber()
  capacity?: number;

  @IsOptional()
  @IsString()
  description?: string;
}
