const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function checkData() {
  try {
    console.log("🔍 Verificando datos en la base de datos...");

    const companies = await prisma.company.findMany({
      select: { name: true, slug: true },
    });

    const users = await prisma.user.findMany({
      select: { email: true, firstName: true, lastName: true },
    });

    const userAccess = await prisma.userCompanyAccess.findMany({
      select: {
        role: true,
        user: { select: { email: true } },
        company: { select: { name: true } },
      },
    });

    console.log("📊 RESUMEN DE DATOS:");
    console.log(`🏢 Empresas (${companies.length}):`);
    companies.forEach((c) => console.log(`   • ${c.name} (${c.slug})`));

    console.log(`👥 Usuarios (${users.length}):`);
    users.forEach((u) =>
      console.log(`   • ${u.firstName} ${u.lastName} - ${u.email}`)
    );

    console.log(`🔗 Accesos (${userAccess.length}):`);
    userAccess.forEach((a) =>
      console.log(`   • ${a.user.email} → ${a.company.name} (${a.role})`)
    );
  } catch (error) {
    console.error("Error:", error.message);
  } finally {
    await prisma.$disconnect();
  }
}

checkData();
