import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateNotificationDto } from './create-notification.dto';
import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateNotificationDto extends PartialType(CreateNotificationDto) {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  message: string;
}
