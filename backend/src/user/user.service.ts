import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../core/prisma/prisma.service";
import { User, UserCompanyAccess, Prisma, UserRole } from "@prisma/client";

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async create(data: Prisma.UserCreateInput): Promise<User> {
    return this.prisma.user.create({
      data,
      include: {
        defaultCompany: true,
        companyAccess: {
          include: {
            company: true,
          },
        },
      },
    });
  }

  // Crear usuario con acceso a empresas específicas
  async createWithCompanyAccess(
    userData: Prisma.UserCreateInput,
    companyAccess: { companyId: string; role: UserRole }[]
  ): Promise<User> {
    return this.prisma.user.create({
      data: {
        ...userData,
        companyAccess: {
          create: companyAccess.map((access) => ({
            companyId: access.companyId,
            role: access.role,
            isActive: true,
          })),
        },
      },
      include: {
        defaultCompany: true,
        companyAccess: {
          include: {
            company: true,
          },
        },
      },
    });
  }

  async findAll(): Promise<User[]> {
    return this.prisma.user.findMany({
      include: {
        defaultCompany: true,
        companyAccess: {
          include: {
            company: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  }

  async findOne(id: string): Promise<User> {
    const user = await this.prisma.user.findUnique({
      where: { id },
      include: {
        defaultCompany: true,
        companyAccess: {
          include: {
            company: true,
          },
        },
      },
    });

    if (!user) {
      throw new NotFoundException(`Usuario con ID ${id} no encontrado`);
    }

    return user;
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { email },
      include: {
        defaultCompany: true,
        companyAccess: {
          include: {
            company: true,
          },
        },
      },
    });
  }

  async update(id: string, data: Prisma.UserUpdateInput): Promise<User> {
    try {
      return await this.prisma.user.update({
        where: { id },
        data,
        include: {
          defaultCompany: true,
          companyAccess: {
            include: {
              company: true,
            },
          },
        },
      });
    } catch (error) {
      if (error.code === "P2025") {
        throw new NotFoundException(`Usuario con ID ${id} no encontrado`);
      }
      throw error;
    }
  }

  async remove(id: string): Promise<User> {
    try {
      return await this.prisma.user.delete({
        where: { id },
      });
    } catch (error) {
      if (error.code === "P2025") {
        throw new NotFoundException(`Usuario con ID ${id} no encontrado`);
      }
      throw error;
    }
  }

  // Buscar usuarios que tienen acceso a una empresa específica
  async findByCompany(companyId: string): Promise<User[]> {
    return this.prisma.user.findMany({
      where: {
        companyAccess: {
          some: {
            companyId,
            isActive: true,
          },
        },
      },
      include: {
        defaultCompany: true,
        companyAccess: {
          include: {
            company: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  }

  // Obtener todas las empresas a las que un usuario tiene acceso
  async getUserCompanies(userId: string): Promise<UserCompanyAccess[]> {
    return this.prisma.userCompanyAccess.findMany({
      where: {
        userId,
        isActive: true,
      },
      include: {
        company: true,
      },
    });
  }

  // Verificar si un usuario tiene acceso a una empresa específica
  async hasCompanyAccess(userId: string, companyId: string): Promise<boolean> {
    const access = await this.prisma.userCompanyAccess.findUnique({
      where: {
        userId_companyId: {
          userId,
          companyId,
        },
      },
    });

    return access?.isActive || false;
  }

  // Verificar el rol de un usuario en una empresa específica
  async getUserRoleInCompany(
    userId: string,
    companyId: string
  ): Promise<UserRole | null> {
    const access = await this.prisma.userCompanyAccess.findUnique({
      where: {
        userId_companyId: {
          userId,
          companyId,
        },
      },
    });

    return access?.isActive ? access.role : null;
  }

  // Agregar acceso de usuario a una empresa
  async addCompanyAccess(
    userId: string,
    companyId: string,
    role: UserRole
  ): Promise<UserCompanyAccess> {
    return this.prisma.userCompanyAccess.upsert({
      where: {
        userId_companyId: {
          userId,
          companyId,
        },
      },
      update: {
        role,
        isActive: true,
      },
      create: {
        userId,
        companyId,
        role,
        isActive: true,
      },
      include: {
        company: true,
        user: true,
      },
    });
  }

  // Remover acceso de usuario a una empresa
  async removeCompanyAccess(userId: string, companyId: string): Promise<void> {
    await this.prisma.userCompanyAccess.update({
      where: {
        userId_companyId: {
          userId,
          companyId,
        },
      },
      data: {
        isActive: false,
      },
    });
  }

  // Actualizar rol de usuario en una empresa
  async updateCompanyRole(
    userId: string,
    companyId: string,
    role: UserRole
  ): Promise<UserCompanyAccess> {
    return this.prisma.userCompanyAccess.update({
      where: {
        userId_companyId: {
          userId,
          companyId,
        },
      },
      data: {
        role,
      },
      include: {
        company: true,
        user: true,
      },
    });
  }
}
