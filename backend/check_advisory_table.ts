import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  try {
    const count = await prisma.advisory.count();
    console.log(`Advisory table count: ${count}`);
    
    if (count > 0) {
      const samples = await prisma.advisory.findMany({ take: 3 });
      console.log('Sample data:', samples);
    }
  } catch (error) {
    console.error('Error checking Advisory table:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
