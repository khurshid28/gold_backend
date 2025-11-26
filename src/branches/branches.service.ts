import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBranchDto } from './dto/create-branch.dto';
import { UpdateBranchDto } from './dto/update-branch.dto';
import { Region } from '@prisma/client';

@Injectable()
export class BranchesService {
  constructor(private prisma: PrismaService) {}

  async create(createBranchDto: CreateBranchDto, file?: Express.Multer.File) {
    const { managerId, ...branchData } = createBranchDto;
    
    const imageUrl = file ? `/public/uploads/${file.filename}` : null;
    
    const branch = await this.prisma.branch.create({
      data: {
        ...branchData,
        region: branchData.region as Region,
        imageUrl,
        ...(managerId && { manager: { connect: { id: managerId } } }),
      },
      include: {
        manager: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    return {
      message: 'Branch created successfully',
      branch,
    };
  }

  async findAll() {
    const branches = await this.prisma.branch.findMany({
      include: {
        manager: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        _count: {
          select: {
            applications: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return {
      message: 'Branches retrieved successfully',
      count: branches.length,
      branches,
    };
  }

  async findOne(id: number) {
    const branch = await this.prisma.branch.findUnique({
      where: { id },
      include: {
        manager: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
          },
        },
        applications: {
          take: 10,
          orderBy: {
            createdAt: 'desc',
          },
        },
      },
    });

    if (!branch) {
      throw new NotFoundException(`Branch with ID ${id} not found`);
    }

    return {
      message: 'Branch retrieved successfully',
      branch,
    };
  }

  async update(id: number, updateBranchDto: UpdateBranchDto, file?: Express.Multer.File) {
    await this.findOne(id);

    const { managerId, region, ...otherData } = updateBranchDto;
    
    const imageUrl = file ? `/public/uploads/${file.filename}` : undefined;

    const branch = await this.prisma.branch.update({
      where: { id },
      data: {
        ...otherData,
        ...(imageUrl && { imageUrl }),
        ...(region && { region: region as Region }),
        ...(managerId !== undefined && {
          manager: managerId ? { connect: { id: managerId } } : { disconnect: true },
        }),
      },
      include: {
        manager: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    return {
      message: 'Branch updated successfully',
      branch,
    };
  }

  async remove(id: number) {
    await this.findOne(id);

    await this.prisma.branch.delete({
      where: { id },
    });

    return {
      message: 'Branch deleted successfully',
    };
  }
}
