import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export enum Status {
  pending = 'Pendente',
  sent = 'Enviado',
  failed = 'Falhou',
}

export class CreateNotificationDto {
  @IsOptional()
  id?: string;

  @IsOptional()
  userId: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  contactId: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  message?: string;

  @IsOptional()
  sentAt?: Date;

  @IsEnum(Status)
  status: Status = Status.pending;

  @IsOptional()
  createdAt: Date;

  @IsOptional()
  updatedAt: Date;
}
