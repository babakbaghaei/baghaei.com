import { Controller, Post, Body, UseInterceptors } from '@nestjs/common';
import { CareersService } from './careers.service';
import { CreateJobApplicationDto } from './dto/create-job-application.dto';
import { TransformInterceptor } from '../common/interceptors/transform.interceptor';

@Controller('careers')
@UseInterceptors(TransformInterceptor)
export class CareersController {
  constructor(private readonly careersService: CareersService) {}

  @Post()
  async create(@Body() dto: CreateJobApplicationDto) {
    return this.careersService.create(dto);
  }
}
