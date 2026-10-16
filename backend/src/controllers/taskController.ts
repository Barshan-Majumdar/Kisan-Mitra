import { Request, Response } from 'express';
import prisma from '../prisma';

export const getTasks = async (req: Request, res: Response) => {
  try {
    const { userEmail } = req.query;
    let whereClause: any = {};

    if (userEmail) {
      let user = await prisma.user.findUnique({
        where: { email: String(userEmail) }
      });
      if (!user) {
        user = await prisma.user.create({
          data: {
            email: String(userEmail),
            name: String(userEmail).split('@')[0]
          }
        });
      }
      whereClause.userId = user.id;

      // Check if user has any tasks; if 0, create realistic seasonal field directives!
      const userTaskCount = await prisma.task.count({ where: { userId: user.id } });
      if (userTaskCount === 0) {
        const now = new Date();
        const twoDays = new Date(now.getTime() + 2 * 24 * 60 * 60 * 1000);
        const fourDays = new Date(now.getTime() + 4 * 24 * 60 * 60 * 1000);
        const sevenDays = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

        await prisma.task.createMany({
          data: [
            {
              userId: user.id,
              category: 'Preparation',
              task: 'Pre-Sowing Weed Management & Bio-Herbicide Treatment',
              dueDate: twoDays,
              completed: false
            },
            {
              userId: user.id,
              category: 'Irrigation',
              task: 'Calibrate Micro-Drip Emitter Pressure for Zone B',
              dueDate: fourDays,
              completed: false
            },
            {
              userId: user.id,
              category: 'Nutrient',
              task: 'Execute Soil Micronutrient Foliar Nourishment Cycle',
              dueDate: sevenDays,
              completed: false
            }
          ]
        });
      }
    }

    const tasks = await prisma.task.findMany({
      where: whereClause,
      orderBy: [
        { completed: 'asc' },
        { dueDate: 'asc' }
      ],
    });
    res.json(tasks);
  } catch (error: any) {
    console.warn('⚠️ Database temporarily sleeping/unreachable, serving default agronomic tasks:', error.message || error);
    const now = new Date();
    res.json([
      {
        id: 1,
        category: 'Preparation',
        task: 'Pre-Sowing Weed Management & Bio-Herbicide Treatment',
        dueDate: new Date(now.getTime() + 2 * 24 * 3600 * 1000),
        completed: false
      },
      {
        id: 2,
        category: 'Irrigation',
        task: 'Calibrate Micro-Drip Emitter Pressure for Zone B',
        dueDate: new Date(now.getTime() + 4 * 24 * 3600 * 1000),
        completed: false
      },
      {
        id: 3,
        category: 'Nutrient',
        task: 'Execute Soil Micronutrient Foliar Nourishment Cycle',
        dueDate: new Date(now.getTime() + 7 * 24 * 3600 * 1000),
        completed: false
      }
    ]);
  }
};
export const toggleTask = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const task = await prisma.task.findUnique({ where: { id: Number(id) } });

    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    const updatedTask = await prisma.task.update({
      where: { id: Number(id) },
      data: {
        completed: !task.completed,
      },
    });
    res.json(updatedTask);
  } catch (error) {
    console.error('Error updating task:', error);
    res.status(500).json({ error: 'Failed to update task' });
  }
};

export const createTask = async (req: Request, res: Response) => {
  try {
    const { category, task, dueDate, userEmail } = req.body;

    let userId = null;
    if (userEmail) {
      const user = await prisma.user.findUnique({ where: { email: userEmail } });
      if (user) userId = user.id;
    }

    const newTask = await prisma.task.create({
      data: {
        category,
        task,
        dueDate: new Date(dueDate),
        completed: false,
        userId
      },
    });
    res.status(201).json(newTask);
  } catch (error) {
    console.error('Error creating task:', error);
    res.status(500).json({ error: 'Failed to create task' });
  }
};
