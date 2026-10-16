import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';

dotenv.config();

// Separate API keys for different features
// Falls back to GEMINI_API_KEY if specific keys aren't set
const CROP_API_KEY = process.env.GEMINI_CROP_API_KEY || process.env.GEMINI_API_KEY;
const CHAT_API_KEY = process.env.GEMINI_CHAT_API_KEY || process.env.GEMINI_API_KEY;

// Initialize separate instances for crop features and chatbot
let cropGenAI: GoogleGenerativeAI | null = null;
let cropModel: any = null;

let chatGenAI: GoogleGenerativeAI | null = null;
let chatModel: any = null;

// Initialize Crop/Farming AI model
if (CROP_API_KEY) {
    try {
        cropGenAI = new GoogleGenerativeAI(CROP_API_KEY);
        cropModel = cropGenAI.getGenerativeModel({ model: "gemini-2.5-flash" });
        console.log("✅ Crop AI model initialized successfully");
    } catch (error) {
        console.error("Error initializing Crop Gemini AI:", error);
    }
} else {
    console.warn("⚠️ GEMINI_CROP_API_KEY (or GEMINI_API_KEY) is not set. Crop features will use fallback text.");
}

// Initialize Chatbot AI model
if (CHAT_API_KEY) {
    try {
        chatGenAI = new GoogleGenerativeAI(CHAT_API_KEY);
        chatModel = chatGenAI.getGenerativeModel({ model: "gemini-2.5-flash" });
        console.log("✅ Chat AI model initialized successfully");
    } catch (error) {
        console.error("Error initializing Chat Gemini AI:", error);
    }
} else {
    console.warn("⚠️ GEMINI_CHAT_API_KEY (or GEMINI_API_KEY) is not set. Chatbot will be offline.");
}

export const generateFarmingPlan = async (
    crop: string,
    location: string,
    soil: string,
    area: string = "Unknown",
    irrigation: string = "Standard"
): Promise<string> => {
    if (!cropModel) {
        return `Detailed AI farming plan could not be generated (Missing API Key). 
        
        Standard Guidance for ${crop}:
        1. Ensure proper land preparation.
        2. Use recommended seeds.
        3. Maintain moisture levels.
        4. Harvest at maturity.`;
    }

    const prompt = `
    Act as an expert agricultural advisor. Generate a detailed, step-by-step farming plan for growing "${crop}" in "${location}".
    Soil Type: ${soil}. Farm Area: ${area}. Irrigation Availability: ${irrigation}.

    Please provide the plan in the following markdown structure:
    # Farming Plan for ${crop}

    ## 1. Soil Preparation
    (Advice on preparing ${soil} soil)

    ## 2. Sowing & Planting
    (Best time, seed rate, spacing)

    ## 3. Nutrient Management
    (Fertilizer schedule)

    ## 4. Water Management
    (Irrigation needs)

    ## 5. Disease & Pest Management
    (Common threats in ${location} and remedies)

    ## 6. Harvesting
    (Signs of maturity)

    Keep it actionable and concise.
    `;

    try {
        const result = await cropModel.generateContent(prompt);
        const response = await result.response;
        return response.text();
    } catch (error) {
        console.error("Gemini Crop Generation Error:", error);
        return `Detailed AI farming plan generation failed. 
        
        Standard Guidance for ${crop}:
        1. Ensure proper land preparation.
        2. Use recommended seeds.
        3. Maintain moisture levels.
        4. Harvest at maturity.`;
    }
};

export const chatWithAssistant = async (message: string, history: any[] = []): Promise<string> => {
    if (!chatModel) {
        return "I am currently offline or missing my API key. Please check the system configuration.";
    }

    const systemPrompt = `
        You are an expert Agricultural Advisor AI. 
        Your goal is to assist farmers with detailed, accurate, and scientific advice regarding:
        - Crop cultivation (sowing, irrigation, fertilizers, pests, harvesting)
        - Soil health and management
        - Weather impacts on farming
        - Government schemes for farmers in India
        - Market prices and trends
        - Livestock management (if asked)

        STRICT RULE: 
        If a user asks about anything NOT related to agriculture, farming, or rural livelihoods, you MUST politely decline.
        Example decline: "I specialize only in agriculture and farming advice. I cannot answer general queries."
        
        Keep answers concise, actionable, and easy to understand for a farmer.
    `;

    try {
        const chat = chatModel.startChat({
            history: [
                {
                    role: "user",
                    parts: [{ text: systemPrompt }],
                },
                {
                    role: "model",
                    parts: [{ text: "Understood. I am ready to act as an expert Agricultural Advisor. I will strictly answer only farming-related queries." }],
                },
                ...history.map(msg => ({
                    role: msg.sender === 'user' ? 'user' : 'model',
                    parts: [{ text: msg.text }]
                }))
            ],
            generationConfig: {
                maxOutputTokens: 500,
            },
        });

        const result = await chat.sendMessage(message);
        const response = await result.response;
        return response.text();
    } catch (error) {
        console.error("Gemini Chat Error:", error);
        return "I encountered an error processing your request. Please try again.";
    }
};

