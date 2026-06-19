import { IsString, IsOptional, IsNumber, IsEnum, IsDateString } from 'class-validator';

export class UpdateDeliveryDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsEnum(['mix', 'master', 'stems', 'demo', 'podcast_edit'])
  type?: string;

  @IsOptional()
  @IsEnum(['quoted', 'in_progress', 'review', 'delivered', 'cancelled'])
  status?: string;

  @IsOptional()
  @IsNumber()
  totalPrice?: number;

  @IsOptional()
  @IsNumber()
  paidAmount?: number;

  @IsOptional()
  @IsDateString()
  dueDate?: string;

  @IsOptional()
  @IsDateString()
  deliveredDate?: string;

  @IsOptional()
  @IsString()
  notes?: string;
}
