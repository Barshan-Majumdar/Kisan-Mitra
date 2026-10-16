import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const district = 'Darjeeling';
  console.log(`Testing query for ${district}...`);
  
  const districtCrops = await prisma.districtCrop.findMany({
    where: { district: district },
    include: { crop: true, season: true, soilType: true }
  });

  console.log(`Found ${districtCrops.length} matches.`);
  districtCrops.forEach(dc => {
    console.log(`- ${dc.crop.name} (Soil: ${dc.soilType.name})`);
  });

  if (districtCrops.some(dc => dc.crop.name === 'Tea')) {
    console.log('✅ DATABASE VERIFICATION PASSED');
  } else {
    console.error('❌ DATABASE VERIFICATION FAILED');
  }
}

main().finally(() => prisma.$disconnect());
