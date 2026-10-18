# 🌾 Kisan Mitra (किसान मित्र)

> **Next-Generation AI Agricultural Advisory, Farm Management & Precision Intelligence Platform**

[![React](https://img.shields.io/badge/Frontend-React%2019-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/Language-TypeScript-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Styling-Tailwind%20CSS%20v4-38B2AC?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Node.js](https://img.shields.io/badge/Backend-Node.js%20%7C%20Express-339933?logo=node.js&logoColor=white)](https://nodejs.org/)
[![PostgreSQL](https://img.shields.io/badge/Database-PostgreSQL%20%7C%20Prisma-4169E1?logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![Python](https://img.shields.io/badge/AI%20Microservice-FastAPI%20%7C%20PyTorch-3776AB?logo=python&logoColor=white)](https://fastapi.tiangolo.com/)
[![Google Gemini](https://img.shields.io/badge/GenAI-Google%20Gemini-8E75C2?logo=google&logoColor=white)](https://aistudio.google.com/)
[![License: ISC](https://img.shields.io/badge/License-ISC-blue.svg)](LICENSE)

**Kisan Mitra** is an end-to-end, full-stack agricultural advisory platform built to empower Indian farmers and agricultural practitioners with data-driven decision-making. By integrating computer vision (PyTorch), machine learning (Random Forest / APY statistics), live government datasets (`data.gov.in`), and Google Gemini GenAI, Kisan Mitra bridges the gap between agricultural science and field-level execution.

---

## 🚀 Key Features

*   **🍂 AI Crop Disease Diagnosis**: Real-time leaf pathology diagnosis using a fine-tuned **EfficientNet-B0** deep learning model across 38 crop disease classes. Features dual-mode execution (FastAPI microservice with automated direct PyTorch CLI fallback), visual confidence scoring, chemical prescriptions, and biological cure recommendations.
*   **🌾 Smart Crop Recommendation & Yield Forecast**: Recommends optimal crops based on soil nutrients (N, P, K, pH), rainfall, temperature, season, and district. Predicts projected agricultural yield (Quintals/Hectare) accompanied by Gemini agronomic guidance.
*   **🧪 Soil Health Calibration**: Interactive Soil Health Card calibration tool. Allows farmers to input macro/micronutrient levels (Nitrogen, Phosphorus, Potassium, Soil pH, Organic Carbon) to calculate target deficits and compute custom fertilizer dosages.
*   **📈 Real-Time Mandi Market Intelligence**: Live APMC market price discovery integrated with official `data.gov.in` Mandi data. Highlights commodity price trends, wholesale rate ranges, and profitable selling windows.
*   **🏛️ Government Welfare Schemes & Subsidies**: Centralized, searchable repository of national and state schemes (PM-KISAN, PMFBY, KCC, Soil Health Card, PMKSY). Provides eligibility criteria and direct one-click links to apply on official government portals.
*   **🌦️ Hyperlocal Weather Telemetry**: Up-to-date weather forecasts including temperature, humidity, precipitation likelihood, wind metrics, and proactive farm warnings.
*   **🤖 Multilingual Gemini Farm Copilot**: 24/7 interactive agricultural assistant powered by Google Gemini, answering queries on pest management, irrigation schedules, and seasonal practices in conversational language.
*   **🎨 Editorial Agronomy Design System**: Tailored agricultural interface featuring Fraunces serif display, IBM Plex Mono technical telemetry badges, paper noise textures, and ultra-responsive layout engineering.
*   **⚡ Interactive 4-Step Pipeline Simulator**: Real-time interactive agronomy demo directly on the landing page simulating soil calibration, satellite NDVI telemetry, leaf pathology diagnosis, and APMC market yields.
*   **🌐 Seamless Bilingual Support**: Full English and Bengali (`বাং`) localization across the platform with one-click navbar toggle.
*   **🔐 Secure Authentication**: Frictionless, secure user authentication and profile management powered by **Clerk**.

---

## 🛠️ Technology Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend** | [React 19](https://react.dev/), [TypeScript](https://www.typescriptlang.org/), [Vite](https://vitejs.dev/) (Rollup Code Splitting), [Tailwind CSS v4](https://tailwindcss.com/), Fraunces & IBM Plex Mono Typography, [Lucide React](https://lucide.dev/), [Clerk Auth](https://clerk.com/), [React Router DOM](https://reactrouter.com/) |
| **Backend API Gateway** | [Node.js](https://nodejs.org/), [Express.js](https://expressjs.com/), [TypeScript](https://www.typescriptlang.org/), [Prisma ORM](https://www.prisma.io/), [Axios](https://axios-http.com/) |
| **Database** | [PostgreSQL](https://www.postgresql.org/) (Compatible with Neon, Supabase, AWS RDS, Local) |
| **AI Vision Microservice** | [Python 3.10+](https://www.python.org/), [FastAPI](https://fastapi.tiangolo.com/), [Uvicorn](https://www.uvicorn.org/), [PyTorch](https://pytorch.org/), [Torchvision](https://pytorch.org/vision/), [timm](https://github.com/huggingface/pytorch-image-models) |
| **Generative AI** | [Google Gemini API](https://aistudio.google.com/) (`gemini-2.0-flash` / `gemini-1.5-flash`) |
| **External Datasets** | [data.gov.in](https://data.gov.in/) (Mandi Prices & Government Schemes) |

---

## 🧪 Model Testing & Evaluation

Three models were explored for plant disease classification: two pretrained models and one custom-trained YOLO11m classifier.

### 🤖 Models Evaluated

| Model | Architecture | Classes | Status | Repository |
| :--- | :--- | :---: | :---: | :--- |
| **AgriSmart AI India v1** | DINOv2 ViT-B/14 | 387 | Tested | [GitHub](https://github.com/Vatsal2008/AgriSmart-AI) |
| **Plant Disease Classifier** | EfficientNet-B0 | 38 | Tested (Active Model) | [GitHub](https://github.com/pavanmanjunath18/Plant_Disease_Classifier) |
| **Custom Crop Disease Classifier** | YOLO11m-cls | 75 | Trained and evaluated | [Ultralytics](https://github.com/ultralytics/ultralytics) |

### 📂 Dataset References

*   **Multi-Crop Disease Dataset**: [Mendeley Data](https://data.mendeley.com/datasets/6243z8r6t6/1)
*   **15-Crop Disease Dataset**: [Mendeley Data](https://data.mendeley.com/datasets/8fr7grr73p/1)
*   **PlantVillage Dataset**: [Kaggle](https://www.kaggle.com/datasets/abdallahalidev/plantvillage-dataset)

### 🛠️ Technologies Used

*   [Python](https://www.python.org/)
*   [PyTorch](https://pytorch.org/)
*   [Ultralytics YOLO](https://docs.ultralytics.com/)
*   [Hugging Face timm](https://github.com/huggingface/pytorch-image-models)
*   [Google Colab](https://colab.research.google.com/)

### 📝 Evaluation Notes

*   The pretrained models were tested using leaf images, and their top predictions and confidence scores were recorded. The custom YOLO11m model was trained on a unified 75-class dataset.
*   Predictions can vary with image quality, crop species, background, and training data. High confidence does not guarantee a correct diagnosis; validation using correctly labelled, unseen images is necessary.

> **Note:** The custom YOLO11m checkpoint was not recovered after the Colab runtime disconnected. The pretrained model repositories and dataset links above are provided for reference. Check each project's license before redistributing its model weights or dataset images.

---

## 🌾 Crop Prediction & Yield Data Sources

Documentation and provenance of datasets evaluated and utilized for crop recommendation and agricultural yield prediction models.

### 📥 Actual Data Source
*   **Direct Raw Dataset**: [GitHub copy of Kaggle "Crop Production in India" CSV](https://raw.githubusercontent.com/surajs2005/-Crop-Production-in-India-project-/HEAD/crop_production.csv)
*   **Repository Page**: [surajs2005/-Crop-Production-in-India-project-](https://github.com/surajs2005/-Crop-Production-in-India-project-)
*   *Note*: Downloaded and cleaned for the model. This is a third-party copy of government Area, Production, and Yield (APY) statistics rather than an extract directly from the official portal.

### 🏛️ Official Sources (Original Upstream Data)
Reference portals where the official APY statistics originate:
*   **Area Production Yield (APY)**: [India Data Portal APY Dataset](https://ckandev.indiadataportal.com/dataset/area-production-yield-apy)
*   **Official APY Extraction Portal**: [DES Agri Portal](https://data.desagri.gov.in/login) *(Authentication required)*
*   **Ministry of Agriculture & Farmers Welfare (DES)**: [DES Agriculture Page](https://desagri.gov.in/?p=3537)
*   **Agricultural Statistics at a Glance**: [Area, Production & Yield of Principal Crops Report](https://desagri.gov.in/documents-reports/agricultural-statistics-at-a-glance-2007/4-area-production-and-yield-of-principal-crops/)

### 🧪 Supplementary Soil & Climate Reference Sources
Sources evaluated for soil nutrient (N, P, K, pH) and micro-climatic parameters:
*   **Soil Health Card Dataset**: [India Data Portal Soil Health Card](https://ckandev.indiadataportal.com/dataset/soil-health-card) *(Official portal: [soilhealth.dac.gov.in](https://soilhealth.dac.gov.in/))*
*   **ICRISAT District-Level Data**: [Mendeley Data Repository](https://data.mendeley.com/datasets/ywp3y5j9vv)
*   **TCI & ICRISAT District-Level Database**: [Tata-Cornell Institute (TCI) Database](https://tci.cornell.edu/data)
*   **Database Partnership Overview**: [ICRISAT Press Release on Indian Food Systems Data](https://pressroom.icrisat.org/tci-and-icrisat-continue-partnership-to-improve-access-to-indian-food-systems-data)

---

## 🏁 Getting Started

Follow these step-by-step instructions to set up Kisan Mitra locally.

### Prerequisites

*   **Node.js**: v18.0.0 or higher
*   **npm** or **yarn**
*   **Python**: v3.10 or higher with `pip`
*   **PostgreSQL**: Running locally or via cloud provider (e.g. Neon, Supabase)
*   **Clerk Account**: For authentication credentials ([clerk.com](https://clerk.com/))
*   **Google AI Studio API Key**: For Gemini AI ([aistudio.google.com](https://aistudio.google.com/))

---

### Installation & Local Setup

#### 1. Clone Repository
```bash
git clone https://github.com/Barshan-Majumdar/Kisan-Mitra.git
cd Kisan-Mitra
```

#### 2. Backend Setup
```bash
cd backend
npm install
```
*   Create `.env` inside `backend/` (refer to `.env.example`):
    ```env
    DATABASE_URL="postgresql://username:password@localhost:5432/kisan_mitra?schema=public"
    PORT=3000
    NODE_ENV=development
    GEMINI_API_KEY="your_gemini_api_key_here"
    CROP_PREDICTION_API_URL="http://127.0.0.1:8000/predict"
    ```
*   Run database migrations:
    ```bash
    npx prisma migrate dev
    ```
*   Start the backend server:
    ```bash
    npm run dev
    ```

#### 3. AI Vision & Inference Service Setup
```bash
cd ../ai-service
pip install -r requirements.txt
python main.py
```
*(The FastAPI microservice will launch on `http://127.0.0.1:8000`)*

#### 4. Frontend Setup
```bash
cd ../frontend
npm install
```
*   Create `.env` inside `frontend/` (refer to `.env.example`):
    ```env
    VITE_CLERK_PUBLISHABLE_KEY="pk_test_your_clerk_key_here"
    VITE_API_URL="http://localhost:3000/api"
    ```
*   Start the development server:
    ```bash
    npm run dev
    ```

#### 5. Access the Application
Open your browser and navigate to:
```
http://localhost:5173
```

---

## 📂 Project Structure

```
Kisan-Mitra/
├── ai-service/                     # Python AI & Computer Vision microservice
│   ├── main.py                     # FastAPI endpoints (/predict, /predict-disease)
│   ├── predict_disease.py          # PyTorch EfficientNet-B0 inference engine
│   ├── recommend_crop.py           # Random Forest crop recommendation module
│   ├── model_v1.pt                 # PyTorch model weights (38 disease classes)
│   └── requirements.txt            # Python dependencies
├── backend/                        # Node.js Express API gateway
│   ├── prisma/                     # Database schema & migrations
│   │   └── schema.prisma
│   ├── src/
│   │   ├── controllers/            # Route controllers (crop, disease, soil, market, etc.)
│   │   ├── routes/                 # Express REST endpoints
│   │   ├── services/               # Gemini AI & External API integrations
│   │   └── index.ts                # Server entry point
│   ├── .env.example                # Backend environment template
│   └── package.json
├── frontend/                       # React 19 + Vite frontend
│   ├── src/
│   │   ├── components/             # Reusable UI & Layout components
│   │   ├── pages/                  # Route views (Dashboard, DiseaseDetect, Schemes, etc.)
│   │   ├── services/               # Axios API client
│   │   └── App.tsx                 # Core application router
│   ├── .env.example                # Frontend environment template
│   └── package.json
└── README.md                       # Comprehensive platform documentation
```

---

## 🤝 Contributing

Contributions are warmly welcomed! To contribute:

1.  **Fork** the repository
2.  **Create** your feature branch (`git checkout -b feature/AmazingFeature`)
3.  **Commit** your changes (`git commit -m 'feat: Add AmazingFeature'`)
4.  **Push** to the branch (`git push origin feature/AmazingFeature`)
5.  **Open** a Pull Request

---

## 📄 License

This project is licensed under the **ISC License**.