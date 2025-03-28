import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateNotificationDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  message: string;
}
