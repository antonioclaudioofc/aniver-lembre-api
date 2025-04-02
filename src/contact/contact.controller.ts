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
import { ContactService } from './contact.service';
import { CreateContactDto } from './dto/create-contact.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import { ApiBearerAuth } from '@nestjs/swagger';
import { UpdateContactDto } from './dto/update-contact.dto';

@Controller('contact')
export class ContactController {
  constructor(private readonly contactService: ContactService) {}

  @Post()
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  create(@Body() createContactDto: CreateContactDto, @Request() request) {
    return this.contactService.create(createContactDto, request);
  }

  @Get()
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  findAll(@Request() request) {
    return this.contactService.findAll(request);
  }

  @Get(':id')
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  findOne(@Param('id') id: string, @Request() request) {
    return this.contactService.findOne(id, request);
  }
  
  @Patch(':id')
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  update(
    @Param('id') id: string,
    @Body() updateContactDto: UpdateContactDto,
    @Request() request,
  ) {
    return this.contactService.update(id, updateContactDto, request);
  }

  @Delete(':id')
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  remove(@Param('id') id: string, @Request() request) {
    return this.contactService.remove(id, request);
  }
}
