import { Request, Response } from 'express';
import prisma from '../prisma';

export const getSchemes = async (req: Request, res: Response) => {
  try {
    const schemes = await prisma.governmentScheme.findMany();
    res.json(schemes);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch schemes' });
  }
};
