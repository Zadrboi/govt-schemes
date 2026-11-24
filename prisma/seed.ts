import { PrismaClient } from '@prisma/client';
import { seedUsers } from './seed-data/users.js';
import { seedProjects } from './seed-data/projects.js';
import { seedNotices } from './seed-data/notices.js';
import { seedActivity } from './seed-data/activity.js';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting Drishti seed...');

  // Clean in dependency order
  await prisma.auditLog.deleteMany();
  await prisma.aiFeedback.deleteMany();
  await prisma.formDraft.deleteMany();
  await prisma.grievance.deleteMany();
  await prisma.fieldInspection.deleteMany();
  await prisma.physicalMilestone.deleteMany();
  await prisma.auditVarianceFlag.deleteMany();
  await prisma.projectWork.deleteMany();
  await prisma.governmentNotice.deleteMany();
  await prisma.user.deleteMany();

  // Seed in order
  await seedUsers();
  await seedProjects();
  await seedNotices();
  await seedActivity();

  // Verify counts
  const counts = {
    users: await prisma.user.count(),
    projects: await prisma.projectWork.count(),
    notices: await prisma.governmentNotice.count(),
    milestones: await prisma.physicalMilestone.count(),
    inspections: await prisma.fieldInspection.count(),
    grievances: await prisma.grievance.count(),
    varianceFlags: await prisma.auditVarianceFlag.count(),
    auditLogs: await prisma.auditLog.count(),
  };

  console.log('\n📊 Seed verification:');
  console.table(counts);
  console.log('\n✅ Seed completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });