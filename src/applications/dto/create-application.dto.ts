import { IsString, IsNumber, IsOptional, IsInt } from 'class-validator';

export class CreateApplicationDto {
  @IsString()
  title: string;

  @IsString()
  description: string;

  @IsInt()
  @IsOptional()
  branchId?: number;

  @IsNumber()
  @IsOptional()
  amount?: number;

  @IsString()
  @IsOptional()
  notes?: string;
}
