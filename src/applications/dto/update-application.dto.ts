import { IsString, IsNumber, IsOptional, IsIn } from 'class-validator';

export class UpdateApplicationDto {
  @IsString()
  @IsOptional()
  title?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsIn(['PENDING', 'APPROVED', 'REJECTED', 'PROCESSING', 'COMPLETED'])
  @IsOptional()
  status?: 'PENDING' | 'APPROVED' | 'REJECTED' | 'PROCESSING' | 'COMPLETED';

  @IsNumber()
  @IsOptional()
  amount?: number;

  @IsString()
  @IsOptional()
  notes?: string;
}
