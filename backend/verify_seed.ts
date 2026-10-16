import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const count = await prisma.districtCrop.count();
  console.log(`Total DistrictCrop entries: ${count}`);

  const sample = await prisma.districtCrop.findFirst({
    where: { district: 'Darjeeling', crop: { name: 'Tea' } },
    include: { crop: true, season: true, soilType: true }
  });

  console.log('Sample Entry (Darjeeling Tea):');
  console.log(JSON.stringify(sample, null, 2));

  const sample2 = await prisma.districtCrop.findFirst({
    where: { district: 'Malda', crop: { name: 'Mango (Fazli)' } },
    include: { crop: true, season: true, soilType: true }
  });

  console.log('Sample Entry (Malda Mango):');
  console.log(JSON.stringify(sample2, null, 2));
}

main()
  .catch(e => console.error(e))
  .finally(async () => await prisma.$disconnect());
