import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('--- Verification Report ---');
  
  // 1. Check for Generic Data
  const delhiWeather = await prisma.weatherData.findFirst({ where: { location: { contains: 'Delhi' } } });
  const punjabMarket = await prisma.marketPrice.findFirst({ where: { marketName: { contains: 'Punjab' } } });
  const oldWheat = await prisma.crop.findFirst({ where: { name: 'Wheat' } }); // Just "Wheat" might still exist if updated, but let's check descripton

  if (delhiWeather || punjabMarket) {
    console.error('❌ FAILURE: Generic data still found!');
    if (delhiWeather) console.log('Found Delhi Weather');
    if (punjabMarket) console.log('Found Punjab Market');
  } else {
    console.log('✅ SUCCESS: No generic (Delhi/Punjab) data found.');
  }

  // 2. Check for WB Data
  const wbScheme = await prisma.governmentScheme.findFirst({ where: { name: 'Krishak Bandhu' } });
  const kolkataWeather = await prisma.weatherData.findFirst({ where: { location: 'Kolkata' } });
  const sufalBangla = await prisma.marketPrice.findFirst({ where: { marketName: { contains: 'Sufal Bangla' } } });

  if (wbScheme && kolkataWeather && sufalBangla) {
    console.log('✅ SUCCESS: West Bengal specific data found.');
    console.log(`Scheme: ${wbScheme.name}`);
    console.log(`Weather Location: ${kolkataWeather.location}`);
    console.log(`Market: ${sufalBangla.marketName}`);
  } else {
    console.error('❌ FAILURE: Missing expected WB data.');
  }

  // 3. Count District Data
  const districtCount = await prisma.districtCrop.count();
  console.log(`Total District Crop Mapping Entries: ${districtCount}`);
}

main()
  .catch(e => console.error(e))
  .finally(async () => await prisma.$disconnect());
