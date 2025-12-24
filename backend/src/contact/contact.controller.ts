import { Controller, Post, Body, UseInterceptors } from '@nestjs/common';
import { ContactService } from './contact.service';
import { CreateContactDto } from './dto/create-contact.dto';
import { TransformInterceptor } from '../common/interceptors/transform.interceptor';

@Controller('contact')
@UseInterceptors(TransformInterceptor)
export class ContactController {
  constructor(private readonly contactService: ContactService) {}

  @Post()
  async create(@Body() createContactDto: CreateContactDto) {
    return this.contactService.create(createContactDto);
  }
}
