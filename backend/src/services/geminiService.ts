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
        cropModel = cropGenAI.getGenerativeModel({ model: "gemini-3.6-flash" });
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
        chatModel = chatGenAI.getGenerativeModel({ model: "gemini-3.6-flash" });
        console.log("✅ Chat AI model initialized successfully");
    } catch (error) {
        console.error("Error initializing Chat Gemini AI:", error);
    }
} else {
    console.warn("⚠️ GEMINI_CHAT_API_KEY (or GEMINI_API_KEY) is not set. Chatbot will be offline.");
}

/**
 * Comprehensive Agricultural Science Knowledge Fallback
 * Generates actionable, tailored agronomic guides when external LLM API quota is exceeded or unavailable.
 */
function generateExpertFarmingPlan(
    crop: string,
    location: string,
    soil: string,
    area: string,
    irrigation: string
): string {
    const cLower = crop.toLowerCase();
    
    // Category-specific agronomic advice
    let seedRate = "20-25 kg/ha";
    let spacing = "30 cm x 10 cm";
    let npkRatio = "120:60:40 kg/ha N:P2O5:K2O";
    let criticalIrrigations = "Crown root initiation, Tillering, Flowering, and Grain Filling stages";
    let keyPests = "Aphids, Stem borer, and Leaf blight";
    let organicPrep = "Apply 8-10 tonnes/ha of decomposed Farm Yard Manure (FYM) 3 weeks prior to sowing.";

    if (cLower.includes('wheat')) {
        seedRate = "100-125 kg/ha of certified high-yielding varieties (e.g., HD-2967, PBW-343)";
        spacing = "20-22.5 cm between rows, 5 cm depth";
        npkRatio = "120:60:40 kg/ha (50% N + 100% P & K basal, 50% N top-dressed in 2 splits)";
        criticalIrrigations = "First irrigation at CRI stage (21 DAS) is critical, followed by Tillering (40 DAS), Jointing (65 DAS), Flowering (85 DAS), and Milk stage (105 DAS)";
        keyPests = "Yellow/Brown rust (treat with Propiconazole 25 EC @ 1ml/L) and Aphids (spray Dimethoate 30 EC @ 1.5ml/L)";
    } else if (cLower.includes('rice') || cLower.includes('paddy')) {
        seedRate = "20-25 kg/ha for nursery transplanting (or 40-50 kg/ha for direct seeded rice DSR)";
        spacing = "20 cm x 15 cm with 2-3 seedlings per hill";
        npkRatio = "120:50:50 kg/ha plus 25 kg/ha Zinc Sulfate basal";
        criticalIrrigations = "Maintain 2-3 cm standing water during transplanting and tillering; avoid moisture stress at panicle initiation and flowering";
        keyPests = "Yellow stem borer (Cartap Hydrochloride 4G @ 25 kg/ha) and Bacterial Leaf Blight (Streptocycline 100 ppm)";
    } else if (cLower.includes('cotton')) {
        seedRate = "2.5-3.0 kg/ha for Bt Cotton hybrids";
        spacing = "90 cm x 60 cm (or 67.5 cm x 45 cm in high density)";
        npkRatio = "150:60:60 kg/ha with foliar 2% DAP at square and flowering stages";
        criticalIrrigations = "Squaring, flowering, and boll development stages (drip irrigation saves 40% water)";
        keyPests = "Pink bollworm (pheromone traps @ 5/ha + Emamectin benzoate @ 0.4g/L) and sucking pests like jassids/whitefly (Imidacloprid 17.8 SL @ 0.3ml/L)";
    } else if (cLower.includes('maize')) {
        seedRate = "18-20 kg/ha for single cross hybrids";
        spacing = "60 cm x 20 cm";
        npkRatio = "120:60:40 kg/ha plus 15 kg/ha Zinc Sulfate";
        criticalIrrigations = "Knee-high stage, tasseling, silking, and grain filling stages";
        keyPests = "Fall Armyworm (FAW) - monitor whorls; spray Chlorantraniliprole 18.5 SC @ 0.4ml/L if egg masses seen";
    } else if (cLower.includes('gram') || cLower.includes('pulse') || cLower.includes('arhar') || cLower.includes('tur') || cLower.includes('moong') || cLower.includes('urad')) {
        seedRate = "15-20 kg/ha (treated with Rhizobium culture & Trichoderma viride @ 4g/kg)";
        spacing = "30-45 cm x 10 cm";
        npkRatio = "20:50:20 kg/ha starter dose (legumes fix atmospheric nitrogen via root nodules)";
        criticalIrrigations = "1-2 protective irrigations at pre-flowering and pod formation (avoid over-irrigation)";
        keyPests = "Pod borer (Helicoverpa armigera) - install pheromone traps @ 8/ha and spray Spinosad 45 SC @ 0.3ml/L";
    } else if (cLower.includes('potato')) {
        seedRate = "2.5-3.0 tonnes/ha of disease-free seed tubers (30-40g each with 2-3 active eyes)";
        spacing = "60 cm between ridges x 20 cm between tubers";
        npkRatio = "150:100:120 kg/ha (high potash demand for tuber development)";
        criticalIrrigations = "Stolon formation, tuber initiation, and tuber bulking (earthing up at 30 and 45 DAS is mandatory)";
        keyPests = "Late blight (spray Mancozeb 75 WP @ 2.5g/L preventive, Cymoxanil + Mancozeb curative) and Potato tuber moth";
    } else if (cLower.includes('onion') || cLower.includes('garlic')) {
        seedRate = "8-10 kg/ha of seed for nursery raising (or 500-600 kg cloves for garlic)";
        spacing = "15 cm x 10 cm on raised beds";
        npkRatio = "100:50:80 kg/ha plus 20 kg/ha Sulfur for pungency";
        criticalIrrigations = "Frequent light irrigations every 7-10 days; stop irrigation 15 days prior to harvest to prevent bulb rot";
        keyPests = "Thrips (spray Fipronil 5 SC @ 1.5ml/L) and Purple blotch disease";
    } else if (cLower.includes('mustard') || cLower.includes('rapeseed')) {
        seedRate = "4-5 kg/ha certified seed";
        spacing = "30 cm x 10-15 cm";
        npkRatio = "80:40:40 kg/ha plus 25 kg/ha elemental Sulfur or Gypsum (essential for oil content)";
        criticalIrrigations = "Branching and siliqua (pod) formation stages";
        keyPests = "Mustard aphids (spray Thiamethoxam 25 WG @ 0.2g/L or Dimethoate 30 EC) and White rust";
    } else if (cLower.includes('sugarcane')) {
        seedRate = "35,000-40,000 two-budded setts per hectare";
        spacing = "90 cm to 120 cm row-to-row in furrows";
        npkRatio = "250:100:120 kg/ha in 3 split doses";
        criticalIrrigations = "Formative stage (tillering) requires irrigation every 8-10 days; trash mulching conserves moisture";
        keyPests = "Early shoot borer, top borer, and red rot disease (treat setts with Carbendazim 50 WP)";
    } else if (cLower.includes('ginger') || cLower.includes('turmeric')) {
        seedRate = "1,800-2,500 kg/ha of healthy mother/finger rhizomes";
        spacing = "30 cm x 20 cm on raised beds (1 m width)";
        npkRatio = "100:50:100 kg/ha with heavy FYM (25 tonnes/ha) and green leaf mulching";
        criticalIrrigations = "Continuous moist root zone; provide proper drainage to prevent rhizome rot";
        keyPests = "Rhizome rot (soil drenching with Metalaxyl-Mancozeb @ 2g/L) and Shoot borer";
    } else if (cLower.includes('banana')) {
        seedRate = "2,500-3,000 tissue culture plantlets or sword suckers per hectare";
        spacing = "1.8 m x 1.8 m (or paired row 1.2 m x 1.2 m x 2.0 m)";
        npkRatio = "200:60:300 g/plant N:P:K through regular fertigation";
        criticalIrrigations = "High water requirement; drip irrigation @ 15-20 liters/plant/day during peak vegetative growth";
        keyPests = "Panama wilt (Fusarium), Sigatoka leaf spot, and Pseudostem weevil";
    }

    return `# Precision Agronomic Advisory Plan for ${crop}

**Target Region**: ${location}  
**Soil Profile**: ${soil}  
**Landholding Scale**: ${area}  
**Irrigation System**: ${irrigation}  
**Scientific Advisory Package**: Central & State Agricultural University Recommendations

---

## 1. Land & Soil Preparation
- **Deep Tillage**: Carry out primary deep ploughing (25–30 cm depth) to break the hard subsoil pan and expose soil-borne pests/pathogens to sunlight.
- **Tilth Refinement**: Follow with 2–3 passes of rotavator or cultivator to achieve a fine, weed-free seedbed tailored for **${soil}**.
- **Organic Enrichment**: ${organicPrep}
- **Soil Conditioning**: For acidic soils (pH < 6.0), incorporate agricultural lime @ 2–3 tonnes/ha; for alkaline soils (pH > 8.0), apply gypsum @ 2–4 tonnes/ha during land preparation.

---

## 2. Seed Selection, Sowing & Plant Density
- **Recommended Seed Rate**: ${seedRate}.
- **Plant Geometry & Spacing**: ${spacing}.
- **Seed Inoculation & Treatment**:
  - Treat seeds with *Trichoderma viride* (@ 4 g/kg seed) or *Carbendazim* (@ 2 g/kg seed) against root rot and damping-off.
  - Inoculate pulse/oilseed crops with species-specific *Rhizobium* and *PSB (Phosphate Solubilizing Bacteria)* cultures to boost biological nitrogen fixation.
- **Sowing Depth**: 3–5 cm in moist seedbed to ensure uniform germination within 5–7 days.

---

## 3. Integrated Nutrient Management (INM)
- **Fertilizer Dosage**: Recommended baseline dosage of **${npkRatio}**.
- **Application Schedule**:
  - **Basal Dose**: Apply 50% Nitrogen along with 100% of Phosphorus (SSP/DAP) and 100% Potassium (MOP) at the time of final harrowing.
  - **First Top-Dressing**: Apply 25% Nitrogen along with irrigation during early tillering / vegetative branching.
  - **Second Top-Dressing**: Apply remaining 25% Nitrogen at panicle/flower bud initiation.
- **Micronutrient Correction**: Apply Zinc Sulfate (21%) @ 25 kg/ha if soil testing indicates zinc deficiency.

---

## 4. Water Management & Irrigation Scheduling
- **Irrigation Regime**: Tailored for **${irrigation}** setup in **${location}**.
- **Critical Growth Stages**: ${criticalIrrigations}.
- **Water Savings**: Avoid standing water or prolonged waterlogging, which induces root hypoxia and fungal wilts. Drip or furrow irrigation is strongly recommended during dry spells.

---

## 5. Integrated Pest & Disease Management (IPM)
- **Preventive Scouting**: Inspect field borders twice weekly for early signs of egg clusters or foliar lesions.
- **Major Threats**: ${keyPests}.
- **Eco-Friendly Interventions**:
  - Install yellow and blue sticky traps (15–20 traps/ha) for sucking insects (aphids, thrips, whiteflies).
  - Spray Neem Oil (1500 ppm) @ 3–5 ml/L of water at the first appearance of insect larvae.
  - Maintain field hygiene by roguing and destroying virus-infected or blighted plant debris.

---

## 6. Maturity Indicators, Harvesting & Safe Storage
- **Harvest Indicators**: Harvest when 80–85% of crop pods/ears/leaves turn golden-yellow or reach botanical physiological maturity.
- **Threshing & Drying**: Sun-dry produce on clean tarpaulins for 3–5 days until grain/seed moisture drops below 10–12%.
- **Safe Warehousing**: Store clean grain in moisture-proof HDPE/jute bags treated with Neem leaves or Malathion dusting to prevent storage weevil attacks.`;
}

export const generateFarmingPlan = async (
    crop: string,
    location: string,
    soil: string,
    area: string = "Unknown",
    irrigation: string = "Standard"
): Promise<string> => {
    // Attempt LLM generation if client is available
    if (cropGenAI) {
        const candidateModels = ["gemini-3.6-flash", "gemini-3.5-flash", "gemini-2.5-flash", "gemini-1.5-flash"];
        for (const modelName of candidateModels) {
            try {
                const model = cropGenAI.getGenerativeModel({ model: modelName });
                const prompt = `
                Act as an expert agricultural scientist. Generate a detailed, step-by-step farming advisory plan for growing "${crop}" in "${location}".
                Soil Type: ${soil}. Farm Area: ${area}. Irrigation Availability: ${irrigation}.

                IMPORTANT FORMATTING RULES:
                1. Always format tables using standard GitHub Flavored Markdown (GFM). Each table row MUST be on its own line with a real newline (not collapsed on one line).
                2. If providing an application schedule or nutrient table, format it as a clean GFM table with columns: Stage | Fertilizer | Dosage | Method.
                3. If drawing ASCII flowcharts, always wrap them inside code blocks (\`\`\`...\`\`\`).
                4. Use clear markdown headers (##), bold terms, and bullet points.

                Please provide the plan in structured markdown:
                # Precision Agronomic Advisory Plan for ${crop}
                ## 1. Land & Soil Preparation
                ## 2. Seed Selection, Sowing & Plant Density
                ## 3. Integrated Nutrient Management (INM)
                ## 4. Water Management & Irrigation Scheduling
                ## 5. Integrated Pest & Disease Management (IPM)
                ## 6. Maturity Indicators, Harvesting & Safe Storage
                `;
                const result = await model.generateContent(prompt);
                const response = await result.response;
                let text = response.text();
                if (text && text.trim().length > 100) {
                    // Sanitize escaped newlines
                    text = text.replace(/\\r\\n/g, '\n').replace(/\\n/g, '\n').trim();
                    return text;
                }
            } catch (err: any) {
                // If permission denied (403), quota exceeded (429), or model not found (404), fall back to next model or expert engine
                console.warn(`[Gemini API] Model ${modelName} call skipped: ${err.message?.slice(0, 80)}`);
            }
        }
    }

    // Comprehensive expert agronomic fallback ensuring 100% reliability
    console.log(`🌾 Generating Expert Agronomic Advisory Plan for ${crop} in ${location}...`);
    return generateExpertFarmingPlan(crop, location, soil, area, irrigation);
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

