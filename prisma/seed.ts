import { PrismaClient } from '@prisma/client';
import { seedUsers } from './seeders';
const prisma: PrismaClient = new PrismaClient();

async function main() {
  await seedUsers(prisma);
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
