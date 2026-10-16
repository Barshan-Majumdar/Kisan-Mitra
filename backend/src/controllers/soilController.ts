import { Request, Response } from 'express';
import prisma from '../prisma';

export const saveSoilData = async (req: Request, res: Response) => {
  const { userId, nitrogen, phosphorus, potassium, ph, location } = req.body;
  try {
    const soilData = await prisma.soilData.create({
      data: {
        userId,
        nitrogen,
        phosphorus,
        potassium,
        ph,
        location,
      },
    });
    res.json(soilData);
  } catch (error) {
    res.status(500).json({ error: 'Failed to save soil data' });
  }
};

export const getSoilData = async (req: Request, res: Response) => {
  const { userId, district } = req.query;
  try {
    if (district) {
      // Infer soil from DistrictCrop table
      const districtEntry = await prisma.districtCrop.findFirst({
        where: { district: String(district) },
        include: { soilType: true }
      });

      if (districtEntry) {
        return res.json({
          soilType: districtEntry.soilType.name,
          ph: 6.5, // Generic defaults
          nitrogen: 90,
          phosphorus: 42,
          potassium: 43,
          description: districtEntry.soilType.description
        });
      }
    }

    const soilData = await prisma.soilData.findMany({
      where: userId ? { userId: Number(userId) } : undefined,
    });
    res.json(soilData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch soil data' });
  }
};
