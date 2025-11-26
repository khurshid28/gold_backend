import { IsString } from 'class-validator';

export class VerifyMyIdDto {
  @IsString()
  code: string;
}
