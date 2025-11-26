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
  ParseIntPipe,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApplicationsService } from './applications.service';
import { CreateApplicationDto } from './dto/create-application.dto';
import { UpdateApplicationDto } from './dto/update-application.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { videoMulterConfig } from '../upload/multer.config';

@Controller('applications')
@UseGuards(JwtAuthGuard)
export class ApplicationsController {
  constructor(private readonly applicationsService: ApplicationsService) {}

  @Post()
  @UseInterceptors(FileInterceptor('video', videoMulterConfig))
  create(
    @Request() req, 
    @Body() createApplicationDto: CreateApplicationDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    return this.applicationsService.create(req.user.id, createApplicationDto, file);
  }

  @Get()
  findAll(@Request() req) {
    return this.applicationsService.findAll(req.user.role, req.user.id);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number, @Request() req) {
    return this.applicationsService.findOne(id, req.user.role, req.user.id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateApplicationDto: UpdateApplicationDto,
    @Request() req,
  ) {
    return this.applicationsService.update(id, updateApplicationDto, req.user.role, req.user.id);
  }

  @Patch(':id/upload-video')
  @UseInterceptors(FileInterceptor('video', videoMulterConfig))
  uploadVideo(
    @Param('id', ParseIntPipe) id: number,
    @Request() req,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.applicationsService.uploadVideo(id, file, req.user.role, req.user.id);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number, @Request() req) {
    return this.applicationsService.remove(id, req.user.role, req.user.id);
  }
}
