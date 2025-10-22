import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../../core/prisma/prisma.service";
import { Vehicle, Prisma } from "@prisma/client";

@Injectable()
export class TransmivycaService {
  constructor(private prisma: PrismaService) {}

  async createVehicle(data: Prisma.VehicleCreateInput): Promise<Vehicle> {
    return this.prisma.vehicle.create({
      data,
      include: {
        company: true,
      },
    });
  }

  async findAllVehicles(companyId: string): Promise<Vehicle[]> {
    return this.prisma.vehicle.findMany({
      where: { companyId },
      include: {
        company: true,
      },
      orderBy: {
        plate: "asc",
      },
    });
  }

  async findVehicleById(id: string): Promise<Vehicle> {
    const vehicle = await this.prisma.vehicle.findUnique({
      where: { id },
      include: {
        company: true,
      },
    });

    if (!vehicle) {
      throw new NotFoundException(`Vehículo con ID ${id} no encontrado`);
    }

    return vehicle;
  }

  async updateVehicle(
    id: string,
    data: Prisma.VehicleUpdateInput
  ): Promise<Vehicle> {
    try {
      return await this.prisma.vehicle.update({
        where: { id },
        data,
        include: {
          company: true,
        },
      });
    } catch (error) {
      if (error.code === "P2025") {
        throw new NotFoundException(`Vehículo con ID ${id} no encontrado`);
      }
      throw error;
    }
  }

  async deleteVehicle(id: string): Promise<Vehicle> {
    try {
      return await this.prisma.vehicle.delete({
        where: { id },
      });
    } catch (error) {
      if (error.code === "P2025") {
        throw new NotFoundException(`Vehículo con ID ${id} no encontrado`);
      }
      throw error;
    }
  }

  async getFleetStats(companyId: string) {
    const stats = await this.prisma.vehicle.groupBy({
      by: ["status", "type"],
      where: { companyId },
      _count: {
        _all: true,
      },
    });

    const totalVehicles = await this.prisma.vehicle.count({
      where: { companyId },
    });

    return {
      fleetByStatusAndType: stats,
      totalVehicles,
      availableVehicles: stats
        .filter((stat) => stat.status === "AVAILABLE")
        .reduce((sum, stat) => sum + stat._count._all, 0),
    };
  }
}
