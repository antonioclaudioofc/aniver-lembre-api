import { ApiProperty } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import {
  IsDate,
  IsEnum,
  IsInstance,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxDate,
} from 'class-validator';

export enum RelationShip {
  friend = 'Amigo(a)',
  family = 'Familiares',
  colleague = 'Colega de trabalho',
  acquaintance = 'Conhecido(a)',
  neighbor = 'Vizinho(a)',
  another = 'Outros',
}

export class CreateContactDto {
  @IsOptional()
  id?: string;

  @IsOptional()
  userId?: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsDate()
  @IsInstance(Date)
  @MaxDate(new Date())
  @Transform(({ value }) =>
    typeof value === 'string' ? new Date(value) : value,
  )
  @Type(() => Date)
  birthdate: Date;

  @ApiProperty({ enum: RelationShip, default: RelationShip.friend })
  @IsEnum(RelationShip)
  relationship: RelationShip = RelationShip.friend;

  @IsOptional()
  createdAt: Date;

  @IsOptional()
  updatedAt: Date;
}
