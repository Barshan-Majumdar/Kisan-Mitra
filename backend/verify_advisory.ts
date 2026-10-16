import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const count = await prisma.cropAdvisory.count();
  console.log(`Total Advisories: ${count}`);
  if (count > 0) {
    const adv = await prisma.cropAdvisory.findFirst({ include: { crop: true } });
    console.log('Sample Advisory:', JSON.stringify(adv, null, 2));
  } else {
    console.error('❌ NO ADVISORIES FOUND');
  }
}

main()
  .catch(e => console.error(e))
  .finally(async () => await prisma.$disconnect());
