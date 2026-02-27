import { PrismaClient, Role } from '@prisma/client';
import * as bcrypt from 'bcrypt';

export async function seedUsers(prisma: PrismaClient) {
  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash('c00rs4m3x1c0', saltRounds);

  const admin = await prisma.user.upsert({
    where: { username: 'admin' },
    update: {},
    create: {
      username: 'admin',
      password: hashedPassword,
      role: Role.ADMIN,
    },
  });

  console.log(`✅ [UserSeeder] Admin creado/encontrado con id: ${admin.id}`);
}
