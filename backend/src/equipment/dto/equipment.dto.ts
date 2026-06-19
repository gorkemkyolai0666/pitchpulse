import { IsString, IsOptional, IsNumber, IsEnum } from 'class-validator';

export class EquipmentDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsEnum(['microphone', 'interface', 'monitor', 'preamp', 'instrument', 'headphone', 'other'])
  category?: string;

  @IsOptional()
  @IsString()
  brand?: string;

  @IsOptional()
  @IsString()
  model?: string;

  @IsOptional()
  @IsString()
  serialNumber?: string;

  @IsOptional()
  @IsEnum(['excellent', 'good', 'fair', 'needs_repair'])
  condition?: string;

  @IsOptional()
  @IsString()
  studioRoomId?: string;

  @IsOptional()
  @IsString()
  notes?: string;
}

export class UpdateEquipmentDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsEnum(['microphone', 'interface', 'monitor', 'preamp', 'instrument', 'headphone', 'other'])
  category?: string;

  @IsOptional()
  @IsString()
  brand?: string;

  @IsOptional()
  @IsString()
  model?: string;

  @IsOptional()
  @IsString()
  serialNumber?: string;

  @IsOptional()
  @IsEnum(['excellent', 'good', 'fair', 'needs_repair'])
  condition?: string;

  @IsOptional()
  @IsString()
  studioRoomId?: string;

  @IsOptional()
  @IsString()
  notes?: string;
}
