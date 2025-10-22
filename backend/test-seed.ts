import { PrismaClient, UserRole } from "@prisma/client";
import * as bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function testSeed() {
  console.log("🌱 Testing seeding...");

  try {
    await prisma.$connect();
    console.log("✅ Connected to database");

    // Get companies
    const companies = await prisma.company.findMany();
    console.log(
      "📊 Found companies:",
      companies.map((c) => c.name)
    );

    if (companies.length === 0) {
      console.log("❌ No companies found, cannot proceed");
      return;
    }

    const almivyca = companies.find((c) => c.slug === "almivyca");
    const transmivyca = companies.find((c) => c.slug === "transmivyca");
    const camabar = companies.find((c) => c.slug === "camabar");

    if (!almivyca || !transmivyca || !camabar) {
      console.log("❌ Missing companies");
      return;
    }

    // Check users
    const existingUsers = await prisma.user.count();
    console.log("👥 Existing users:", existingUsers);

    if (existingUsers >= 7) {
      console.log("ℹ️ Users already exist, skipping user creation");
      return;
    }

    const hashedPassword = await bcrypt.hash("admin123", 10);

    // Create admin for Almivyca
    console.log("Creating admin for Almivyca...");
    const adminAlmivyca = await prisma.user.upsert({
      where: { email: "admin@almivyca.com" },
      update: {},
      create: {
        email: "admin@almivyca.com",
        password: hashedPassword,
        firstName: "Carlos",
        lastName: "Administrador",
        isActive: true,
        emailVerified: true,
        defaultCompanyId: almivyca.id,
      },
    });
    console.log("✅ Created admin:", adminAlmivyca.email);

    // Add company access
    console.log("Adding company access...");
    await prisma.userCompanyAccess.upsert({
      where: {
        userId_companyId: {
          userId: adminAlmivyca.id,
          companyId: almivyca.id,
        },
      },
      update: {},
      create: {
        userId: adminAlmivyca.id,
        companyId: almivyca.id,
        role: UserRole.ADMIN,
        isActive: true,
      },
    });
    console.log("✅ Added company access");

    // Verify
    const userCount = await prisma.user.count();
    const accessCount = await prisma.userCompanyAccess.count();
    console.log("📊 Final counts - Users:", userCount, "Access:", accessCount);
  } catch (error) {
    console.error("❌ Error:", error);
  } finally {
    await prisma.$disconnect();
  }
}

testSeed();
