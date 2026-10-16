import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('--- Data Diversity Check ---');

  // 1. Weather
  const weatherCount = await prisma.weatherData.count();
  const weatherSample = await prisma.weatherData.findMany({ take: 3, select: { location: true, temperature: true } });
  console.log(`Weather Data Points: ${weatherCount}`);
  console.log('Sample Weather:', JSON.stringify(weatherSample));

  // 2. Markets
  const marketCount = await prisma.marketPrice.count();
  const marketSample = await prisma.marketPrice.findFirst({ where: { marketName: { contains: 'Siliguri' } } });
  console.log(`Market Prices: ${marketCount}`);
  if (marketSample) console.log('Siliguri Tea Price:', marketSample.price);

  // 3. Schemes
  const schemes = await prisma.governmentScheme.findMany({ select: { name: true } });
  console.log('Active Schemes:', schemes.map(s => s.name).join(', '));

  // 4. Advisories
  const advisoryCount = await prisma.cropAdvisory.count();
  console.log(`Active Advisories: ${advisoryCount}`);
}

main()
  .finally(async () => await prisma.$disconnect());
