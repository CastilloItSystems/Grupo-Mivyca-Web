import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../core/prisma/prisma.service';
import { Product, Prisma } from '@prisma/client';

@Injectable()
export class AlmivycaService {
  constructor(private prisma: PrismaService) {}

  async createProduct(data: Prisma.ProductCreateInput): Promise<Product> {
    return this.prisma.product.create({
      data,
      include: {
        company: true,
      },
    });
  }

  async findAllProducts(companyId: string): Promise<Product[]> {
    return this.prisma.product.findMany({
      where: { 
        companyId,
        isActive: true 
      },
      include: {
        company: true,
      },
      orderBy: {
        name: 'asc',
      },
    });
  }

  async findProductById(id: string): Promise<Product> {
    const product = await this.prisma.product.findUnique({
      where: { id },
      include: {
        company: true,
      },
    });

    if (!product) {
      throw new NotFoundException(`Producto con ID ${id} no encontrado`);
    }

    return product;
  }

  async updateProduct(id: string, data: Prisma.ProductUpdateInput): Promise<Product> {
    try {
      return await this.prisma.product.update({
        where: { id },
        data,
        include: {
          company: true,
        },
      });
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException(`Producto con ID ${id} no encontrado`);
      }
      throw error;
    }
  }

  async deleteProduct(id: string): Promise<Product> {
    try {
      return await this.prisma.product.delete({
        where: { id },
      });
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException(`Producto con ID ${id} no encontrado`);
      }
      throw error;
    }
  }

  async updateStock(id: string, quantity: number): Promise<Product> {
    const product = await this.findProductById(id);
    
    return this.prisma.product.update({
      where: { id },
      data: {
        stock: quantity,
      },
      include: {
        company: true,
      },
    });
  }

  async getLowStockProducts(companyId: string, threshold: number = 10): Promise<Product[]> {
    return this.prisma.product.findMany({
      where: {
        companyId,
        stock: {
          lte: threshold,
        },
        isActive: true,
      },
      include: {
        company: true,
      },
      orderBy: {
        stock: 'asc',
      },
    });
  }

  async getInventoryStats(companyId: string) {
    const stats = await this.prisma.product.aggregate({
      where: { companyId, isActive: true },
      _count: {
        id: true,
      },
      _sum: {
        stock: true,
      },
      _avg: {
        price: true,
      },
    });

    const lowStockCount = await this.prisma.product.count({
      where: {
        companyId,
        stock: { lte: 10 },
        isActive: true,
      },
    });

    return {
      totalProducts: stats._count.id || 0,
      totalStock: stats._sum.stock || 0,
      averagePrice: stats._avg.price || 0,
      lowStockProducts: lowStockCount,
    };
  }
}
