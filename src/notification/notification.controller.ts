import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
} from '@nestjs/common';
import { NotificationService } from './notification.service';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';
import { ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('notification')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @Post()
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  create(
    @Body() createNotificationDto: CreateNotificationDto,
    @Request() request,
  ) {
    return this.notificationService.create(createNotificationDto, request);
  }

  @Get()
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  findAll(@Request() request) {
    return this.notificationService.findAll(request);
  }

  @Get(':id')
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  findOne(@Param('id') id: string, @Request() request) {
    return this.notificationService.findOne(id, request);
  }

  @Patch(':id')
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  update(
    @Param('id') id: string,
    @Body() updateNotificationDto: UpdateNotificationDto,
    @Request() request,
  ) {
    return this.notificationService.update(id, updateNotificationDto, request);
  }

  @Delete(':id')
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  remove(@Param('id') id: string, @Request() request) {
    return this.notificationService.remove(id, request);
  }
}
