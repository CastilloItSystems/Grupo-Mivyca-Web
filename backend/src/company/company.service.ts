import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../core/prisma/prisma.service";
import { Company, Prisma } from "@prisma/client";

@Injectable()
export class CompanyService {
  constructor(private prisma: PrismaService) {}

  async create(data: Prisma.CompanyCreateInput): Promise<Company> {
    return this.prisma.company.create({
      data,
    });
  }

  async findAll(): Promise<Company[]> {
    return this.prisma.company.findMany({
      where: { isActive: true },
      orderBy: {
        name: "asc",
      },
    });
  }

  async findOne(id: string): Promise<Company> {
    const company = await this.prisma.company.findUnique({
      where: { id },
      include: {
        userAccess: {
          where: {
            isActive: true,
          },
          select: {
            id: true,
            role: true,
            isActive: true,
            user: {
              select: {
                id: true,
                email: true,
                firstName: true,
                lastName: true,
                isActive: true,
              },
            },
          },
        },
        _count: {
          select: {
            userAccess: true,
            products: true,
            vehicles: true,
            orders: true,
          },
        },
      },
    });

    if (!company) {
      throw new NotFoundException(`Empresa con ID ${id} no encontrada`);
    }

    return company;
  }

  async findBySlug(slug: string): Promise<Company> {
    const company = await this.prisma.company.findUnique({
      where: { slug },
    });

    if (!company) {
      throw new NotFoundException(`Empresa con slug ${slug} no encontrada`);
    }

    return company;
  }

  async update(id: string, data: Prisma.CompanyUpdateInput): Promise<Company> {
    try {
      return await this.prisma.company.update({
        where: { id },
        data,
      });
    } catch (error) {
      if (error.code === "P2025") {
        throw new NotFoundException(`Empresa con ID ${id} no encontrada`);
      }
      throw error;
    }
  }

  async remove(id: string): Promise<Company> {
    try {
      return await this.prisma.company.delete({
        where: { id },
      });
    } catch (error) {
      if (error.code === "P2025") {
        throw new NotFoundException(`Empresa con ID ${id} no encontrada`);
      }
      throw error;
    }
  }

  async getCompanyStats(companyId: string) {
    const stats = await this.prisma.company.findUnique({
      where: { id: companyId },
      select: {
        id: true,
        name: true,
        _count: {
          select: {
            userAccess: true,
            products: true,
            vehicles: true,
            orders: true,
          },
        },
      },
    });

    if (!stats) {
      throw new NotFoundException(`Empresa con ID ${companyId} no encontrada`);
    }

    return {
      companyId: stats.id,
      companyName: stats.name,
      totalUsers: stats._count.userAccess,
      totalProducts: stats._count.products,
      totalVehicles: stats._count.vehicles,
      totalOrders: stats._count.orders,
    };
  }
}
