import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const userEmail = 'backend_test@wb.gov.in';
  
  // 1. Simulate Controller Logic
  console.log(`Simulating creation for ${userEmail}...`);
  const user = await prisma.user.upsert({
    where: { email: userEmail },
    update: {},
    create: { email: userEmail, name: 'Backend Test User' }
  });

  const advisory = await prisma.cropAdvisory.create({
    data: {
      cropId: 1, // Potato
      location: 'Bankura',
      stage: 'Sowing',
      status: 'active',
      message: 'DB Logic Test Advisory',
      userId: user.id
    }
  });
  console.log(`Created advisory ID: ${advisory.id}`);

  // 2. Verify Reading
  const history = await prisma.cropAdvisory.findMany({
    where: { userId: user.id }
  });

  const match = history.find(h => h.id === advisory.id);
  if (match) {
    console.log(`✅ SUCCESS: Advisory ${match.id} found for user ${user.email}`);
  } else {
    console.error('❌ FAILURE: Advisory not found.');
  }
}

main().finally(() => prisma.$disconnect());
