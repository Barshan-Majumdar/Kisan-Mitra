import { Request, Response } from 'express';
import { chatWithAssistant } from '../services/geminiService';

export const handleChat = async (req: Request, res: Response) => {
    try {
        const { message, history } = req.body;

        if (!message) {
            res.status(400).json({ error: "Message is required" });
            return;
        }

        // Limit history to last 10 messages to save tokens context
        const recentHistory = Array.isArray(history) ? history.slice(-10) : [];

        const reply = await chatWithAssistant(message, recentHistory);
        res.json({ reply });
    } catch (error) {
        console.error("Chat Controller Error:", error);
        res.status(500).json({ error: "Failed to process chat message" });
    }
};
