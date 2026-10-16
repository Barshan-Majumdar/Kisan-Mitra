import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting Professional West Bengal Database Initialization...');

  // 1. Sequence Reset
  const tableNames = ['User', 'Advisory', 'Crop', 'SoilType', 'Season', 'CropSuitability', 'MarketPrice', 'GovernmentScheme', 'SoilData', 'WeatherData', 'Task', 'CropAdvisory', 'DistrictCrop'];
  for (const tableName of tableNames) {
    try {
      await prisma.$executeRawUnsafe(`SELECT setval(pg_get_serial_sequence('"${tableName}"', 'id'), COALESCE((SELECT MAX(id) + 1 FROM "${tableName}"), 1), false);`);
    } catch (error) { /* Ignore */ }
  }

  // 2. Base Data: Seasons
  const seasons = [
    { name: 'Kharif', months: 'June-October' },
    { name: 'Rabi', months: 'October-March' },
    { name: 'Zaid', months: 'March-June' },
    { name: 'Perennial', months: 'Year-Round' },
    { name: 'Winter', months: 'December-February' },
    { name: 'Monsoon', months: 'June-September' },
    { name: 'Summer', months: 'April-June' },
  ];
  for (const s of seasons) await prisma.season.upsert({ where: { name: s.name }, update: {}, create: s });
  console.log('Seasons seeded.');

  // 3. Base Data: Soil Types
  const soilTypes = [
    { name: 'Alluvial', description: 'Fertile soil found in Gangetic plains' },
    { name: 'Red Laterite', description: 'Found in western districts like Purulia', characteristics: 'Iron-rich, acidic' },
    { name: 'Coastal Saline', description: 'Found in South 24 Parganas' },
    { name: 'Terai Soil', description: 'Found in North Bengal foothills' },
    { name: 'Gangetic Alluvial', description: 'Murshidabad, Nadia' },
    { name: 'Red Sandy Loam', description: 'Bankura region' },
    { name: 'Clay Loam', description: 'Heavy soil, good for rice' },
    { name: 'Loamy', description: 'Ideal for vegetables' },
    { name: 'Lateritic Loam', description: 'Birbhum region' },
    { name: 'Mountain Loam', description: 'Kalimpong, Darjeeling' }
  ];
  for (const s of soilTypes) await prisma.soilType.upsert({ where: { name: s.name }, update: {}, create: s });
  console.log('Soil Types seeded.');

  // 4. Government Schemes (Rich Data)
  const schemes = [
    { name: 'Krishak Bandhu', description: 'Financial assistance of ₹10,000/acre per year (₹5,000 in Kharif & Rabi). Death benefit of ₹2 Lakh.', eligibilityCriteria: 'All farmers with RoR.', applicationLink: 'https://krishakbandhu.net' },
    { name: 'Bangla Shasya Bima', description: 'Crop insurance scheme fully funded by the state government.', eligibilityCriteria: 'Farmers growing notified crops in notified areas.', applicationLink: 'https://banglashasyabima.net' },
    { name: 'Matir Katha', description: 'Advisory services and soil health cards for farmers.', eligibilityCriteria: 'Open to all.', applicationLink: 'https://matirkatha.net' },
    { name: 'Kisan Credit Card (KCC)', description: 'Credit at subsidized interest rates.', eligibilityCriteria: 'Farmers, Tenant Farmers, Share Croppers.', applicationLink: 'https://sbi.co.in/web/agri-rural/agriculture-banking/crop-loan/kisan-credit-card' },
    { name: 'Paramparagat Krishi Vikas Yojana', description: 'Promotion of commercial organic farming.', eligibilityCriteria: 'Cluster based (20 hectares).', applicationLink: 'https://pgsindia-ncof.gov.in' }
  ];
  for (const s of schemes) {
    const exists = await prisma.governmentScheme.findFirst({ where: { name: s.name } });
    if (!exists) await prisma.governmentScheme.create({ data: s });
  }
  console.log('Schemes seeded.');

  // 5. District Crop Data (The Core)
  console.log('Seeding District Crop Data...');
  const districtData = [
    { district: 'Darjeeling', pincode: '734101', crop: 'Tea', season: 'Perennial', soil: 'Acidic Loam', minTemp: 8, maxTemp: 20 },
    { district: 'Darjeeling', pincode: '734214', crop: 'Orange', season: 'Winter', soil: 'Acidic Loam', minTemp: 10, maxTemp: 22 },
    { district: 'Darjeeling', pincode: '734001', crop: 'Pineapple', season: 'Monsoon', soil: 'Terai Soil', minTemp: 18, maxTemp: 32 },
    { district: 'Jalpaiguri', pincode: '735210', crop: 'Arecanut', season: 'Perennial', soil: 'Alluvial (Terai)', minTemp: 15, maxTemp: 30 },
    { district: 'Jalpaiguri', pincode: '735224', crop: 'Tea', season: 'Perennial', soil: 'Alluvial (Terai)', minTemp: 15, maxTemp: 32 },
    { district: 'Cooch Behar', pincode: '736135', crop: 'Tobacco', season: 'Winter (Rabi)', soil: 'Sandy Loam', minTemp: 12, maxTemp: 26 },
    { district: 'Cooch Behar', pincode: '736167', crop: 'Jute', season: 'Monsoon', soil: 'Sandy Loam', minTemp: 25, maxTemp: 35 },
    { district: 'Uttar Dinajpur', pincode: '733202', crop: 'Pineapple', season: 'Monsoon', soil: 'Acidic Alluvial', minTemp: 18, maxTemp: 32 },
    { district: 'Malda', pincode: '732101', crop: 'Mango (Fazli)', season: 'Summer', soil: 'Gangetic Alluvial', minTemp: 25, maxTemp: 38 },
    { district: 'Malda', pincode: '732201', crop: 'Silk (Mulberry)', season: 'Perennial', soil: 'Gangetic Loam', minTemp: 20, maxTemp: 35 },
    { district: 'Murshidabad', pincode: '742149', crop: 'Litchi', season: 'Summer', soil: 'Gangetic Loam', minTemp: 24, maxTemp: 36 },
    { district: 'Murshidabad', pincode: '742303', crop: 'Wheat', season: 'Winter (Rabi)', soil: 'Clay Loam', minTemp: 14, maxTemp: 28 },
    { district: 'Nadia', pincode: '741101', crop: 'Brinjal', season: 'Year-Round', soil: 'Alluvial', minTemp: 20, maxTemp: 35 },
    { district: 'Nadia', pincode: '741235', crop: 'Cauliflower', season: 'Winter', soil: 'Sandy Loam', minTemp: 12, maxTemp: 25 },
    { district: 'Nadia', pincode: '741160', crop: 'Chilli (Green)', season: 'Winter', soil: 'Sandy Loam', minTemp: 15, maxTemp: 30 },
    { district: 'North 24 Pgs', pincode: '700124', crop: 'Vegetables', season: 'Winter', soil: 'Alluvial', minTemp: 15, maxTemp: 28 },
    { district: 'North 24 Pgs', pincode: '743411', crop: 'Potato', season: 'Winter (Rabi)', soil: 'Loamy', minTemp: 14, maxTemp: 25 },
    { district: 'South 24 Pgs', pincode: '700144', crop: 'Guava', season: 'Year-Round', soil: 'Alluvial', minTemp: 22, maxTemp: 34 },
    { district: 'South 24 Pgs', pincode: '743329', crop: 'Chilli (Red)', season: 'Winter', soil: 'Coastal Saline', minTemp: 18, maxTemp: 30 },
    { district: 'South 24 Pgs', pincode: '743370', crop: 'Rice (Hamilton)', season: 'Monsoon', soil: 'Coastal Saline', minTemp: 25, maxTemp: 35 },
    { district: 'Howrah', pincode: '711303', crop: 'Flowers (Marigold)', season: 'Winter', soil: 'Clay Loam', minTemp: 15, maxTemp: 28 },
    { district: 'Hooghly', pincode: '712601', crop: 'Potato', season: 'Winter (Rabi)', soil: 'Sandy Loam', minTemp: 12, maxTemp: 26 },
    { district: 'Hooghly', pincode: '712149', crop: 'Rice (Aman)', season: 'Monsoon', soil: 'Clay Loam', minTemp: 25, maxTemp: 35 },
    { district: 'Hooghly', pincode: '712501', crop: 'Jute', season: 'Monsoon', soil: 'Loamy', minTemp: 26, maxTemp: 36 },
    { district: 'Purba Bardhaman', pincode: '713409', crop: 'Rice (Boro)', season: 'Summer', soil: 'Clay Loam', minTemp: 20, maxTemp: 34 },
    { district: 'Purba Bardhaman', pincode: '713130', crop: 'Mustard', season: 'Winter (Rabi)', soil: 'Loamy', minTemp: 15, maxTemp: 27 },
    { district: 'Purba Bardhaman', pincode: '713424', crop: 'Rice (Scented)', season: 'Monsoon', soil: 'Clay', minTemp: 26, maxTemp: 35 },
    { district: 'Birbhum', pincode: '731204', crop: 'Rice (Aman)', season: 'Monsoon', soil: 'Lateritic Loam', minTemp: 26, maxTemp: 36 },
    { district: 'Birbhum', pincode: '731224', crop: 'Wheat', season: 'Winter (Rabi)', soil: 'Loam', minTemp: 15, maxTemp: 28 },
    { district: 'Bankura', pincode: '722122', crop: 'Potato', season: 'Winter (Rabi)', soil: 'Red Sandy Loam', minTemp: 14, maxTemp: 28 },
    { district: 'Bankura', pincode: '722132', crop: 'Maize', season: 'Monsoon', soil: 'Red Soil', minTemp: 26, maxTemp: 38 },
    { district: 'Purulia', pincode: '723202', crop: 'Lac (Resin)', season: 'Winter', soil: 'Red Laterite', minTemp: 10, maxTemp: 26 },
    { district: 'Purulia', pincode: '723152', crop: 'Millet', season: 'Monsoon', soil: 'Red Laterite', minTemp: 28, maxTemp: 40 },
    { district: 'Paschim Medinipur', pincode: '721212', crop: 'Flowers', season: 'Winter', soil: 'Clay Loam', minTemp: 16, maxTemp: 28 },
    { district: 'Paschim Medinipur', pincode: '721301', crop: 'Cashew', season: 'Perennial', soil: 'Red Laterite', minTemp: 20, maxTemp: 38 },
    { district: 'Purba Medinipur', pincode: '721401', crop: 'Coconut', season: 'Perennial', soil: 'Coastal Alluvial', minTemp: 22, maxTemp: 34 },
    { district: 'Purba Medinipur', pincode: '721602', crop: 'Betel Vine', season: 'Perennial', soil: 'Coastal Loam', minTemp: 20, maxTemp: 32 },
    { district: 'Kalimpong', pincode: '734301', crop: 'Ginger', season: 'Monsoon', soil: 'Acidic Loam', minTemp: 15, maxTemp: 28 },
    { district: 'Kalimpong', pincode: '734316', crop: 'Cardamom (Large)', season: 'Perennial', soil: 'Forest Loam', minTemp: 12, maxTemp: 25 },
    { district: 'Kalimpong', pincode: '735231', crop: 'Maize', season: 'Monsoon', soil: 'Mountain Loam', minTemp: 18, maxTemp: 30 },
    { district: 'Alipurduar', pincode: '736121', crop: 'Tea', season: 'Perennial', soil: 'Terai Alluvial', minTemp: 18, maxTemp: 32 },
    { district: 'Alipurduar', pincode: '735211', crop: 'Arecanut', season: 'Perennial', soil: 'Alluvial', minTemp: 16, maxTemp: 32 },
    { district: 'Alipurduar', pincode: '736203', crop: 'Rice (Aman)', season: 'Monsoon', soil: 'Sandy Loam', minTemp: 24, maxTemp: 34 },
    { district: 'Dakshin Dinajpur', pincode: '733101', crop: 'Jute', season: 'Monsoon', soil: 'Old Alluvial (Barind)', minTemp: 25, maxTemp: 36 },
    { district: 'Dakshin Dinajpur', pincode: '733124', crop: 'Mustard', season: 'Winter (Rabi)', soil: 'Loamy', minTemp: 14, maxTemp: 28 },
    { district: 'Dakshin Dinajpur', pincode: '733132', crop: 'Wheat', season: 'Winter (Rabi)', soil: 'Sandy Loam', minTemp: 13, maxTemp: 27 },
    { district: 'Jhargram', pincode: '721507', crop: 'Cashew', season: 'Perennial', soil: 'Red Laterite', minTemp: 20, maxTemp: 40 },
    { district: 'Jhargram', pincode: '721502', crop: 'Rice (Drought tolerant)', season: 'Monsoon', soil: 'Red Soil', minTemp: 26, maxTemp: 39 },
  ];

  const uniqueDistricts = [...new Set(districtData.map(d => d.district))];

  // Create Weather Data for ALL Districts
  const weatherData = uniqueDistricts.map(district => {
    // Simple logic to vary weather slightly based on region names
    let temp = 25;
    let humidity = 60;
    let forecast = 'Clear Sky';

    if (['Darjeeling', 'Kalimpong'].includes(district)) {
      temp = 12;
      humidity = 85;
      forecast = 'Misty/Foggy';
    } else if (['Purulia', 'Bankura', 'Jhargram'].includes(district)) {
      temp = 30;
      humidity = 40;
      forecast = 'Sunny & Dry';
    } else if (['South 24 Pgs', 'Purba Medinipur', 'Howrah'].includes(district)) {
      temp = 28;
      humidity = 78;
      forecast = 'Humid';
    }

    return {
      location: district,
      temperature: temp,
      humidity: humidity,
      windSpeed: Math.floor(Math.random() * 10) + 5,
      rainfall: 0,
      forecast: forecast
    };
  });
  await prisma.weatherData.createMany({ data: weatherData });
  console.log('Weather Data seeded for all districts.');

  // Process District Crops
  for (const entry of districtData) {
    const season = await prisma.season.upsert({ where: { name: entry.season }, update: {}, create: { name: entry.season } });
    const soil = await prisma.soilType.upsert({ where: { name: entry.soil }, update: {}, create: { name: entry.soil } });
    
    let crop = await prisma.crop.findFirst({ where: { name: entry.crop } });
    if (!crop) {
      crop = await prisma.crop.create({ data: { name: entry.crop, description: `Major crop in ${entry.district} region` } });
    }

    await prisma.districtCrop.upsert({
      where: { district_cropId_seasonId: { district: entry.district, cropId: crop.id, seasonId: season.id } },
      update: { pinCode: entry.pincode, soilTypeId: soil.id, minTemp: entry.minTemp, maxTemp: entry.maxTemp },
      create: { district: entry.district, pinCode: entry.pincode, cropId: crop.id, seasonId: season.id, soilTypeId: soil.id, minTemp: entry.minTemp, maxTemp: entry.maxTemp }
    });
  }

  // 6. Market Prices (Enriched)
  const marketPrices = [
    { crop: 'Potato', market: 'Sufal Bangla (Kolkata)', price: 1800, district: 'Kolkata' },
    { crop: 'Potato', market: 'Champadanga Mandi', price: 1650, district: 'Hooghly' },
    { crop: 'Rice (Aman)', market: 'Burdwan Mandi', price: 2100, district: 'Purba Bardhaman' },
    { crop: 'Rice (Aman)', market: 'Memari Mandi', price: 2150, district: 'Purba Bardhaman' },
    { crop: 'Jute', market: 'Karimpur Market', price: 5200, district: 'Nadia' },
    { crop: 'Jute', market: 'Bethuadahari', price: 5100, district: 'Nadia' },
    { crop: 'Pineapple', market: 'Isline Market', price: 3000, district: 'Uttar Dinajpur' },
    { crop: 'Tea', market: 'Siliguri Auction Centre', price: 25000, district: 'Darjeeling' },
    { crop: 'Onion', market: 'Sufal Bangla (Kolkata)', price: 4500, district: 'Kolkata' }, // Generic crop needed maybe
    { crop: 'Mango (Fazli)', market: 'English Bazar', price: 4000, district: 'Malda' }
  ];

  for (const mp of marketPrices) {
    const c = await prisma.crop.findFirst({ where: { name: mp.crop } });
    if (c) {
      await prisma.marketPrice.create({
         data: { cropId: c.id, marketName: mp.market, price: mp.price, state: 'West Bengal', district: mp.district }
      });
    }
  }
  console.log('Market Prices seeded.');

  // 7. Contextual Advisories & Users
  // Create a Demo User to link history
  const demoUser = await prisma.user.upsert({
    where: { email: 'demo@agriculture.com' },
    update: {},
    create: {
      email: 'demo@agriculture.com',
      name: 'Farmer Sagar',
    }
  });
  console.log('Demo User seeded:', demoUser.email);

  const advisories = [
    { crop: 'Potato', district: 'Hooghly', msg: 'High risk of Late Blight due to foggy weather. Spray Mancozeb @ 2.5g/lit.', stage: 'Vegetative', status: 'active' },
    { crop: 'Rice (Aman)', district: 'Purba Bardhaman', msg: 'Harvesting stage. Ensure grain moisture is below 14% before storage.', stage: 'Harvesting', status: 'active' },
    { crop: 'Tea', district: 'Darjeeling', msg: 'Pruning operations should be completed by end of January.', stage: 'Dormancy', status: 'active' },
    { crop: 'Mustard', district: 'Nadia', msg: 'Check for aphid attack. If crossing ETL, spray Thiamethoxam.', stage: 'Flowering', status: 'active' },
    { crop: 'Mango (Fazli)', district: 'Malda', msg: 'Apply Paclobutrazol in soil for better flowering next season.', stage: 'Post-Harvest', status: 'completed' }
  ];

  for (const adv of advisories) {
    const c = await prisma.crop.findFirst({ where: { name: adv.crop } });
    if (c) {
      await prisma.cropAdvisory.create({
        data: { 
          cropId: c.id, 
          location: adv.district, 
          stage: adv.stage, 
          status: adv.status, 
          message: adv.msg, 
          date: new Date(),
          userId: demoUser.id // Link to demo user
        }
      });
    }
  }

  // 8. Tasks for Users
  await prisma.task.createMany({
    data: [
      { category: 'Sowing', task: 'Buy certified Potato seeds (Kufri Jyoti)', dueDate: new Date() },
      { category: 'Irrigation', task: 'Schedule irrigation for Wheat crop' },
      { category: 'Fertilizer', task: 'Apply Urea top dressing for Boro Rice' },
      { category: 'General', task: 'Renew KCC Loan at local bank' },
      { category: 'Marketing', task: 'Check latest Jute prices in e-NAM' }
    ].map(t => ({ ...t, dueDate: t.dueDate || new Date(), completed: false }))
  });

  console.log('Seeding Completed Successfully.');
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
