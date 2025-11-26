import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateApplicationDto } from './dto/create-application.dto';
import { UpdateApplicationDto } from './dto/update-application.dto';

@Injectable()
export class ApplicationsService {
  constructor(private prisma: PrismaService) {}

  async create(userId: number, createApplicationDto: CreateApplicationDto, file?: Express.Multer.File) {
    const videoUrl = file ? `/public/uploads/${file.filename}` : null;
    
    const application = await this.prisma.application.create({
      data: {
        ...createApplicationDto,
        userId,
        videoUrl,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
          },
        },
        branch: {
          select: {
            id: true,
            name: true,
            city: true,
          },
        },
      },
    });

    return {
      message: 'Application created successfully',
      application,
    };
  }

  async findAll(userRole: string, userId: number) {
    const whereClause = userRole === 'USER' ? { userId } : {};

    const applications = await this.prisma.application.findMany({
      where: whereClause,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
          },
        },
        branch: {
          select: {
            id: true,
            name: true,
            city: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return {
      message: 'Applications retrieved successfully',
      count: applications.length,
      applications,
    };
  }

  async findOne(id: number, userRole: string, userId: number) {
    const application = await this.prisma.application.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
          },
        },
        branch: {
          select: {
            id: true,
            name: true,
            address: true,
            city: true,
            phone: true,
          },
        },
      },
    });

    if (!application) {
      throw new NotFoundException(`Application with ID ${id} not found`);
    }

    // Users can only see their own applications
    if (userRole === 'USER' && application.userId !== userId) {
      throw new ForbiddenException('You can only view your own applications');
    }

    return {
      message: 'Application retrieved successfully',
      application,
    };
  }

  async update(id: number, updateApplicationDto: UpdateApplicationDto, userRole: string, userId: number) {
    const application = await this.prisma.application.findUnique({
      where: { id },
    });

    if (!application) {
      throw new NotFoundException(`Application with ID ${id} not found`);
    }

    // Users can only update their own applications and only if status is PENDING
    if (userRole === 'USER') {
      if (application.userId !== userId) {
        throw new ForbiddenException('You can only update your own applications');
      }
      if (application.status !== 'PENDING') {
        throw new ForbiddenException('You can only update pending applications');
      }
      // Users cannot change status
      delete updateApplicationDto.status;
    }

    const updatedApplication = await this.prisma.application.update({
      where: { id },
      data: updateApplicationDto,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
          },
        },
        branch: {
          select: {
            id: true,
            name: true,
            city: true,
          },
        },
      },
    });

    return {
      message: 'Application updated successfully',
      application: updatedApplication,
    };
  }

  async remove(id: number, userRole: string, userId: number) {
    const application = await this.prisma.application.findUnique({
      where: { id },
    });

    if (!application) {
      throw new NotFoundException(`Application with ID ${id} not found`);
    }

    // Users can only delete their own pending applications
    if (userRole === 'USER') {
      if (application.userId !== userId) {
        throw new ForbiddenException('You can only delete your own applications');
      }
      if (application.status !== 'PENDING') {
        throw new ForbiddenException('You can only delete pending applications');
      }
    }

    await this.prisma.application.delete({
      where: { id },
    });

    return {
      message: 'Application deleted successfully',
    };
  }

  async uploadVideo(id: number, file: Express.Multer.File, userRole: string, userId: number) {
    if (!file) {
      throw new ForbiddenException('No video file uploaded');
    }

    const application = await this.prisma.application.findUnique({
      where: { id },
    });

    if (!application) {
      throw new NotFoundException('Application not found');
    }

    // Check permissions - only owner or admin/superadmin
    if (userRole === 'USER' && application.userId !== userId) {
      throw new ForbiddenException('You can only upload video to your own applications');
    }

    // Only allow video upload for pending or processing applications
    if (!['PENDING', 'PROCESSING'].includes(application.status)) {
      throw new ForbiddenException(`Cannot upload video for ${application.status.toLowerCase()} applications`);
    }

    const videoUrl = `/public/uploads/${file.filename}`;

    const updatedApplication = await this.prisma.application.update({
      where: { id },
      data: { videoUrl },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        branch: {
          select: {
            id: true,
            name: true,
            city: true,
          },
        },
      },
    });

    return {
      message: 'Video uploaded successfully',
      application: updatedApplication,
    };
  }
}
