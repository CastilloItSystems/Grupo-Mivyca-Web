import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../../core/prisma/prisma.service";
import { Order, Prisma } from "@prisma/client";

@Injectable()
export class CamabarService {
  constructor(private prisma: PrismaService) {}

  async createOrder(data: Prisma.OrderCreateInput): Promise<Order> {
    return this.prisma.order.create({
      data,
      include: {
        company: true,
      },
    });
  }

  async findAllOrders(companyId: string): Promise<Order[]> {
    return this.prisma.order.findMany({
      where: { companyId },
      include: {
        company: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  }

  async findOrderById(id: string): Promise<Order> {
    const order = await this.prisma.order.findUnique({
      where: { id },
      include: {
        company: true,
      },
    });

    if (!order) {
      throw new NotFoundException(`Pedido con ID ${id} no encontrado`);
    }

    return order;
  }

  async updateOrder(id: string, data: Prisma.OrderUpdateInput): Promise<Order> {
    try {
      return await this.prisma.order.update({
        where: { id },
        data,
        include: {
          company: true,
        },
      });
    } catch (error) {
      if (error.code === "P2025") {
        throw new NotFoundException(`Pedido con ID ${id} no encontrado`);
      }
      throw error;
    }
  }

  async deleteOrder(id: string): Promise<Order> {
    try {
      return await this.prisma.order.delete({
        where: { id },
      });
    } catch (error) {
      if (error.code === "P2025") {
        throw new NotFoundException(`Pedido con ID ${id} no encontrado`);
      }
      throw error;
    }
  }

  async getOrderStats(companyId: string) {
    const stats = await this.prisma.order.groupBy({
      by: ["status"],
      where: { companyId },
      _count: {
        _all: true,
      },
      _sum: {
        total: true,
      },
    });

    return {
      ordersByStatus: stats,
      totalOrders: stats.reduce((sum, stat) => sum + stat._count._all, 0),
      totalRevenue: stats.reduce(
        (sum, stat) => sum + Number(stat._sum.total || 0),
        0
      ),
    };
  }
}
