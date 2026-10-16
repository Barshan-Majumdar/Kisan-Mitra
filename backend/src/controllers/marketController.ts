import { Request, Response } from 'express';
import prisma from '../prisma';

export const getMarketPrices = async (req: Request, res: Response) => {
  try {
    const { district } = req.query;
    let whereClause: any = {};
    
    if (district) {
      whereClause.district = String(district);
    }

    const prices = await prisma.marketPrice.findMany({
      where: whereClause,
      include: {
        crop: true,
      },
      orderBy: {
        date: 'desc',
      },
    });
    res.json(prices);
  } catch (error) {
    console.error('Error fetching market prices:', error);
    res.status(500).json({ error: 'Failed to fetch market prices' });
  }
};
