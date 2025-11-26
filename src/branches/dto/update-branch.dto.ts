import { IsString, IsBoolean, IsOptional, IsInt, IsIn } from 'class-validator';

export class UpdateBranchDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  address?: string;

  @IsString()
  @IsOptional()
  phone?: string;

  @IsString()
  @IsOptional()
  city?: string;

  @IsIn(['ANDIJON', 'BUXORO', 'FARGONA', 'JIZZAX', 'XORAZM', 'NAMANGAN', 'NAVOIY', 'QASHQADARYO', 'QORAQALPOQ', 'SAMARQAND', 'SIRDARYO', 'SURXONDARYO', 'TOSHKENT', 'TOSHKENT_SHAHAR'])
  @IsOptional()
  region?: 'ANDIJON' | 'BUXORO' | 'FARGONA' | 'JIZZAX' | 'XORAZM' | 'NAMANGAN' | 'NAVOIY' | 'QASHQADARYO' | 'QORAQALPOQ' | 'SAMARQAND' | 'SIRDARYO' | 'SURXONDARYO' | 'TOSHKENT' | 'TOSHKENT_SHAHAR';

  @IsInt()
  @IsOptional()
  managerId?: number;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}
