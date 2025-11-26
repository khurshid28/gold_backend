import { IsString, IsBoolean, IsOptional, IsInt, IsIn } from 'class-validator';

export class CreateBranchDto {
  @IsString()
  name: string;

  @IsString()
  address: string;

  @IsString()
  phone: string;

  @IsString()
  city: string;

  @IsIn(['ANDIJON', 'BUXORO', 'FARGONA', 'JIZZAX', 'XORAZM', 'NAMANGAN', 'NAVOIY', 'QASHQADARYO', 'QORAQALPOQ', 'SAMARQAND', 'SIRDARYO', 'SURXONDARYO', 'TOSHKENT', 'TOSHKENT_SHAHAR'])
  region: 'ANDIJON' | 'BUXORO' | 'FARGONA' | 'JIZZAX' | 'XORAZM' | 'NAMANGAN' | 'NAVOIY' | 'QASHQADARYO' | 'QORAQALPOQ' | 'SAMARQAND' | 'SIRDARYO' | 'SURXONDARYO' | 'TOSHKENT' | 'TOSHKENT_SHAHAR';

  @IsInt()
  @IsOptional()
  managerId?: number;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}
