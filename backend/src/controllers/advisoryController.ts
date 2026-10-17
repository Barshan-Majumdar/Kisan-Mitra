import { Request, Response } from 'express';
import prisma from '../prisma';
import { generateFarmingPlan } from '../services/geminiService';

const FALLBACK_ADVISORIES = [
  {
    id: 1,
    location: 'Ludhiana, Punjab',
    stage: 'Crown Root Initiation (21-25 DAS)',
    status: 'active',
    date: '2026-10-16T07:20:18.298Z',
    message: `### Wheat Crop Management Guide
- **Critical Irrigation**: Apply first irrigation at CRI stage (21 days after sowing).
- **Fertilizer**: Top dress with 50 kg Urea/acre along with light watering.
- **Weed Control**: Check for Phalaris minor and broadleaf weeds before canopy closure.`,
    userId: null,
    crop: {
      id: 50,
      name: 'Wheat',
      scientificName: 'Triticum aestivum',
      duration: '115-135 days',
      waterRequirement: 'Medium'
    }
  },
  {
    id: 2,
    location: 'Karnal, Haryana',
    stage: 'Panicle Initiation',
    status: 'active',
    date: '2026-10-16T07:20:18.298Z',
    message: `### Paddy / Rice Advisory
- **Water Management**: Maintain 3-5 cm standing water during panicle formation.
- **Disease Scouting**: Spray Propiconazole 25% EC @ 1 ml/L if sheath blight symptoms appear.
- **Nutrient Boost**: Apply 20 kg Potash per acre for improved grain filling.`,
    userId: null,
    crop: {
      id: 37,
      name: 'Rice',
      scientificName: 'Oryza sativa',
      duration: '120-150 days',
      waterRequirement: 'High'
    }
  },
  {
    id: 3,
    location: 'Nagpur, Maharashtra',
    stage: 'Square & Boll Formation',
    status: 'active',
    date: '2026-10-16T07:20:18.298Z',
    message: `### Cotton Protection Advisory
- **Pest Surveillance**: Install pheromone traps (5 traps/ha) for pink bollworm monitoring.
- **Foliar Nutrition**: Apply 2% DAP foliar spray to prevent square and boll drop.
- **Soil Moisture**: Avoid water stagnation in root zones.`,
    userId: null,
    crop: {
      id: 11,
      name: 'Cotton(lint)',
      scientificName: 'Gossypium hirsutum',
      duration: '150-180 days',
      waterRequirement: 'Medium'
    }
  },
  {
    id: 4,
    location: 'Agra, Uttar Pradesh',
    stage: 'Tuber Bulking',
    status: 'active',
    date: '2026-10-16T07:20:18.298Z',
    message: `### Potato Agronomic Care
- **Earthing Up**: Mandatory earthing up to prevent sunlight exposure and tuber greening.
- **Moisture**: Maintain uniform soil moisture; avoid flood irrigation to prevent tuber rot.
- **Late Blight**: Preventative spray of Mancozeb @ 2 g/L during cool cloudy spells.`,
    userId: null,
    crop: {
      id: 34,
      name: 'Potato',
      scientificName: 'Solanum tuberosum',
      duration: '90-110 days',
      waterRequirement: 'Medium'
    }
  }
];

export const getAdvisories = async (req: Request, res: Response) => {
  try {
    const { userEmail } = req.query;
    const cleanEmail = userEmail ? String(userEmail).trim().toLowerCase() : null;

    let targetUserId: number | null = null;
    if (cleanEmail) {
      try {
        const user = await prisma.user.findFirst({
          where: { email: { equals: cleanEmail, mode: 'insensitive' } },
        });
        if (user) {
          targetUserId = user.id;
        }
      } catch (userErr: any) {
        console.warn('⚠️ User lookup transient DB issue, continuing to fetch advisories:', userErr.message);
      }
    }

    let whereClause: any = {};
    if (targetUserId) {
      whereClause.userId = targetUserId;
    }

    let advisories: any[] = [];
    try {
      advisories = await prisma.cropAdvisory.findMany({
        where: whereClause,
        include: {
          crop: true,
        },
        orderBy: {
          date: 'desc',
        },
      });
    } catch (dbErr: any) {
      console.warn('⚠️ First attempt to fetch advisories failed, retrying once in 500ms...', dbErr.message);
      await new Promise(r => setTimeout(r, 500));
      advisories = await prisma.cropAdvisory.findMany({
        where: whereClause,
        include: {
          crop: true,
        },
        orderBy: {
          date: 'desc',
        },
      });
    }

    // If this specific user has no personal advisories yet, return public benchmark advisories
    // so they have sample agronomy plans to explore!
    if (advisories.length === 0) {
      try {
        const publicAdvisories = await prisma.cropAdvisory.findMany({
          where: { userId: null },
          include: {
            crop: true,
          },
          orderBy: {
            date: 'desc',
          },
        });
        if (publicAdvisories.length > 0) {
          return res.json(publicAdvisories);
        }
      } catch {
        // Fallback gracefully below
      }
    }

    res.json(advisories.length > 0 ? advisories : FALLBACK_ADVISORIES);
  } catch (error: any) {
    console.error('Error fetching advisories, serving resilient fallback:', error.message);
    res.json(FALLBACK_ADVISORIES);
  }
};

export const createAdvisory = async (req: Request, res: Response) => {
  try {
    const { cropId, location, stage, status, message: initialMessage, userEmail, area, soil, irrigation } = req.body;

    let userId = null;
    if (userEmail) {
      // Sync user from frontend/Clerk to our DB
      const user = await prisma.user.upsert({
        where: { email: userEmail },
        update: {},
        create: {
          email: userEmail,
          name: userEmail.split('@')[0] // Default name from email
        }
      });
      userId = user.id;
    }

    // Fetch or ensure Crop exists for foreign key constraint
    let validCropId = Number(cropId);
    let targetCropName = req.body.cropName || 'Selected Crop';

    let crop = null;
    if (cropId && !isNaN(validCropId)) {
      crop = await prisma.crop.findUnique({ where: { id: validCropId } });
    }

    if (!crop && req.body.cropName) {
      crop = await prisma.crop.findFirst({
        where: { name: { equals: String(req.body.cropName), mode: 'insensitive' } }
      });
    }

    if (!crop && req.body.cropName) {
      crop = await prisma.crop.create({
        data: {
          name: String(req.body.cropName),
          description: `AI Recommended Crop for ${location || 'Indian Agriculture'}`
        }
      });
    }

    if (crop) {
      validCropId = crop.id;
      targetCropName = crop.name;
    } else {
      const anyCrop = await prisma.crop.findFirst();
      if (anyCrop) {
        validCropId = anyCrop.id;
        targetCropName = anyCrop.name;
      } else {
        const newCrop = await prisma.crop.create({
          data: { name: 'Rice', description: 'Default Agricultural Crop' }
        });
        validCropId = newCrop.id;
        targetCropName = newCrop.name;
      }
    }

    // Generate AI Advice
    let finalMessage = initialMessage;
    try {
      const aiPlan = await generateFarmingPlan(
        targetCropName,
        location,
        soil || "Local Soil Conditions",
        area || "Standard Farm Size",
        irrigation || "Standard Irrigation"
      );
      if (aiPlan) {
        finalMessage = aiPlan;
      }
    } catch (aiErr: any) {
      console.warn('⚠️ Gemini advisory plan generation fallback:', aiErr.message);
    }

    const advisory = await prisma.cropAdvisory.create({
      data: {
        cropId: validCropId,
        location: location || 'Field Location',
        stage: stage || 'Preparation',
        status: status || 'active',
        message: finalMessage,
        userId
      },
      include: {
        crop: true
      }
    });
    res.status(201).json(advisory);
  } catch (error) {
    console.error('Error creating advisory:', error);
    res.status(500).json({ error: 'Failed to create advisory' });
  }
};

export const deleteAdvisory = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await prisma.cropAdvisory.delete({
      where: { id: Number(id) }
    });
    res.json({ message: 'Advisory deleted successfully' });
  } catch (error) {
    console.error('Error deleting advisory:', error);
    res.status(500).json({ error: 'Failed to delete advisory' });
  }
};
