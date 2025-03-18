import {
  Controller,
  Post,
  Body,
  UseGuards,
  Get,
  Request,
  Patch,
  Delete,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from 'src/auth/auth.guard';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Get()
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  findOne(@Request() request) {
    return this.userService.findOne(request);
  }

  @Patch()
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  update(@Body() updateUserDto: UpdateUserDto, @Request() request) {
    return this.userService.update(updateUserDto, request);
  }

  @Delete()
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  remove(@Request() request) {
    return this.userService.remove(request);
  }
}
