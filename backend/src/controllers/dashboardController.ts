import { Request, Response } from 'express';
import prisma from '../prisma';

export const getUserStats = async (req: Request, res: Response) => {
  try {
    const { userEmail } = req.query;

    if (!userEmail) {
      return res.status(400).json({ error: 'userEmail is required' });
    }

    const user = await prisma.user.findUnique({
      where: { email: String(userEmail) }
    });

    if (!user) {
      // Return empty stats for new users
      return res.json({
        totalTasks: 0,
        pendingTasks: 0,
        completedTasks: 0,
        activeAdvisories: 0,
        totalAdvisories: 0
      });
    }

    const stats = {
      totalTasks: await prisma.task.count({ where: { userId: user.id } }),
      pendingTasks: await prisma.task.count({ where: { userId: user.id, completed: false } }),
      completedTasks: await prisma.task.count({ where: { userId: user.id, completed: true } }),
      activeAdvisories: await prisma.cropAdvisory.count({ where: { userId: user.id, status: 'active' } }),
      totalAdvisories: await prisma.cropAdvisory.count({ where: { userId: user.id } })
    };

    res.json(stats);
  } catch (error) {
    console.warn('⚠️ Database offline, returning default user stats:', error);
    res.json({
      totalTasks: 0,
      pendingTasks: 0,
      completedTasks: 0,
      activeAdvisories: 0,
      totalAdvisories: 0
    });
  }
};
