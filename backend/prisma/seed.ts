/// <reference types="node" />
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌾 Initializing 50-Crop AI Model Database Synchronization (Ultra-Fast Batch Mode)...');

  // 1. Clean Purge: Delete legacy records to ensure exact 1:1 match with the 50-Crop AI Model
  console.log('🧹 Purging legacy seed data...');
  try {
    await prisma.districtCrop.deleteMany({});
    await prisma.cropSuitability.deleteMany({});
    await prisma.marketPrice.deleteMany({});
    await prisma.cropAdvisory.deleteMany({});
    await prisma.soilData.deleteMany({});
    await prisma.weatherData.deleteMany({});
    await prisma.task.deleteMany({});
    await prisma.crop.deleteMany({});
    await prisma.soilType.deleteMany({});
    await prisma.season.deleteMany({});
    await prisma.governmentScheme.deleteMany({});
    console.log('✅ Legacy tables purged cleanly.');
  } catch (err: any) {
    console.warn('⚠️ Notice during purge (non-fatal):', err.message);
  }

  // 2. Primary Key Sequence Reset
  const tableNames = [
    'Crop', 'SoilType', 'Season', 'CropSuitability',
    'MarketPrice', 'GovernmentScheme', 'SoilData',
    'WeatherData', 'Task', 'CropAdvisory', 'DistrictCrop'
  ];
  for (const tableName of tableNames) {
    try {
      await prisma.$executeRawUnsafe(
        `SELECT setval(pg_get_serial_sequence('"${tableName}"', 'id'), 1, false);`
      );
    } catch {
      // Ignore if table doesn't use standard serial sequence
    }
  }

  // 3. Soil Types (7 Exact Model Archetypes + 7 Friendly Aliases)
  console.log('🌱 Seeding Soil Types matching AI Model Memory...');
  const soilTypeDefinitions = [
    {
      name: 'Alluvial plains (proxy)',
      description: 'Deep fertile soils deposited by Indo-Gangetic and coastal river networks with balanced moisture retention.',
      characteristics: 'High agricultural fertility, neutral to slightly alkaline pH, ideal for cereals, sugarcane, potato, and pulses.'
    },
    {
      name: 'Arid/desert soil (proxy)',
      description: 'Sandy, highly permeable soil prevalent in Rajasthan, North Gujarat, and semi-arid tracts.',
      characteristics: 'Low organic carbon, rapid drainage, well-suited for drought-hardy millets (Bajra, Jowar), cluster bean, and moth.'
    },
    {
      name: 'Black cotton/regur (proxy)',
      description: 'Clayey, moisture-retentive volcanic Deccan trap soil rich in calcium, iron, and magnesium.',
      characteristics: 'Self-ploughing fissures in dry season, exceptional water-holding capacity, premier soil for cotton, soybean, and pulses.'
    },
    {
      name: 'Coastal/lateritic mix (proxy)',
      description: 'Weathered acidic soil along the Western & Eastern Ghats and coastal peninsular belts.',
      characteristics: 'Porous, rich in iron/aluminum sesquioxides, optimal for plantation crops (arecanut, cashew, coconut, rubber) and spices.'
    },
    {
      name: 'Deltaic/alluvial (proxy)',
      description: 'Heavy, nutrient-rich alluvial clay and silt found in lower river basins and coastal deltas.',
      characteristics: 'High water table, excellent water retention, ideal for wetland paddy (Dhan) and commercial jute.'
    },
    {
      name: 'Mountain/forest soil (proxy)',
      description: 'Humus-rich acidic loamy soil found in sub-Himalayan, Northeast, and Nilgiri hill tracts.',
      characteristics: 'High organic carbon content, steep sloping natural drainage, optimal for tea, cardamom, ginger, and temperate fruits.'
    },
    {
      name: 'Red/red-yellow soil (proxy)',
      description: 'Warm, iron-rich permeable soil developed on crystalline granite-gneiss parent rock.',
      characteristics: 'Moderate fertility, responds strongly to balanced NPK and irrigation, ideal for groundnut, pulses, maize, and ragi.'
    },
    // Friendly Aliases for User Convenience
    { name: 'Alluvial', description: 'Alluvial soil plains', characteristics: 'Gangetic and coastal plains fertility' },
    { name: 'Arid / Desert', description: 'Arid sandy desert soil', characteristics: 'Drought-tolerant millet soil' },
    { name: 'Black Cotton / Regur', description: 'Black cotton soil', characteristics: 'High moisture retention for cotton and oilseeds' },
    { name: 'Coastal / Laterite', description: 'Coastal laterite soil', characteristics: 'Ideal for plantation and spices' },
    { name: 'Deltaic Alluvial', description: 'Deltaic silt and clay', characteristics: 'High water retention for wetland paddy and jute' },
    { name: 'Mountain / Forest', description: 'Mountain and hill forest soil', characteristics: 'Rich humus for tea, ginger, and cardamom' },
    { name: 'Red / Red-Yellow', description: 'Red and yellow crystalline soil', characteristics: 'Good drainage for groundnut, maize, pulses' }
  ];

  await prisma.soilType.createMany({ data: soilTypeDefinitions, skipDuplicates: true });
  const allSoils = await prisma.soilType.findMany({ select: { id: true, name: true } });
  const soilMap = new Map<string, number>(allSoils.map(s => [s.name, s.id]));
  console.log(`✅ ${soilMap.size} Soil Types seeded.`);

  // 4. Seasons (6 Exact Model Seasons + 3 Common Aliases)
  console.log('☀️ Seeding Seasons matching AI Model Memory...');
  const seasonDefinitions = [
    { name: 'Kharif', months: 'June - October (Monsoon season)' },
    { name: 'Rabi', months: 'October - March (Winter crop season)' },
    { name: 'Summer', months: 'March - June (Zaid / Pre-monsoon)' },
    { name: 'Whole Year', months: 'Year-Round / Perennial agricultural cycle' },
    { name: 'Autumn', months: 'September - October (Post-monsoon transition)' },
    { name: 'Winter', months: 'November - February (Core cold season)' },
    // Aliases
    { name: 'Zaid', months: 'March - June (Summer season alias)' },
    { name: 'Monsoon', months: 'June - September (Kharif monsoon alias)' },
    { name: 'Perennial', months: 'Year-Round plantation alias' }
  ];

  await prisma.season.createMany({ data: seasonDefinitions, skipDuplicates: true });
  const allSeasons = await prisma.season.findMany({ select: { id: true, name: true } });
  const seasonMap = new Map<string, number>(allSeasons.map(s => [s.name, s.id]));
  console.log(`✅ ${seasonMap.size} Seasons seeded.`);

  // 5. 50 Crops: Exact 1:1 with AI Model Memory
  console.log('🌾 Seeding all 50 Crops with authentic agricultural metadata...');
  const rawCrops = [
    {
      name: 'Arecanut',
      scientificName: 'Areca catechu',
      duration: 'Perennial (palm, 25-30 years)',
      waterRequirement: 'High',
      description: 'Betel Nut / Supari (Arecanut). Category: Commercial Plantation. National Benchmark Yield: 1.19 Tonnes/ha. Growth duration: Perennial (palm, 25-30 years). Water requirement: High. Widely cultivated across India under recommended agronomic packages.',
      imageUrl: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=800',
      soils: ["Coastal/lateritic mix (proxy)", "Mountain/forest soil (proxy)", "Red/red-yellow soil (proxy)"],
      seasons: ["Whole Year"],
      benchmarkPrice: 45000,
      mandi: 'Mangalore APMC, Karnataka'
    },
    {
      name: 'Arhar/Tur',
      scientificName: 'Cajanus cajan',
      duration: '150-180 days',
      waterRequirement: 'Low',
      description: 'Toor Dal / Arhar (Pigeon Pea). Category: Pulse. National Benchmark Yield: 0.73 Tonnes/ha. Growth duration: 150-180 days. Water requirement: Low. Widely cultivated across India under recommended agronomic packages.',
      imageUrl: 'https://images.unsplash.com/photo-1515543237350-b3eea1ec8082?w=800',
      soils: ["Black cotton/regur (proxy)", "Red/red-yellow soil (proxy)", "Alluvial plains (proxy)"],
      seasons: ["Kharif", "Whole Year"],
      benchmarkPrice: 7550,
      mandi: 'Gulbarga APMC, Karnataka'
    },
    {
      name: 'Bajra',
      scientificName: 'Pennisetum glaucum',
      duration: '80-90 days',
      waterRequirement: 'Low',
      description: 'Pearl Millet / Bajra. Category: Cereal. National Benchmark Yield: 1.03 Tonnes/ha. Growth duration: 80-90 days. Water requirement: Low. Widely cultivated across India under recommended agronomic packages.',
      imageUrl: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=800',
      soils: ["Arid/desert soil (proxy)", "Red/red-yellow soil (proxy)", "Alluvial plains (proxy)"],
      seasons: ["Kharif", "Summer"],
      benchmarkPrice: 2500,
      mandi: 'Jaipur Mandi, Rajasthan'
    },
    {
      name: 'Banana',
      scientificName: 'Musa acuminata',
      duration: '300-365 days',
      waterRequirement: 'High',
      description: 'Banana (Kela). Category: Horticulture Fruit. National Benchmark Yield: 21.92 Tonnes/ha. Growth duration: 300-365 days. Water requirement: High. Widely cultivated across India under recommended agronomic packages.',
      imageUrl: 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=800',
      soils: ["Alluvial plains (proxy)", "Red/red-yellow soil (proxy)", "Black cotton/regur (proxy)"],
      seasons: ["Whole Year", "Kharif"],
      benchmarkPrice: 2200,
      mandi: 'Jalgaon APMC, Maharashtra'
    },
    {
      name: 'Barley',
      scientificName: 'Hordeum vulgare',
      duration: '115-130 days',
      waterRequirement: 'Low',
      description: 'Barley / Jau. Category: Cereal. National Benchmark Yield: 1.68 Tonnes/ha. Growth duration: 115-130 days. Water requirement: Low. Widely cultivated across India under recommended agronomic packages.',
      imageUrl: 'https://images.unsplash.com/photo-1508873696983-2df5293cb395?w=800',
      soils: ["Alluvial plains (proxy)", "Black cotton/regur (proxy)"],
      seasons: ["Rabi", "Winter"],
      benchmarkPrice: 1850,
      mandi: 'Hisar Grain Market, Haryana'
    },
    {
      name: 'Black pepper',
      scientificName: 'Piper nigrum',
      duration: 'Perennial (vine, 15-20 years)',
      waterRequirement: 'High',
      description: 'Black Pepper / Kali Mirch. Category: Spice. National Benchmark Yield: 0.62 Tonnes/ha. Growth duration: Perennial (vine, 15-20 years). Water requirement: High. Widely cultivated across India under recommended agronomic packages.',
      imageUrl: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=800',
      soils: ["Coastal/lateritic mix (proxy)", "Mountain/forest soil (proxy)"],
      seasons: ["Whole Year"],
      benchmarkPrice: 58000,
      mandi: 'Kochi Spices Board, Kerala'
    },
    {
      name: 'Cardamom',
      scientificName: 'Elettaria cardamomum',
      duration: 'Perennial (herbaceous)',
      waterRequirement: 'High',
      description: 'Cardamom / Elaichi. Category: Spice. National Benchmark Yield: 0.08 Tonnes/ha. Growth duration: Perennial (herbaceous). Water requirement: High. Widely cultivated across India under recommended agronomic packages.',
      imageUrl: 'https://images.unsplash.com/photo-1629814249584-bd4d53cf0e7d?w=800',
      soils: ["Mountain/forest soil (proxy)", "Coastal/lateritic mix (proxy)"],
      seasons: ["Whole Year"],
      benchmarkPrice: 195000,
      mandi: 'Bodinayakanur APMC, Tamil Nadu'
    },
    {
      name: 'Cashewnut',
      scientificName: 'Anacardium occidentale',
      duration: 'Perennial (tree, 25-30 years)',
      waterRequirement: 'Low',
      description: 'Cashew Nut / Kaju. Category: Commercial Plantation. National Benchmark Yield: 0.4 Tonnes/ha. Growth duration: Perennial (tree, 25-30 years). Water requirement: Low. Widely cultivated across India under recommended agronomic packages.',
      imageUrl: 'https://images.unsplash.com/photo-1509358271058-acd22cc93898?w=800',
      soils: ["Coastal/lateritic mix (proxy)", "Red/red-yellow soil (proxy)"],
      seasons: ["Whole Year"],
      benchmarkPrice: 12500,
      mandi: 'Kollam Cashew Exchange, Kerala'
    },
    {
      name: 'Castor seed',
      scientificName: 'Ricinus communis',
      duration: '140-180 days',
      waterRequirement: 'Low',
      description: 'Castor / Arandi. Category: Oilseed. National Benchmark Yield: 0.5 Tonnes/ha. Growth duration: 140-180 days. Water requirement: Low. Widely cultivated across India under recommended agronomic packages.',
      imageUrl: 'https://images.unsplash.com/photo-1471193945509-9ad0617afabf?w=800',
      soils: ["Arid/desert soil (proxy)", "Red/red-yellow soil (proxy)", "Alluvial plains (proxy)"],
      seasons: ["Kharif", "Whole Year"],
      benchmarkPrice: 5850,
      mandi: 'Deesa APMC, Gujarat'
    },
    {
      name: 'Coriander',
      scientificName: 'Coriandrum sativum',
      duration: '90-110 days',
      waterRequirement: 'Medium',
      description: 'Coriander / Dhania. Category: Spice. National Benchmark Yield: 0.48 Tonnes/ha. Growth duration: 90-110 days. Water requirement: Medium. Widely cultivated across India under recommended agronomic packages.',
      imageUrl: 'https://images.unsplash.com/photo-1588879460618-9249e7d947d1?w=800',
      soils: ["Black cotton/regur (proxy)", "Alluvial plains (proxy)", "Red/red-yellow soil (proxy)"],
      seasons: ["Rabi", "Winter"],
      benchmarkPrice: 7600,
      mandi: 'Kota Mandi, Rajasthan'
    },
    {
      name: 'Cotton(lint)',
      scientificName: 'Gossypium hirsutum',
      duration: '150-180 days',
      waterRequirement: 'Medium',
      description: 'Cotton / Kapas (Lint). Category: Fiber. National Benchmark Yield: 1.37 Tonnes/ha. Growth duration: 150-180 days. Water requirement: Medium. Widely cultivated across India under recommended agronomic packages.',
      imageUrl: 'https://images.unsplash.com/photo-1606041008023-472dfb5e530f?w=800',
      soils: ["Black cotton/regur (proxy)", "Alluvial plains (proxy)", "Red/red-yellow soil (proxy)"],
      seasons: ["Kharif", "Whole Year"],
      benchmarkPrice: 7020,
      mandi: 'Rajkot Cotton Yard, Gujarat'
    },
    {
      name: 'Cowpea(Lobia)',
      scientificName: 'Vigna unguiculata',
      duration: '70-90 days',
      waterRequirement: 'Low',
      description: 'Cowpea / Lobia (Chawli). Category: Pulse. National Benchmark Yield: 0.37 Tonnes/ha. Growth duration: 70-90 days. Water requirement: Low. Widely cultivated across India under recommended agronomic packages.',
      imageUrl: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800',
      soils: ["Alluvial plains (proxy)", "Red/red-yellow soil (proxy)", "Black cotton/regur (proxy)"],
      seasons: ["Kharif", "Summer"],
      benchmarkPrice: 6200,
      mandi: 'Nagpur APMC, Maharashtra'
    },
    {
      name: 'Dry chillies',
      scientificName: 'Capsicum annuum',
      duration: '150-180 days',
      waterRequirement: 'Medium',
      description: 'Dry Red Chilli / Lal Mirch. Category: Spice. National Benchmark Yield: 0.92 Tonnes/ha. Growth duration: 150-180 days. Water requirement: Medium. Widely cultivated across India under recommended agronomic packages.',
      imageUrl: 'https://images.unsplash.com/photo-1588252303782-cb80119abd6d?w=800',
      soils: ["Black cotton/regur (proxy)", "Red/red-yellow soil (proxy)", "Alluvial plains (proxy)"],
      seasons: ["Whole Year", "Kharif", "Rabi"],
      benchmarkPrice: 18500,
      mandi: 'Guntur Mirchi Yard, Andhra Pradesh'
    },
    {
      name: 'Dry ginger',
      scientificName: 'Zingiber officinale',
      duration: '210-240 days',
      waterRequirement: 'High',
      description: 'Dry Ginger / Sonth. Category: Spice. National Benchmark Yield: 2.46 Tonnes/ha. Growth duration: 210-240 days. Water requirement: High. Widely cultivated across India under recommended agronomic packages.',
      imageUrl: 'https://images.unsplash.com/photo-1615485500704-8e990f9900f7?w=800',
      soils: ["Mountain/forest soil (proxy)", "Coastal/lateritic mix (proxy)", "Red/red-yellow soil (proxy)"],
      seasons: ["Kharif", "Whole Year"],
      benchmarkPrice: 28000,
      mandi: 'Wayanad APMC, Kerala'
    },
    {
      name: 'Garlic',
      scientificName: 'Allium sativum',
      duration: '120-150 days',
      waterRequirement: 'Medium',
      description: 'Garlic / Lahsun. Category: Spice. National Benchmark Yield: 2.88 Tonnes/ha. Growth duration: 120-150 days. Water requirement: Medium. Widely cultivated across India under recommended agronomic packages.',
      imageUrl: 'https://images.unsplash.com/photo-1540148426945-6cf22a6b2383?w=800',
      soils: ["Alluvial plains (proxy)", "Black cotton/regur (proxy)", "Red/red-yellow soil (proxy)"],
      seasons: ["Rabi", "Winter"],
      benchmarkPrice: 11500,
      mandi: 'Mandsaur Mandi, Madhya Pradesh'
    },
    {
      name: 'Gram',
      scientificName: 'Cicer arietinum',
      duration: '100-115 days',
      waterRequirement: 'Low',
      description: 'Chickpea / Chana (Gram). Category: Pulse. National Benchmark Yield: 0.8 Tonnes/ha. Growth duration: 100-115 days. Water requirement: Low. Widely cultivated across India under recommended agronomic packages.',
      imageUrl: 'https://images.unsplash.com/photo-1515543237350-b3eea1ec8082?w=800',
      soils: ["Alluvial plains (proxy)", "Black cotton/regur (proxy)", "Red/red-yellow soil (proxy)"],
      seasons: ["Rabi", "Whole Year"],
      benchmarkPrice: 5450,
      mandi: 'Indore APMC, Madhya Pradesh'
    },
    {
      name: 'Groundnut',
      scientificName: 'Arachis hypogaea',
      duration: '105-125 days',
      waterRequirement: 'Medium',
      description: 'Groundnut / Peanut (Moongphali). Category: Oilseed. National Benchmark Yield: 1.04 Tonnes/ha. Growth duration: 105-125 days. Water requirement: Medium. Widely cultivated across India under recommended agronomic packages.',
      imageUrl: 'https://images.unsplash.com/photo-1567894340315-735d7c361db0?w=800',
      soils: ["Red/red-yellow soil (proxy)", "Black cotton/regur (proxy)", "Alluvial plains (proxy)"],
      seasons: ["Kharif", "Summer", "Rabi"],
      benchmarkPrice: 6377,
      mandi: 'Junagadh APMC, Gujarat'
    },
    {
      name: 'Guar seed',
      scientificName: 'Cyamopsis tetragonoloba',
      duration: '90-110 days',
      waterRequirement: 'Low',
      description: 'Cluster Bean / Guar. Category: Other Field Crop. National Benchmark Yield: 0.81 Tonnes/ha. Growth duration: 90-110 days. Water requirement: Low. Widely cultivated across India under recommended agronomic packages.',
      imageUrl: 'https://images.unsplash.com/photo-1599420186946-7b6fb4e297f0?w=800',
      soils: ["Arid/desert soil (proxy)", "Alluvial plains (proxy)"],
      seasons: ["Kharif", "Whole Year"],
      benchmarkPrice: 5400,
      mandi: 'Jodhpur Mandi, Rajasthan'
    },
    {
      name: 'Horse-gram',
      scientificName: 'Macrotyloma uniflorum',
      duration: '110-120 days',
      waterRequirement: 'Low',
      description: 'Horse Gram / Kulthi Dal. Category: Pulse. National Benchmark Yield: 0.4 Tonnes/ha. Growth duration: 110-120 days. Water requirement: Low. Widely cultivated across India under recommended agronomic packages.',
      imageUrl: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800',
      soils: ["Red/red-yellow soil (proxy)", "Black cotton/regur (proxy)"],
      seasons: ["Kharif", "Rabi", "Winter"],
      benchmarkPrice: 4900,
      mandi: 'Bellary APMC, Karnataka'
    },
    {
      name: 'Jowar',
      scientificName: 'Sorghum bicolor',
      duration: '100-115 days',
      waterRequirement: 'Low',
      description: 'Sorghum / Jowar. Category: Cereal. National Benchmark Yield: 0.96 Tonnes/ha. Growth duration: 100-115 days. Water requirement: Low. Widely cultivated across India under recommended agronomic packages.',
      imageUrl: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=800',
      soils: ["Black cotton/regur (proxy)", "Red/red-yellow soil (proxy)", "Alluvial plains (proxy)"],
      seasons: ["Kharif", "Rabi"],
      benchmarkPrice: 3180,
      mandi: 'Solapur APMC, Maharashtra'
    },
    {
      name: 'Jute',
      scientificName: 'Corchorus olitorius',
      duration: '120-150 days',
      waterRequirement: 'High',
      description: 'Jute / Patson. Category: Fiber. National Benchmark Yield: 9.3 Tonnes/ha. Growth duration: 120-150 days. Water requirement: High. Widely cultivated across India under recommended agronomic packages.',
      imageUrl: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800',
      soils: ["Alluvial plains (proxy)", "Deltaic/alluvial (proxy)"],
      seasons: ["Kharif", "Autumn"],
      benchmarkPrice: 5050,
      mandi: 'Nadia APMC, West Bengal'
    },
    {
      name: 'Khesari',
      scientificName: 'Lathyrus sativus',
      duration: '110-125 days',
      waterRequirement: 'Low',
      description: 'Grass Pea / Khesari Dal. Category: Pulse. National Benchmark Yield: 0.77 Tonnes/ha. Growth duration: 110-125 days. Water requirement: Low. Widely cultivated across India under recommended agronomic packages.',
      imageUrl: 'https://images.unsplash.com/photo-1515543237350-b3eea1ec8082?w=800',
      soils: ["Alluvial plains (proxy)", "Deltaic/alluvial (proxy)", "Red/red-yellow soil (proxy)"],
      seasons: ["Rabi", "Whole Year"],
      benchmarkPrice: 4600,
      mandi: 'Patna APMC, Bihar'
    },
    {
      name: 'Linseed',
      scientificName: 'Linum usitatissimum',
      duration: '120-140 days',
      waterRequirement: 'Low',
      description: 'Flaxseed / Alsi (Linseed). Category: Oilseed. National Benchmark Yield: 0.46 Tonnes/ha. Growth duration: 120-140 days. Water requirement: Low. Widely cultivated across India under recommended agronomic packages.',
      imageUrl: 'https://images.unsplash.com/photo-1508873696983-2df5293cb395?w=800',
      soils: ["Alluvial plains (proxy)", "Black cotton/regur (proxy)"],
      seasons: ["Rabi", "Whole Year"],
      benchmarkPrice: 5300,
      mandi: 'Rewa Mandi, Madhya Pradesh'
    },
    {
      name: 'Maize',
      scientificName: 'Zea mays',
      duration: '90-110 days',
      waterRequirement: 'Medium',
      description: 'Maize / Corn (Makka). Category: Cereal. National Benchmark Yield: 1.8 Tonnes/ha. Growth duration: 90-110 days. Water requirement: Medium. Widely cultivated across India under recommended agronomic packages.',
      imageUrl: 'https://images.unsplash.com/photo-1551754655-cd27e38d2076?w=800',
      soils: ["Alluvial plains (proxy)", "Red/red-yellow soil (proxy)", "Black cotton/regur (proxy)"],
      seasons: ["Kharif", "Rabi", "Summer"],
      benchmarkPrice: 2090,
      mandi: 'Davangere APMC, Karnataka'
    },
    {
      name: 'Mango',
      scientificName: 'Mangifera indica',
      duration: 'Perennial (orchard tree)',
      waterRequirement: 'Medium',
      description: 'Mango (Aam). Category: Horticulture Fruit. National Benchmark Yield: 4.78 Tonnes/ha. Growth duration: Perennial (orchard tree). Water requirement: Medium. Widely cultivated across India under recommended agronomic packages.',
      imageUrl: 'https://images.unsplash.com/photo-1553279768-865429fa0078?w=800',
      soils: ["Red/red-yellow soil (proxy)", "Coastal/lateritic mix (proxy)", "Alluvial plains (proxy)"],
      seasons: ["Whole Year", "Summer"],
      benchmarkPrice: 4500,
      mandi: 'Malda Market, West Bengal'
    },
    {
      name: 'Masoor',
      scientificName: 'Lens culinaris',
      duration: '110-120 days',
      waterRequirement: 'Low',
      description: 'Red Lentil / Masoor Dal. Category: Pulse. National Benchmark Yield: 0.68 Tonnes/ha. Growth duration: 110-120 days. Water requirement: Low. Widely cultivated across India under recommended agronomic packages.',
      imageUrl: 'https://images.unsplash.com/photo-1515543237350-b3eea1ec8082?w=800',
      soils: ["Alluvial plains (proxy)", "Black cotton/regur (proxy)", "Mountain/forest soil (proxy)"],
      seasons: ["Rabi", "Winter"],
      benchmarkPrice: 6425,
      mandi: 'Bhopal Mandi, Madhya Pradesh'
    },
    {
      name: 'Mesta',
      scientificName: 'Hibiscus sabdariffa',
      duration: '130-150 days',
      waterRequirement: 'Medium',
      description: 'Roselle / Ambadi (Mesta). Category: Fiber. National Benchmark Yield: 5.0 Tonnes/ha. Growth duration: 130-150 days. Water requirement: Medium. Widely cultivated across India under recommended agronomic packages.',
      imageUrl: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800',
      soils: ["Alluvial plains (proxy)", "Red/red-yellow soil (proxy)", "Deltaic/alluvial (proxy)"],
      seasons: ["Kharif", "Whole Year"],
      benchmarkPrice: 4200,
      mandi: 'Vizianagaram Market, Andhra Pradesh'
    },
    {
      name: 'Moong(Green Gram)',
      scientificName: 'Vigna radiata',
      duration: '65-75 days',
      waterRequirement: 'Low',
      description: 'Green Gram / Moong Dal. Category: Pulse. National Benchmark Yield: 0.42 Tonnes/ha. Growth duration: 65-75 days. Water requirement: Low. Widely cultivated across India under recommended agronomic packages.',
      imageUrl: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800',
      soils: ["Alluvial plains (proxy)", "Red/red-yellow soil (proxy)", "Black cotton/regur (proxy)"],
      seasons: ["Kharif", "Summer", "Rabi"],
      benchmarkPrice: 8558,
      mandi: 'Nagaur APMC, Rajasthan'
    },
    {
      name: 'Moth',
      scientificName: 'Vigna aconitifolia',
      duration: '65-75 days',
      waterRequirement: 'Low',
      description: 'Moth Bean / Matki (Bikaneri Bhujia Pulse). Category: Pulse. National Benchmark Yield: 0.33 Tonnes/ha. Growth duration: 65-75 days. Water requirement: Low. Widely cultivated across India under recommended agronomic packages.',
      imageUrl: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800',
      soils: ["Arid/desert soil (proxy)", "Alluvial plains (proxy)"],
      seasons: ["Kharif", "Whole Year"],
      benchmarkPrice: 6800,
      mandi: 'Bikaner Mandi, Rajasthan'
    },
    {
      name: 'Niger seed',
      scientificName: 'Guizotia abyssinica',
      duration: '100-115 days',
      waterRequirement: 'Low',
      description: 'Niger Seed / Ramtil. Category: Oilseed. National Benchmark Yield: 0.29 Tonnes/ha. Growth duration: 100-115 days. Water requirement: Low. Widely cultivated across India under recommended agronomic packages.',
      imageUrl: 'https://images.unsplash.com/photo-1508873696983-2df5293cb395?w=800',
      soils: ["Red/red-yellow soil (proxy)", "Black cotton/regur (proxy)"],
      seasons: ["Kharif", "Rabi"],
      benchmarkPrice: 7734,
      mandi: 'Koraput APMC, Odisha'
    },
    {
      name: 'Onion',
      scientificName: 'Allium cepa',
      duration: '120-140 days',
      waterRequirement: 'Medium',
      description: 'Onion / Pyaz. Category: Horticulture Vegetable. National Benchmark Yield: 10.29 Tonnes/ha. Growth duration: 120-140 days. Water requirement: Medium. Widely cultivated across India under recommended agronomic packages.',
      imageUrl: 'https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?w=800',
      soils: ["Alluvial plains (proxy)", "Red/red-yellow soil (proxy)", "Black cotton/regur (proxy)"],
      seasons: ["Rabi", "Kharif", "Summer"],
      benchmarkPrice: 2400,
      mandi: 'Lasalgaon APMC, Maharashtra'
    },
    {
      name: 'Papaya',
      scientificName: 'Carica papaya',
      duration: '270-330 days',
      waterRequirement: 'Medium',
      description: 'Papaya / Papita. Category: Horticulture Fruit. National Benchmark Yield: 17.87 Tonnes/ha. Growth duration: 270-330 days. Water requirement: Medium. Widely cultivated across India under recommended agronomic packages.',
      imageUrl: 'https://images.unsplash.com/photo-1517282009859-f000ec3b26fe?w=800',
      soils: ["Alluvial plains (proxy)", "Red/red-yellow soil (proxy)"],
      seasons: ["Whole Year"],
      benchmarkPrice: 1800,
      mandi: 'Anantapur Market, Andhra Pradesh'
    },
    {
      name: 'Peas & beans (Pulses)',
      scientificName: 'Pisum sativum',
      duration: '80-100 days',
      waterRequirement: 'Medium',
      description: 'Green Peas & Beans / Matar. Category: Pulse. National Benchmark Yield: 0.96 Tonnes/ha. Growth duration: 80-100 days. Water requirement: Medium. Widely cultivated across India under recommended agronomic packages.',
      imageUrl: 'https://images.unsplash.com/photo-1515543237350-b3eea1ec8082?w=800',
      soils: ["Alluvial plains (proxy)", "Mountain/forest soil (proxy)"],
      seasons: ["Rabi", "Winter"],
      benchmarkPrice: 4800,
      mandi: 'Kanpur Mandi, Uttar Pradesh'
    },
    {
      name: 'Potato',
      scientificName: 'Solanum tuberosum',
      duration: '90-110 days',
      waterRequirement: 'Medium',
      description: 'Potato / Aloo. Category: Horticulture Vegetable. National Benchmark Yield: 10.77 Tonnes/ha. Growth duration: 90-110 days. Water requirement: Medium. Widely cultivated across India under recommended agronomic packages.',
      imageUrl: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=800',
      soils: ["Alluvial plains (proxy)", "Red/red-yellow soil (proxy)", "Mountain/forest soil (proxy)"],
      seasons: ["Rabi", "Winter"],
      benchmarkPrice: 1650,
      mandi: 'Agra Mandi, Uttar Pradesh'
    },
    {
      name: 'Ragi',
      scientificName: 'Eleusine coracana',
      duration: '100-120 days',
      waterRequirement: 'Low',
      description: 'Finger Millet / Ragi (Nachni). Category: Cereal. National Benchmark Yield: 1.06 Tonnes/ha. Growth duration: 100-120 days. Water requirement: Low. Widely cultivated across India under recommended agronomic packages.',
      imageUrl: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=800',
      soils: ["Red/red-yellow soil (proxy)", "Alluvial plains (proxy)"],
      seasons: ["Kharif", "Autumn"],
      benchmarkPrice: 3846,
      mandi: 'Mysore APMC, Karnataka'
    },
    {
      name: 'Rapeseed &Mustard',
      scientificName: 'Brassica juncea',
      duration: '105-120 days',
      waterRequirement: 'Low',
      description: 'Mustard / Sarson (Rai). Category: Oilseed. National Benchmark Yield: 0.71 Tonnes/ha. Growth duration: 105-120 days. Water requirement: Low. Widely cultivated across India under recommended agronomic packages.',
      imageUrl: 'https://images.unsplash.com/photo-1508873696983-2df5293cb395?w=800',
      soils: ["Alluvial plains (proxy)", "Black cotton/regur (proxy)", "Red/red-yellow soil (proxy)"],
      seasons: ["Rabi", "Winter"],
      benchmarkPrice: 5650,
      mandi: 'Bharatpur APMC, Rajasthan'
    },
    {
      name: 'Rice',
      scientificName: 'Oryza sativa',
      duration: '120-150 days',
      waterRequirement: 'High',
      description: 'Rice / Paddy (Dhan / Chawal). Category: Cereal. National Benchmark Yield: 1.93 Tonnes/ha. Growth duration: 120-150 days. Water requirement: High. Widely cultivated across India under recommended agronomic packages.',
      imageUrl: 'https://images.unsplash.com/photo-1536304993881-ff6e9eefa2a6?w=800',
      soils: ["Alluvial plains (proxy)", "Deltaic/alluvial (proxy)", "Red/red-yellow soil (proxy)"],
      seasons: ["Kharif", "Summer", "Winter"],
      benchmarkPrice: 2203,
      mandi: 'Karnal Grain Market, Haryana'
    },
    {
      name: 'Safflower',
      scientificName: 'Carthamus tinctorius',
      duration: '120-135 days',
      waterRequirement: 'Low',
      description: 'Safflower / Kusum. Category: Oilseed. National Benchmark Yield: 0.5 Tonnes/ha. Growth duration: 120-135 days. Water requirement: Low. Widely cultivated across India under recommended agronomic packages.',
      imageUrl: 'https://images.unsplash.com/photo-1508873696983-2df5293cb395?w=800',
      soils: ["Black cotton/regur (proxy)", "Red/red-yellow soil (proxy)"],
      seasons: ["Rabi", "Whole Year"],
      benchmarkPrice: 5800,
      mandi: 'Latur APMC, Maharashtra'
    },
    {
      name: 'Sannhamp',
      scientificName: 'Crotalaria juncea',
      duration: '90-120 days',
      waterRequirement: 'Low',
      description: 'Sunn Hemp / Sanai. Category: Fiber. National Benchmark Yield: 0.5 Tonnes/ha. Growth duration: 90-120 days. Water requirement: Low. Widely cultivated across India under recommended agronomic packages.',
      imageUrl: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800',
      soils: ["Alluvial plains (proxy)", "Black cotton/regur (proxy)"],
      seasons: ["Kharif", "Whole Year"],
      benchmarkPrice: 3900,
      mandi: 'Varanasi Mandi, Uttar Pradesh'
    },
    {
      name: 'Sesamum',
      scientificName: 'Sesamum indicum',
      duration: '80-95 days',
      waterRequirement: 'Low',
      description: 'Sesame / Til. Category: Oilseed. National Benchmark Yield: 0.33 Tonnes/ha. Growth duration: 80-95 days. Water requirement: Low. Widely cultivated across India under recommended agronomic packages.',
      imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/69/Sa_white_sesame_seeds.jpg/960px-Sa_white_sesame_seeds.jpg',
      soils: ["Red/red-yellow soil (proxy)", "Alluvial plains (proxy)", "Black cotton/regur (proxy)"],
      seasons: ["Kharif", "Summer"],
      benchmarkPrice: 8635,
      mandi: 'Amreli APMC, Gujarat'
    },
    {
      name: 'Small millets',
      scientificName: 'Panicum sumatrense',
      duration: '75-90 days',
      waterRequirement: 'Low',
      description: 'Small Millets (Kodo, Kutki, Kangni). Category: Cereal. National Benchmark Yield: 0.6 Tonnes/ha. Growth duration: 75-90 days. Water requirement: Low. Widely cultivated across India under recommended agronomic packages.',
      imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d3/Indian_millets_commonly_used_in_kitchen.jpg/960px-Indian_millets_commonly_used_in_kitchen.jpg',
      soils: ["Red/red-yellow soil (proxy)", "Mountain/forest soil (proxy)"],
      seasons: ["Kharif", "Rabi"],
      benchmarkPrice: 3200,
      mandi: 'Dindigul Market, Tamil Nadu'
    },
    {
      name: 'Soyabean',
      scientificName: 'Glycine max',
      duration: '90-105 days',
      waterRequirement: 'Medium',
      description: 'Soybean (Soyabean). Category: Oilseed. National Benchmark Yield: 1.0 Tonnes/ha. Growth duration: 90-105 days. Water requirement: Medium. Widely cultivated across India under recommended agronomic packages.',
      imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d4/Soybean.USDA.jpg/960px-Soybean.USDA.jpg',
      soils: ["Black cotton/regur (proxy)", "Red/red-yellow soil (proxy)", "Alluvial plains (proxy)"],
      seasons: ["Kharif", "Whole Year"],
      benchmarkPrice: 4600,
      mandi: 'Ujjain APMC, Madhya Pradesh'
    },
    {
      name: 'Sugarcane',
      scientificName: 'Saccharum officinarum',
      duration: '300-365 days',
      waterRequirement: 'Very High',
      description: 'Sugarcane / Ganna. Category: Sugar Crop. National Benchmark Yield: 53.12 Tonnes/ha. Growth duration: 300-365 days. Water requirement: Very High. Widely cultivated across India under recommended agronomic packages.',
      imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/17/Sugarcane_field_of_Kachirapalayam.jpg/960px-Sugarcane_field_of_Kachirapalayam.jpg',
      soils: ["Alluvial plains (proxy)", "Black cotton/regur (proxy)", "Red/red-yellow soil (proxy)"],
      seasons: ["Whole Year", "Kharif"],
      benchmarkPrice: 340,
      mandi: 'Kolhapur APMC, Maharashtra'
    },
    {
      name: 'Sunflower',
      scientificName: 'Helianthus annuus',
      duration: '90-100 days',
      waterRequirement: 'Medium',
      description: 'Sunflower / Surajmukhi. Category: Oilseed. National Benchmark Yield: 0.8 Tonnes/ha. Growth duration: 90-100 days. Water requirement: Medium. Widely cultivated across India under recommended agronomic packages.',
      imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/fd/Common_sunflower_%28Helianthus_annuus%29.jpg/960px-Common_sunflower_%28Helianthus_annuus%29.jpg',
      soils: ["Black cotton/regur (proxy)", "Red/red-yellow soil (proxy)", "Alluvial plains (proxy)"],
      seasons: ["Kharif", "Rabi", "Summer"],
      benchmarkPrice: 6760,
      mandi: 'Kurnool APMC, Andhra Pradesh'
    },
    {
      name: 'Sweet potato',
      scientificName: 'Ipomoea batatas',
      duration: '110-130 days',
      waterRequirement: 'Medium',
      description: 'Sweet Potato / Shakarkand. Category: Horticulture Vegetable. National Benchmark Yield: 8.21 Tonnes/ha. Growth duration: 110-130 days. Water requirement: Medium. Widely cultivated across India under recommended agronomic packages.',
      imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/38/Ipomoea_batatas_-_Tubers.jpg/960px-Ipomoea_batatas_-_Tubers.jpg',
      soils: ["Alluvial plains (proxy)", "Red/red-yellow soil (proxy)"],
      seasons: ["Whole Year", "Kharif"],
      benchmarkPrice: 2200,
      mandi: 'Bhubaneswar Market, Odisha'
    },
    {
      name: 'Tapioca',
      scientificName: 'Manihot esculenta',
      duration: '240-300 days',
      waterRequirement: 'Medium',
      description: 'Cassava / Sabudana Root (Tapioca / Kappa). Category: Horticulture Vegetable. National Benchmark Yield: 11.42 Tonnes/ha. Growth duration: 240-300 days. Water requirement: Medium. Widely cultivated across India under recommended agronomic packages.',
      imageUrl: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=800',
      soils: ["Red/red-yellow soil (proxy)", "Coastal/lateritic mix (proxy)"],
      seasons: ["Whole Year", "Kharif"],
      benchmarkPrice: 1900,
      mandi: 'Salem Sago Mandi, Tamil Nadu'
    },
    {
      name: 'Tobacco',
      scientificName: 'Nicotiana tabacum',
      duration: '100-120 days',
      waterRequirement: 'Medium',
      description: 'Tobacco / Tambaku. Category: Commercial Plantation. National Benchmark Yield: 1.11 Tonnes/ha. Growth duration: 100-120 days. Water requirement: Medium. Widely cultivated across India under recommended agronomic packages.',
      imageUrl: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800',
      soils: ["Black cotton/regur (proxy)", "Alluvial plains (proxy)", "Red/red-yellow soil (proxy)"],
      seasons: ["Rabi", "Whole Year"],
      benchmarkPrice: 16500,
      mandi: 'Guntur Tobacco Board, Andhra Pradesh'
    },
    {
      name: 'Turmeric',
      scientificName: 'Curcuma longa',
      duration: '210-270 days',
      waterRequirement: 'High',
      description: 'Turmeric / Haldi. Category: Spice. National Benchmark Yield: 2.0 Tonnes/ha. Growth duration: 210-270 days. Water requirement: High. Widely cultivated across India under recommended agronomic packages.',
      imageUrl: 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=800',
      soils: ["Red/red-yellow soil (proxy)", "Alluvial plains (proxy)", "Black cotton/regur (proxy)"],
      seasons: ["Whole Year", "Kharif"],
      benchmarkPrice: 14200,
      mandi: 'Nizamabad APMC, Telangana'
    },
    {
      name: 'Urad',
      scientificName: 'Vigna mungo',
      duration: '70-80 days',
      waterRequirement: 'Low',
      description: 'Black Gram / Urad Dal. Category: Pulse. National Benchmark Yield: 0.46 Tonnes/ha. Growth duration: 70-80 days. Water requirement: Low. Widely cultivated across India under recommended agronomic packages.',
      imageUrl: 'https://images.unsplash.com/photo-1515543237350-b3eea1ec8082?w=800',
      soils: ["Alluvial plains (proxy)", "Black cotton/regur (proxy)", "Red/red-yellow soil (proxy)"],
      seasons: ["Kharif", "Rabi", "Summer"],
      benchmarkPrice: 6950,
      mandi: 'Akola APMC, Maharashtra'
    },
    {
      name: 'Wheat',
      scientificName: 'Triticum aestivum',
      duration: '115-135 days',
      waterRequirement: 'Medium',
      description: 'Wheat / Gehun. Category: Cereal. National Benchmark Yield: 1.88 Tonnes/ha. Growth duration: 115-135 days. Water requirement: Medium. Widely cultivated across India under recommended agronomic packages.',
      imageUrl: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=800',
      soils: ["Alluvial plains (proxy)", "Black cotton/regur (proxy)", "Red/red-yellow soil (proxy)"],
      seasons: ["Rabi", "Winter"],
      benchmarkPrice: 2275,
      mandi: 'Khanna Grain Market, Punjab'
    },
  ];

  // Batch insert crops
  await prisma.crop.createMany({
    data: rawCrops.map(c => ({
      name: c.name,
      scientificName: c.scientificName,
      duration: c.duration,
      waterRequirement: c.waterRequirement,
      description: c.description,
      imageUrl: c.imageUrl
    })),
    skipDuplicates: true
  });

  const allCrops = await prisma.crop.findMany({ select: { id: true, name: true } });
  const cropMap = new Map<string, number>(allCrops.map(c => [c.name, c.id]));
  console.log(`✅ All ${cropMap.size} Crops seeded with AI model precision.`);

  // 6. Crop Suitability Matrix (Batch insert)
  console.log('🔗 Seeding Crop-Soil-Season Suitability Matrix...');
  const suitabilityBatch: { cropId: number; soilTypeId: number; seasonId: number }[] = [];
  for (const c of rawCrops) {
    const cropId = cropMap.get(c.name);
    if (!cropId) continue;

    for (const soilName of c.soils) {
      const soilTypeId = soilMap.get(soilName);
      if (!soilTypeId) continue;

      for (const seasonName of c.seasons) {
        const seasonId = seasonMap.get(seasonName);
        if (!seasonId) continue;

        suitabilityBatch.push({ cropId, soilTypeId, seasonId });
      }
    }
  }

  await prisma.cropSuitability.createMany({
    data: suitabilityBatch,
    skipDuplicates: true
  });
  console.log(`✅ ${suitabilityBatch.length} Crop Suitability mappings created in batch.`);

  // 7. Market Prices (Batch insert)
  console.log('💰 Seeding APMC Market Prices across major Indian agricultural markets...');
  const statesAndDistricts = [
    { state: 'Punjab', district: 'Khanna', mandi: 'Khanna Grain Market' },
    { state: 'Haryana', district: 'Karnal', mandi: 'Karnal Anaj Mandi' },
    { state: 'Uttar Pradesh', district: 'Varanasi', mandi: 'Varanasi APMC' },
    { state: 'Uttar Pradesh', district: 'Agra', mandi: 'Agra Krishi Mandi' },
    { state: 'Madhya Pradesh', district: 'Indore', mandi: 'Indore Mandi' },
    { state: 'Madhya Pradesh', district: 'Ujjain', mandi: 'Ujjain Krishi Upaj Mandi' },
    { state: 'Maharashtra', district: 'Nashik', mandi: 'Lasalgaon APMC' },
    { state: 'Maharashtra', district: 'Nagpur', mandi: 'Nagpur Kalamna Market' },
    { state: 'Gujarat', district: 'Rajkot', mandi: 'Rajkot APMC' },
    { state: 'Rajasthan', district: 'Jaipur', mandi: 'Jaipur Krishi Mandi' },
    { state: 'West Bengal', district: 'Bardhaman', mandi: 'Bardhaman APMC' },
    { state: 'Andhra Pradesh', district: 'Guntur', mandi: 'Guntur Mirchi Yard' },
    { state: 'Karnataka', district: 'Belgaum', mandi: 'Belgaum APMC' },
    { state: 'Tamil Nadu', district: 'Coimbatore', mandi: 'Coimbatore Market' },
    { state: 'Kerala', district: 'Wayanad', mandi: 'Wayanad Spices Exchange' },
    { state: 'Bihar', district: 'Patna', mandi: 'Patna Gulzarbagh Mandi' }
  ];

  const marketPriceBatch: any[] = [];
  for (let i = 0; i < rawCrops.length; i++) {
    const c = rawCrops[i];
    const cropId = cropMap.get(c.name);
    if (!cropId) continue;

    const baseLoc = statesAndDistricts[i % statesAndDistricts.length];
    marketPriceBatch.push({
      cropId,
      marketName: c.mandi,
      price: c.benchmarkPrice,
      currency: 'INR',
      state: baseLoc.state,
      district: baseLoc.district,
      date: new Date()
    });

    const altLoc = statesAndDistricts[(i + 5) % statesAndDistricts.length];
    const altPrice = Math.round(c.benchmarkPrice * (0.96 + (i % 9) * 0.01));
    marketPriceBatch.push({
      cropId,
      marketName: altLoc.mandi,
      price: altPrice,
      currency: 'INR',
      state: altLoc.state,
      district: altLoc.district,
      date: new Date(Date.now() - 24 * 3600 * 1000)
    });
  }

  await prisma.marketPrice.createMany({ data: marketPriceBatch });
  console.log(`✅ ${marketPriceBatch.length} APMC Market Price records seeded.`);

  // 8. District Crop Data (Batch insert)
  console.log('📍 Seeding District Crop Data across India...');
  const districtCropSamples = [
    { district: 'Ludhiana', pincode: '141001', crop: 'Wheat', season: 'Rabi', soil: 'Alluvial plains (proxy)', minTemp: 9, maxTemp: 24 },
    { district: 'Karnal', pincode: '132001', crop: 'Rice', season: 'Kharif', soil: 'Alluvial plains (proxy)', minTemp: 24, maxTemp: 34 },
    { district: 'Agra', pincode: '282001', crop: 'Potato', season: 'Rabi', soil: 'Alluvial plains (proxy)', minTemp: 10, maxTemp: 26 },
    { district: 'Varanasi', pincode: '221001', crop: 'Rice', season: 'Kharif', soil: 'Alluvial plains (proxy)', minTemp: 25, maxTemp: 36 },
    { district: 'Bardhaman', pincode: '713101', crop: 'Rice', season: 'Kharif', soil: 'Alluvial plains (proxy)', minTemp: 24, maxTemp: 35 },
    { district: 'Nadia', pincode: '741101', crop: 'Jute', season: 'Kharif', soil: 'Deltaic/alluvial (proxy)', minTemp: 26, maxTemp: 36 },
    { district: 'Indore', pincode: '452001', crop: 'Soyabean', season: 'Kharif', soil: 'Black cotton/regur (proxy)', minTemp: 22, maxTemp: 32 },
    { district: 'Nagpur', pincode: '440001', crop: 'Cotton(lint)', season: 'Kharif', soil: 'Black cotton/regur (proxy)', minTemp: 23, maxTemp: 35 },
    { district: 'Nashik', pincode: '422001', crop: 'Onion', season: 'Rabi', soil: 'Black cotton/regur (proxy)', minTemp: 13, maxTemp: 29 },
    { district: 'Rajkot', pincode: '360001', crop: 'Groundnut', season: 'Kharif', soil: 'Red/red-yellow soil (proxy)', minTemp: 24, maxTemp: 35 },
    { district: 'Jaipur', pincode: '302001', crop: 'Bajra', season: 'Kharif', soil: 'Arid/desert soil (proxy)', minTemp: 26, maxTemp: 38 },
    { district: 'Guntur', pincode: '522001', crop: 'Dry chillies', season: 'Kharif', soil: 'Black cotton/regur (proxy)', minTemp: 25, maxTemp: 37 },
    { district: 'Belgaum', pincode: '590001', crop: 'Sugarcane', season: 'Whole Year', soil: 'Black cotton/regur (proxy)', minTemp: 18, maxTemp: 33 },
    { district: 'Wayanad', pincode: '673121', crop: 'Black pepper', season: 'Whole Year', soil: 'Mountain/forest soil (proxy)', minTemp: 18, maxTemp: 28 },
    { district: 'Malda', pincode: '732101', crop: 'Mango', season: 'Whole Year', soil: 'Alluvial plains (proxy)', minTemp: 22, maxTemp: 36 },
    { district: 'Patna', pincode: '800001', crop: 'Wheat', season: 'Rabi', soil: 'Alluvial plains (proxy)', minTemp: 12, maxTemp: 27 },
    { district: 'Coimbatore', pincode: '641001', crop: 'Banana', season: 'Whole Year', soil: 'Red/red-yellow soil (proxy)', minTemp: 21, maxTemp: 34 }
  ];

  const districtCropBatch: any[] = [];
  for (const d of districtCropSamples) {
    const cropId = cropMap.get(d.crop);
    const seasonId = seasonMap.get(d.season);
    const soilTypeId = soilMap.get(d.soil);

    if (cropId && seasonId && soilTypeId) {
      districtCropBatch.push({
        district: d.district,
        pinCode: d.pincode,
        cropId,
        seasonId,
        soilTypeId,
        minTemp: d.minTemp,
        maxTemp: d.maxTemp
      });
    }
  }

  await prisma.districtCrop.createMany({
    data: districtCropBatch,
    skipDuplicates: true
  });
  console.log(`✅ ${districtCropBatch.length} District Crop entries seeded.`);

  // 9. Government Schemes (Batch insert)
  console.log('🏛️ Seeding National & State Agricultural Schemes...');
  const schemes = [
    {
      name: 'PM-KISAN (Pradhan Mantri Kisan Samman Nidhi)',
      description: 'Direct income support of ₹6,000 per year transferred directly to bank accounts of all landholding farmer families in three 4-monthly installments of ₹2,000.',
      eligibilityCriteria: 'All landholding farmer families having cultivable land in their names.',
      applicationLink: 'https://pmkisan.gov.in',
      deadline: new Date('2026-12-31')
    },
    {
      name: 'PMFBY (Pradhan Mantri Fasal Bima Yojana)',
      description: 'Comprehensive risk insurance coverage from pre-sowing to post-harvest against non-preventable natural risks (drought, flood, pest, cyclone). Farmers pay only 2% for Kharif, 1.5% for Rabi, and 5% for commercial/horticultural crops.',
      eligibilityCriteria: 'All farmers growing notified crops in notified areas including sharecroppers and tenant farmers.',
      applicationLink: 'https://pmfby.gov.in',
      deadline: new Date('2026-11-30')
    },
    {
      name: 'Kisan Credit Card (KCC) Scheme',
      description: 'Adequate and timely credit support from institutional banking for agricultural cultivation expenses, post-harvest costs, and maintenance of farm assets at subsidized 4% interest rate with prompt repayment.',
      eligibilityCriteria: 'Individual farmers, joint borrowers, self-help groups (SHGs), and tenant cultivators.',
      applicationLink: 'https://www.myscheme.gov.in/schemes/kcc',
      deadline: null
    },
    {
      name: 'Soil Health Card Scheme',
      description: 'Provides comprehensive diagnostic cards with N, P, K, micronutrients (Zn, Fe, Cu, Mn, B), pH, EC, and crop-specific fertilizer dosage recommendations to optimize input costs.',
      eligibilityCriteria: 'All agricultural landowners and cultivators across India.',
      applicationLink: 'https://soilhealth.dac.gov.in',
      deadline: null
    },
    {
      name: 'Paramparagat Krishi Vikas Yojana (PKVY)',
      description: 'Financial assistance of ₹50,000 per hectare for 3 years to adopt certified organic farming practices through participatory cluster models (PGS-India).',
      eligibilityCriteria: 'Farmer clusters comprising 20 or more farmers holding a total minimum of 20 hectares.',
      applicationLink: 'https://pgsindia-ncof.gov.in',
      deadline: new Date('2026-12-31')
    },
    {
      name: 'Sub-Mission on Agricultural Mechanization (SMAM)',
      description: '40% to 50% capital subsidy on modern agricultural machinery, power tillers, solar pumps, and establishment of Custom Hiring Centers (CHCs).',
      eligibilityCriteria: 'Small and marginal farmers, SC/ST, women farmers, and rural entrepreneurs.',
      applicationLink: 'https://agrimachinery.nic.in',
      deadline: new Date('2026-10-31')
    },
    {
      name: 'National Mission on Edible Oils – Oilseeds (NMEO)',
      description: 'Subsidies on certified high-yielding seed varieties, micro-irrigation systems, and cluster demonstrations for mustard, groundnut, and soybean farmers.',
      eligibilityCriteria: 'Farmers engaged in commercial oilseed cultivation.',
      applicationLink: 'https://nmeo.gov.in',
      deadline: new Date('2026-12-15')
    },
    {
      name: 'e-NAM (National Agriculture Market)',
      description: 'Pan-India electronic trading portal networking APMC mandis to discover transparent prices and trade crops across state borders without physical middlemen.',
      eligibilityCriteria: 'Registered farmers with Aadhaar and active bank accounts.',
      applicationLink: 'https://enam.gov.in',
      deadline: null
    }
  ];

  await prisma.governmentScheme.createMany({ data: schemes });
  console.log(`✅ ${schemes.length} Government Schemes seeded.`);

  // 10. Weather Data across Indian Agro-Climatic Hubs (Batch insert)
  console.log('🌦️ Seeding Weather Data baselines across India...');
  const weatherSamples = [
    { location: 'Ludhiana', temperature: 22.4, humidity: 62.0, rainfall: 4.5, windSpeed: 9.8, forecast: 'Clear skies, favorable for wheat tillering' },
    { location: 'Karnal', temperature: 23.1, humidity: 65.0, rainfall: 6.0, windSpeed: 10.2, forecast: 'Pleasant, moderate humidity' },
    { location: 'Agra', temperature: 24.8, humidity: 54.0, rainfall: 0.0, windSpeed: 8.5, forecast: 'Dry sunny weather, ideal for tuber bulking' },
    { location: 'Varanasi', temperature: 26.5, humidity: 70.0, rainfall: 12.0, windSpeed: 7.4, forecast: 'Partly cloudy, mild moisture' },
    { location: 'Bardhaman', temperature: 27.2, humidity: 76.0, rainfall: 18.5, windSpeed: 11.0, forecast: 'Humid, optimal vegetative growth' },
    { location: 'Indore', temperature: 25.0, humidity: 58.0, rainfall: 2.0, windSpeed: 12.5, forecast: 'Sunny, dry conditions' },
    { location: 'Nagpur', temperature: 28.4, humidity: 52.0, rainfall: 0.0, windSpeed: 10.0, forecast: 'Warm, dry weather' },
    { location: 'Nashik', temperature: 23.5, humidity: 60.0, rainfall: 1.0, windSpeed: 8.0, forecast: 'Cool evenings, favorable for onions' },
    { location: 'Guntur', temperature: 29.8, humidity: 72.0, rainfall: 8.0, windSpeed: 13.5, forecast: 'Warm humid conditions' },
    { location: 'Jaipur', temperature: 26.0, humidity: 38.0, rainfall: 0.0, windSpeed: 14.0, forecast: 'Dry and bright, arid warmth' },
    { location: 'Belgaum', temperature: 24.2, humidity: 68.0, rainfall: 15.0, windSpeed: 9.5, forecast: 'Gentle breezes with light showers' },
    { location: 'Patna', temperature: 25.6, humidity: 66.0, rainfall: 5.0, windSpeed: 8.0, forecast: 'Clear sunny sky' }
  ];

  await prisma.weatherData.createMany({ data: weatherSamples });
  console.log(`✅ ${weatherSamples.length} Weather Data records seeded.`);

  // 11. Soil Data (Authentic NPK & pH from regional baselines - Batch insert)
  console.log('🧪 Seeding authentic Regional Soil Health baseline samples...');
  const soilSamples = [
    { location: 'Ludhiana, Punjab', nitrogen: 240.0, phosphorus: 22.0, potassium: 180.0, ph: 7.4 },
    { location: 'Karnal, Haryana', nitrogen: 230.0, phosphorus: 20.0, potassium: 175.0, ph: 7.2 },
    { location: 'Agra, Uttar Pradesh', nitrogen: 185.0, phosphorus: 16.0, potassium: 150.0, ph: 7.6 },
    { location: 'Varanasi, Uttar Pradesh', nitrogen: 195.0, phosphorus: 18.0, potassium: 155.0, ph: 7.1 },
    { location: 'Bardhaman, West Bengal', nitrogen: 210.0, phosphorus: 19.0, potassium: 160.0, ph: 6.5 },
    { location: 'Indore, Madhya Pradesh', nitrogen: 170.0, phosphorus: 14.0, potassium: 220.0, ph: 7.8 },
    { location: 'Nagpur, Maharashtra', nitrogen: 160.0, phosphorus: 13.0, potassium: 240.0, ph: 7.9 },
    { location: 'Nashik, Maharashtra', nitrogen: 175.0, phosphorus: 15.0, potassium: 210.0, ph: 7.5 },
    { location: 'Guntur, Andhra Pradesh', nitrogen: 190.0, phosphorus: 15.0, potassium: 145.0, ph: 6.8 },
    { location: 'Jaipur, Rajasthan', nitrogen: 130.0, phosphorus: 12.0, potassium: 135.0, ph: 8.1 },
    { location: 'Belgaum, Karnataka', nitrogen: 185.0, phosphorus: 16.0, potassium: 170.0, ph: 6.9 },
    { location: 'Wayanad, Kerala', nitrogen: 220.0, phosphorus: 18.0, potassium: 190.0, ph: 5.6 }
  ];

  await prisma.soilData.createMany({ data: soilSamples });
  console.log(`✅ ${soilSamples.length} Soil Health Card records seeded.`);

  // 12. Seasonal Crop Advisories (Batch insert)
  console.log('📢 Seeding Agronomic Advisories for top crops...');
  const sampleAdvisories = [
    {
      crop: 'Wheat',
      location: 'Ludhiana',
      stage: 'Crown Root Initiation (21-25 DAS)',
      status: 'active',
      message: 'Critical irrigation stage: Apply first irrigation at CRI stage (21 days after sowing). Top dress with 50 kg Urea/acre.'
    },
    {
      crop: 'Rice',
      location: 'Karnal',
      stage: 'Panicle Initiation',
      status: 'active',
      message: 'Maintain 3-5 cm standing water during panicle formation. Spray Propiconazole 25% EC @ 1 ml/L if sheath blight symptoms appear.'
    },
    {
      crop: 'Cotton(lint)',
      location: 'Nagpur',
      stage: 'Square & Boll Formation',
      status: 'active',
      message: 'Monitor for pink bollworm with pheromone traps (5 traps/ha). Apply 2% DAP foliar spray to prevent square drop.'
    },
    {
      crop: 'Potato',
      location: 'Agra',
      stage: 'Tuber Bulking',
      status: 'active',
      message: 'Earthing up is mandatory to prevent tuber greening. Maintain optimal soil moisture; avoid flood irrigation.'
    },
    {
      crop: 'Rapeseed &Mustard',
      location: 'Jaipur',
      stage: 'Siliqua Filling',
      status: 'active',
      message: 'Watch out for aphid infestation during cloudy weather. Spray Dimethoate 30 EC @ 1.5 ml/L if aphid counts exceed ETL.'
    },
    {
      crop: 'Sugarcane',
      location: 'Belgaum',
      stage: 'Grand Growth Stage',
      status: 'active',
      message: 'Trash mulching recommended to conserve soil moisture. Apply final nitrogen top-dressing along with light earthing up.'
    }
  ];

  const advisoryBatch: any[] = [];
  for (const adv of sampleAdvisories) {
    const cropId = cropMap.get(adv.crop);
    if (cropId) {
      advisoryBatch.push({
        cropId,
        location: adv.location,
        stage: adv.stage,
        status: adv.status,
        message: adv.message,
        date: new Date()
      });
    }
  }

  await prisma.cropAdvisory.createMany({ data: advisoryBatch });
  console.log(`✅ ${advisoryBatch.length} Crop Advisories seeded.`);

  console.log('\n🎉 All 50 Crops, 7 Soil Archetypes, 6 Seasons, Suitabilities, Market Prices, and Advisories seeded successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
