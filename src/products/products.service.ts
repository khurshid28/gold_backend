import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) {}

  async create(createProductDto: CreateProductDto) {
    const product = await this.prisma.product.create({
      data: createProductDto,
    });

    return {
      message: 'Product created successfully',
      product,
    };
  }

  async findAll() {
    const products = await this.prisma.product.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });

    return {
      message: 'Products retrieved successfully',
      count: products.length,
      products,
    };
  }

  async findOne(id: number) {
    const product = await this.prisma.product.findUnique({
      where: { id },
    });

    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }

    return {
      message: 'Product retrieved successfully',
      product,
    };
  }

  async update(id: number, updateProductDto: UpdateProductDto) {
    // Check if product exists
    await this.findOne(id);

    const product = await this.prisma.product.update({
      where: { id },
      data: updateProductDto,
    });

    return {
      message: 'Product updated successfully',
      product,
    };
  }

  async remove(id: number) {
    // Check if product exists
    await this.findOne(id);

    await this.prisma.product.delete({
      where: { id },
    });

    return {
      message: 'Product deleted successfully',
    };
  }
}
