import { PrismaClient } from '@prisma/client';
import { createHash } from 'crypto';

const prisma = new PrismaClient();

function hashPassword(password: string): string {
  return createHash('sha256').update(password).digest('hex');
}

export async function seedUsers() {
  console.log('Seeding 4 Demo Sandbox accounts...');

  const users = [
    {
      email: 'citizen@demo.yojna',
      phone: '+91 94350 11111',
      name: 'Bipul Baruah',
      passwordHash: hashPassword('demo123'),
      role: 'CITIZEN',
      preferredLang: 'as',
      district: 'Darrang',
    },
    {
      email: 'officer@demo.yojna',
      phone: '+91 94350 22222',
      name: 'Pranjal Saikia',
      passwordHash: hashPassword('demo123'),
      role: 'FIELD_OFFICER',
      preferredLang: 'as',
      district: 'Darrang',
    },
    {
      email: 'dc@demo.yojna',
      phone: '+91 94350 33333',
      name: 'Dr. R. K. Sarma, IAS',
      passwordHash: hashPassword('demo123'),
      role: 'DC_COMMISSIONER',
      preferredLang: 'en',
      district: 'Darrang',
    },
    {
      email: 'admin@demo.yojna',
      phone: '+91 94350 44444',
      name: 'System Administrator',
      passwordHash: hashPassword('demo123'),
      role: 'ADMIN',
      preferredLang: 'en',
      district: 'Kamrup Metro',
    },
  ];

  for (const u of users) {
    await prisma.user.upsert({
      where: { email: u.email },
      update: u,
      create: u,
    });
  }

  console.log('✅ Users seeded');
}