import { Request, Response } from 'express';
import prisma from '../prisma';

export const getTasks = async (req: Request, res: Response) => {
  try {
    const { userEmail } = req.query;
    let whereClause: any = {};

    if (userEmail) {
      const user = await prisma.user.findUnique({
        where: { email: String(userEmail) }
      });
      if (user) {
        whereClause.userId = user.id;
      } else {
        // New user with no tasks yet
        return res.json([]);
      }
    }

    const tasks = await prisma.task.findMany({
      where: whereClause,
      orderBy: {
        dueDate: 'asc',
      },
    });
    res.json(tasks);
  } catch (error) {
    console.error('Error fetching tasks:', error);
    res.status(500).json({ error: 'Failed to fetch tasks' });
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
