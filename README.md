# 🌾 Kisan Mitra (किसान मित्र)

> **AI-Powered Agricultural Advisory, Farm Management & Precision Intelligence Platform for Indian Farmers**

[![React](https://img.shields.io/badge/Frontend-React%2018-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/Language-TypeScript-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Styling-Tailwind%20CSS%20v3-38B2AC?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Node.js](https://img.shields.io/badge/Backend-Node.js%20%7C%20Express-339933?logo=node.js&logoColor=white)](https://nodejs.org/)
[![PostgreSQL](https://img.shields.io/badge/Database-PostgreSQL%20%7C%20Prisma-4169E1?logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![Python](https://img.shields.io/badge/AI%20Microservice-FastAPI%20%7C%20PyTorch-3776AB?logo=python&logoColor=white)](https://fastapi.tiangolo.com/)
[![Google Gemini](https://img.shields.io/badge/GenAI-Google%20Gemini-8E75C2?logo=google&logoColor=white)](https://aistudio.google.com/)
[![License: ISC](https://img.shields.io/badge/License-ISC-blue.svg)](LICENSE)

**Kisan Mitra** is an end-to-end, full-stack agricultural advisory platform built to empower Indian farmers with data-driven decision-making. It integrates a **Two-Stage Random Forest** crop recommendation engine, **EfficientNet-B0** deep learning plant disease diagnosis, **Google Gemini** generative AI advisory, live government market data from `data.gov.in`, and a bilingual (English/Bengali) interface — bridging the gap between agricultural science and field-level execution.

---

## Table of Contents

- [Features](#-features)
- [Technology Stack](#-technology-stack)
- [System Architecture](#-system-architecture)
- [Project Structure](#-project-structure)
- [Workflow & Data Flow](#-workflow--data-flow)
- [Model Training & Evaluation](#-model-training--evaluation)
  - [Crop Recommendation (Random Forest)](#1-crop-recommendation-engine-two-stage-random-forest)
  - [Disease Detection (EfficientNet-B0)](#2-disease-detection-engine-efficientnet-b0)
  - [Evaluation Summary](#3-evaluation-summary)
- [Dataset & Reference Links](#-dataset--reference-links)
  - [Disease Detection Datasets](#-disease-detection-datasets)
  - [Crop Prediction & Yield Data Sources](#-crop-prediction--yield-data-sources)
- [Getting Started](#-getting-started)
- [API Endpoints](#-api-endpoints)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🚀 Features

| Feature | Description |
| :--- | :--- |
| **🍂 AI Crop Disease Diagnosis** | Real-time leaf pathology diagnosis via fine-tuned **EfficientNet-B0** across **38 disease classes** covering 14 crops. Returns confidence scores, pathogen identification, chemical/biological treatment prescriptions, and top-3 differential diagnosis. Dual-mode: FastAPI microservice + direct PyTorch CLI fallback. |
| **🌾 Smart Crop Recommendation** | **Two-Stage Random Forest** ensemble recommends optimal crops from 50 species based on 13 parameters (State, District, Season, Soil Type, Area, Rainfall, Temperature, Irrigation, Soil Moisture, pH, N, P, K). Includes ranked confidence scoring and **harvest yield prediction** (Tonnes/ha) using historical APY data. |
| **🧪 Soil Health Calibration** | Interactive Soil Health Card tool for macro/micronutrient input (N, P, K, pH, Organic Carbon). Computes target deficits and calculates custom fertilizer dosages. |
| **📈 Mandi Market Intelligence** | Live APMC market prices from official `data.gov.in` APIs. Displays commodity price trends, wholesale rate ranges, and selling windows. |
| **🏛️ Government Schemes** | Searchable repository of national and state schemes (PM-KISAN, PMFBY, KCC, PMKSY, Soil Health Card). Direct one-click links to official government portals. |
| **🌦️ Weather Telemetry** | Hyperlocal weather forecasts: temperature, humidity, precipitation, wind metrics, and proactive farm warnings. |
| **🤖 Gemini Farm Copilot** | 24/7 agricultural assistant powered by Google Gemini. Answers pest management, irrigation, seasonal practice queries. Strictly agriculture-scoped. |
| **🌐 Bilingual Support** | Full English and Bengali (`বাংলা`) localization with one-click navbar toggle via `i18next`. |
| **🔐 Clerk Authentication** | Secure user authentication with OAuth SSO support via **Clerk**. |
| **⚡ Landing Page Simulator** | Interactive 4-step agronomy pipeline demo (Soil Calibration → Satellite NDVI → Leaf Pathology → APMC Market Yields) directly on the public landing page. |

---

## 🛠️ Technology Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend** | [React 18](https://react.dev/) · [TypeScript](https://www.typescriptlang.org/) · [Vite](https://vitejs.dev/) · [Tailwind CSS v3](https://tailwindcss.com/) · [GSAP](https://gsap.com/) · [Lucide React](https://lucide.dev/) · [React Router DOM v6](https://reactrouter.com/) · [Clerk Auth](https://clerk.com/) · [i18next](https://www.i18next.com/) · [React Markdown](https://github.com/remarkjs/react-markdown) · [KaTeX](https://katex.org/) |
| **Backend API** | [Node.js](https://nodejs.org/) · [Express 5](https://expressjs.com/) · [TypeScript](https://www.typescriptlang.org/) · [Prisma ORM](https://www.prisma.io/) · [Axios](https://axios-http.com/) · [@google/generative-ai](https://www.npmjs.com/package/@google/generative-ai) |
| **Database** | [PostgreSQL](https://www.postgresql.org/) (compatible with Neon / Supabase / AWS RDS / Local) |
| **AI Microservice** | [Python 3.10+](https://www.python.org/) · [FastAPI](https://fastapi.tiangolo.com/) · [Uvicorn](https://www.uvicorn.org/) · [scikit-learn](https://scikit-learn.org/) (Random Forest) · [PyTorch](https://pytorch.org/) · [Torchvision](https://pytorch.org/vision/) · [Pillow](https://pillow.readthedocs.io/) |
| **Generative AI** | [Google Gemini API](https://aistudio.google.com/) (`gemini-3.5-flash-lite` with multi-model cascade fallback) |
| **External APIs** | [data.gov.in](https://data.gov.in/) (Mandi Prices & Schemes) · [Wikipedia REST API](https://en.wikipedia.org/api/rest_v1/) (Crop Thumbnails) · Weather APIs |
| **DevOps** | Vercel (Frontend + Backend serverless) · Nodemon · ESLint |

---

## 🏗️ System Architecture

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                              KISAN MITRA PLATFORM                              │
├─────────────────────────────────────────────────────────────────────────────────┤
│                                                                                 │
│  ┌───────────────────────────────────────────────────────────────────────────┐  │
│  │                         FRONTEND (Port 5173)                              │  │
│  │  React 18 + TypeScript + Vite + Tailwind CSS v3 + Clerk Auth              │  │
│  │                                                                           │  │
│  │  Pages:                                                                   │  │
│  │  ┌──────────────┐ ┌────────────────┐ ┌──────────────┐ ┌──────────────┐   │  │
│  │  │ Landing Page  │ │   Dashboard    │ │  Crop Reco   │ │Disease Detect│   │  │
│  │  └──────────────┘ └────────────────┘ └──────────────┘ └──────────────┘   │  │
│  │  ┌──────────────┐ ┌────────────────┐ ┌──────────────┐ ┌──────────────┐   │  │
│  │  │ Soil Calibr. │ │ Market Prices  │ │   Schemes    │ │   Chatbot    │   │  │
│  │  └──────────────┘ └────────────────┘ └──────────────┘ └──────────────┘   │  │
│  │  ┌──────────────┐ ┌────────────────┐ ┌──────────────┐                    │  │
│  │  │  ToDo List   │ │ Advisory Hist. │ │  Farmer I/P  │                    │  │
│  │  └──────────────┘ └────────────────┘ └──────────────┘                    │  │
│  └──────────────────────────────┬────────────────────────────────────────────┘  │
│                                 │ Axios REST                                    │
│                                 ▼                                               │
│  ┌───────────────────────────────────────────────────────────────────────────┐  │
│  │                    BACKEND API GATEWAY (Port 3000)                         │  │
│  │  Node.js + Express 5 + TypeScript + Prisma ORM                            │  │
│  │                                                                           │  │
│  │  Controllers:                                                             │  │
│  │  cropController ─── diseaseController ─── soilController                  │  │
│  │  marketController ── schemeController ─── weatherController               │  │
│  │  chatController ──── advisoryController ── dashboardController            │  │
│  │  taskController                                                           │  │
│  │                                                                           │  │
│  │  Services:                                                                │  │
│  │  geminiService.ts ── Farming Plan Gen · Chat Assistant · Crop Images      │  │
│  └───────┬──────────────────────┬──────────────────────┬─────────────────────┘  │
│          │                      │                      │                        │
│          ▼                      ▼                      ▼                        │
│  ┌──────────────┐   ┌─────────────────────┐   ┌──────────────────────┐         │
│  │  PostgreSQL   │   │  AI MICROSERVICE    │   │   External APIs      │         │
│  │  (Prisma ORM) │   │  (Port 8000)        │   │                      │         │
│  │               │   │                     │   │  • data.gov.in       │         │
│  │  12 Models:   │   │  FastAPI + Uvicorn  │   │    (Mandi Prices)    │         │
│  │  User         │   │                     │   │  • Google Gemini API │         │
│  │  Crop         │   │  POST /predict      │   │  • Wikipedia API     │         │
│  │  SoilType     │   │    Two-Stage RF     │   │    (Crop Thumbnails) │         │
│  │  Season       │   │    (50 Crops)       │   │  • Weather APIs      │         │
│  │  MarketPrice  │   │                     │   │                      │         │
│  │  Govt.Scheme  │   │  POST /predict-     │   └──────────────────────┘         │
│  │  SoilData     │   │       disease       │                                    │
│  │  WeatherData  │   │    EfficientNet-B0  │                                    │
│  │  Task         │   │    (38 Classes)     │                                    │
│  │  CropAdvisory │   │                     │                                    │
│  │  DistrictCrop │   │  GET /options       │                                    │
│  │  Reco.History │   │  GET /health        │                                    │
│  │  Disease.Hist │   └─────────────────────┘                                    │
│  └──────────────┘                                                               │
└─────────────────────────────────────────────────────────────────────────────────┘
```

---

## 📂 Project Structure

```
Kisan-Mitra/
│
├── ai-service/                              # Python AI & Computer Vision Microservice
│   ├── main.py                              # FastAPI server (endpoints: /predict, /predict-disease, /options, /health)
│   ├── predict_disease.py                   # EfficientNet-B0 inference + 38-class pathology knowledgebase
│   ├── recommend_crop.py                    # Two-Stage Random Forest CLI & library (13-feature pipeline)
│   ├── train_random_forest.py               # Training script: 70:30 stratified split, class weighting, evaluation
│   ├── try_crop_model.py                    # Model experimentation & testing utilities
│   ├── model_v1.pt                          # PyTorch EfficientNet-B0 weights (38 disease classes)
│   ├── crop_yield_reference.json            # District/State/National historical yield data (Tonnes/ha)
│   ├── regional_soil_baselines.json         # NPK/pH/Moisture baselines for auto-imputation by State+District
│   ├── rf_model_bundle_metadata.json        # Feature columns, categorical encodings, class labels
│   ├── frontend_dropdown_options.json       # Dynamic dropdown schema (652 districts, 36 states, seasons, soils)
│   ├── indian_popular_crop_names.json       # Scientific → popular Indian crop name mapping
│   ├── dataset_dictionary.json              # Feature definitions & training column spec
│   ├── RANDOM_FOREST_MODEL_REPORT.md        # Detailed benchmark evaluation report
│   ├── CROP_RECOMMENDATION_SYSTEM_IMPLEMENTATION_PLAN.md
│   ├── requirements.txt                     # Python dependencies
│   └── start_ai_service.bat                 # Windows batch launcher
│
├── backend/                                 # Node.js Express API Gateway
│   ├── src/
│   │   ├── index.ts                         # Express server entry point (Port 3000)
│   │   ├── prisma.ts                        # Prisma client singleton
│   │   ├── controllers/
│   │   │   ├── cropController.ts            # Crop recommendation + yield + Gemini farming plan
│   │   │   ├── diseaseController.ts         # Disease image upload → AI service → diagnosis response
│   │   │   ├── soilController.ts            # Soil health data CRUD operations
│   │   │   ├── marketController.ts          # data.gov.in Mandi price API integration
│   │   │   ├── schemeController.ts          # Government schemes CRUD & search
│   │   │   ├── weatherController.ts         # Weather data proxy
│   │   │   ├── chatController.ts            # Gemini chatbot message handler
│   │   │   ├── advisoryController.ts        # Crop advisory history management
│   │   │   ├── dashboardController.ts       # Aggregated dashboard statistics
│   │   │   └── taskController.ts            # Farm task/to-do CRUD
│   │   ├── routes/
│   │   │   ├── index.ts                     # Route aggregator → /api/*
│   │   │   ├── cropRoutes.ts                # /api/crops/*
│   │   │   ├── diseaseRoutes.ts             # /api/disease/*
│   │   │   ├── soilRoutes.ts                # /api/soil-data/*
│   │   │   ├── marketRoutes.ts              # /api/market-prices/*
│   │   │   ├── schemeRoutes.ts              # /api/schemes/*
│   │   │   ├── weatherRoutes.ts             # /api/weather/*
│   │   │   ├── chatRoutes.ts                # /api/chat/*
│   │   │   ├── advisoryRoutes.ts            # /api/advisories/*
│   │   │   ├── dashboardRoutes.ts           # /api/dashboard/*
│   │   │   └── taskRoutes.ts                # /api/todos/*
│   │   └── services/
│   │       └── geminiService.ts             # Gemini AI integration (farming plans, chat, crop images, Wikipedia fallback)
│   ├── prisma/
│   │   ├── schema.prisma                    # Database schema (12 models: User, Crop, SoilType, Season, etc.)
│   │   └── seed.ts                          # Database seed script
│   ├── .env.example                         # Backend environment template
│   ├── package.json
│   ├── tsconfig.json
│   └── vercel.json                          # Vercel serverless deployment config
│
├── frontend/                                # React 18 + Vite Frontend Application
│   ├── src/
│   │   ├── App.tsx                          # Core router (public/protected routes with Clerk guards)
│   │   ├── main.tsx                         # React DOM entry + Clerk provider
│   │   ├── i18n.ts                          # i18next configuration (EN/BN)
│   │   ├── index.css                        # Global styles + Tailwind directives
│   │   ├── pages/
│   │   │   ├── LandingPage.tsx              # Public landing with interactive pipeline simulator
│   │   │   ├── AuthPage.tsx                 # Sign-in / Sign-up with Clerk (swipeable tabs)
│   │   │   ├── Dashboard.tsx                # Farmer workspace overview with weather + advisories
│   │   │   ├── CropRecommendation.tsx       # 13-parameter crop recommendation interface
│   │   │   ├── DiseaseDetect.tsx            # Image upload → disease diagnosis results
│   │   │   ├── SoilCalibration.tsx          # Soil Health Card calibration tool
│   │   │   ├── MarketPrices.tsx             # Live APMC mandi price discovery
│   │   │   ├── Schemes.tsx                  # Government welfare schemes browser
│   │   │   ├── Chatbot.tsx                  # Gemini-powered agricultural chatbot
│   │   │   ├── FarmerInput.tsx              # Farm data collection form
│   │   │   ├── SystemPredicts.tsx           # AI prediction results display
│   │   │   ├── AdvisoryHistory.tsx          # Past recommendation & diagnosis history
│   │   │   ├── ToDoList.tsx                 # Farm task management
│   │   │   └── NotFound.tsx                 # 404 page
│   │   ├── components/
│   │   │   ├── layout/
│   │   │   │   ├── Header.tsx               # Top navigation bar with language toggle
│   │   │   │   └── Sidebar.tsx              # Collapsible navigation sidebar
│   │   │   ├── ui/
│   │   │   │   ├── Button.tsx               # Reusable button component
│   │   │   │   ├── Card.tsx                 # Card container component
│   │   │   │   ├── Badge.tsx                # Status badge component
│   │   │   │   ├── Input.tsx                # Form input component
│   │   │   │   └── Modal.tsx                # Modal dialog component
│   │   │   ├── CommandPalette.tsx           # Keyboard-driven command palette (⌘K)
│   │   │   ├── LanguageToggle.tsx           # EN/BN language switcher
│   │   │   └── WeatherIcon.tsx              # Dynamic weather condition icons
│   │   ├── layouts/
│   │   │   └── MainLayout.tsx               # Authenticated layout shell (Header + Sidebar + Outlet)
│   │   ├── context/
│   │   │   └── WeatherContext.tsx            # Global weather state provider
│   │   ├── services/
│   │   │   └── api.ts                       # Axios client (base URL from VITE_API_URL)
│   │   ├── types/
│   │   │   └── index.d.ts                   # Shared TypeScript type definitions
│   │   └── utils/
│   │       ├── diseaseFormatters.ts         # Disease result formatting utilities
│   │       └── helpers.ts                   # General helper functions
│   ├── public/
│   │   ├── locales/
│   │   │   ├── en/translation.json          # English translations
│   │   │   └── bn/translation.json          # Bengali (বাংলা) translations
│   │   ├── favicon.svg
│   │   ├── hero-bg.jpg
│   │   ├── robots.txt
│   │   ├── sitemap.xml
│   │   └── site.webmanifest
│   ├── .env.example
│   ├── index.html                           # HTML entry with SEO meta tags
│   ├── package.json
│   ├── tailwind.config.js
│   ├── vite.config.ts
│   └── vercel.json
│
├── .env.example                             # Root environment variable overview
├── generate_seed.py                         # Database seed data generator
├── .gitignore
└── README.md
```

---

## 🔄 Workflow & Data Flow

### User Journey

```
Landing Page (Public) ──→ Clerk Auth ──→ Dashboard (Protected)
                                              │
                 ┌────────────────────────────┼────────────────────────────────┐
                 ▼                            ▼                                ▼
        Crop Recommendation            Disease Detection              Soil Calibration
                 │                            │                                │
                 ▼                            ▼                                ▼
        Fill 13 Parameters            Upload Leaf Image            Enter NPK/pH Values
        (State, District,             (Camera or File)             (from Soil Health Card)
        Season, Soil, Area,                   │                                │
        NPK, pH, Moisture,                    ▼                                ▼
        Rainfall, Temp,              base64 encode →               Compute Deficits →
        Irrigation)                  POST /api/disease              Fertilizer Dosages
                 │                            │
                 ▼                            ▼
        POST /api/crops/recommend    Backend proxies to
                 │                   AI Service POST
                 ▼                   /predict-disease
        Backend forwards to                   │
        AI Service POST /predict              ▼
                 │                   EfficientNet-B0
                 ▼                   Inference on
        Two-Stage Random Forest      model_v1.pt
        Stage 1: Category (10)               │
        Stage 2: Top-K Crops (50)            ▼
                 │                   Returns: disease name,
                 ▼                   confidence, pathogen,
        Yield = Historical APY ×     severity, chemical &
        Cultivated Area              organic treatments,
                 │                   top-3 differential
                 ▼                   diagnosis
        Gemini generates
        Precision Farming Plan
        (6-section advisory)
                 │
                 ▼
        Results saved to
        RecommendationHistory
        (PostgreSQL via Prisma)
```

### Crop Recommendation Pipeline (Detailed)

```
                         ┌──────────────────────────────────┐
                         │       FARMER INPUT (13 Params)   │
                         │  State · District · Season ·     │
                         │  Soil Type · Area(ha) · Rainfall │
                         │  Temperature · Irrigation ·      │
                         │  Moisture · pH · N · P · K       │
                         └──────────────┬───────────────────┘
                                        │
                                ┌───────▼────────┐
                                │  NPK Provided? │
                                └───┬────────┬───┘
                                Yes │        │ No
                                    ▼        ▼
                          Use Farmer    Auto-impute from
                          Values        regional_soil_baselines.json
                                    │        │
                                    └───┬────┘
                                        │
                           ┌────────────▼─────────────┐
                           │  ENCODE CATEGORICALS      │
                           │  (State, District, Season, │
                           │   Soil, Irrigation → int)  │
                           │  via rf_model_bundle_      │
                           │  metadata.json             │
                           └────────────┬──────────────┘
                                        │
                    ┌───────────────────▼───────────────────┐
                    │           STAGE 1: CATEGORY RF         │
                    │   100 trees · max_depth=16             │
                    │   Predicts Agricultural Family (10)     │
                    │   Accuracy: 89.51% Top-1               │
                    └───────────────────┬───────────────────┘
                                        │
                    ┌───────────────────▼───────────────────┐
                    │        STAGE 2: CROP-SPECIFIC RF       │
                    │   140 trees · max_depth=23             │
                    │   Smoothed class weighting (α=0.35)    │
                    │   Predicts Top-K from 50 crops          │
                    │   Top-3 Accuracy: 94.43%               │
                    └───────────────────┬───────────────────┘
                                        │
                    ┌───────────────────▼───────────────────┐
                    │         HARVEST YIELD LOOKUP           │
                    │   crop_yield_reference.json             │
                    │   District → State → National fallback  │
                    │   Yield (T/ha) × Area = Total Harvest   │
                    └───────────────────┬───────────────────┘
                                        │
                    ┌───────────────────▼───────────────────┐
                    │      GEMINI ADVISORY GENERATION        │
                    │   6-section precision farming plan      │
                    │   Multi-model cascade fallback          │
                    │   Expert agronomic fallback (offline)   │
                    └───────────────────────────────────────┘
```

### Disease Detection Pipeline

```
   Leaf Image (Upload/Camera)
            │
            ▼
   Base64 Encode → POST /predict-disease
            │
            ▼
   ┌─────────────────────────────┐
   │   EfficientNet-B0 (model_v1.pt)    │
   │   Input: 224×224 RGB tensor │
   │   Normalize: ImageNet stats │
   │   Output: 38-class softmax  │
   └──────────────┬──────────────┘
                  │
                  ▼
   Top-3 Predictions + Confidence Scores
            │
            ▼
   ┌──────────────────────────────────┐
   │   DISEASE_KNOWLEDGE (38 entries) │
   │   • Crop name                    │
   │   • Disease name & pathogen      │
   │   • Severity level               │
   │   • Symptom description          │
   │   • Chemical treatment (dosage)  │
   │   • Organic treatment            │
   │   • Prevention measures          │
   └──────────────────────────────────┘
```

---

## 🧠 Model Training & Evaluation

### 1. Crop Recommendation Engine (Two-Stage Random Forest)

#### Training Configuration

| Parameter | Value |
| :--- | :--- |
| **Algorithm** | `sklearn.ensemble.RandomForestClassifier` (Two-Stage) |
| **Dataset** | 224,519 records from `india_crop_final_ready_for_ml.csv` |
| **Train / Test Split** | 70:30 stratified by `Crop_Name` (157,163 train / 67,356 test) |
| **Input Features** | 13 (4 categorical encoded, 9 numeric) |
| **Target Classes** | 50 Indian crop species across 10 agricultural families |
| **Stage 1** | 100 trees, max_depth=16, Gini criterion |
| **Stage 2** | 140 trees, max_depth=23, OOB scoring, `max_features=sqrt` |
| **Class Weighting** | Smoothed sub-linear weighting (α=0.35) to handle class imbalance |
| **Serialization** | `.joblib` (compressed) + `.pkl` (pickle highest protocol) |

#### 13 Input Features

| # | Feature | Type | Source |
| :-: | :--- | :---: | :--- |
| 1 | `State` | Categorical | 36 Indian states/UTs |
| 2 | `District` | Categorical | 652 districts |
| 3 | `Crop_Season` | Categorical | Kharif, Rabi, Summer, Whole Year, Autumn, Winter |
| 4 | `Soil_Type` | Categorical | 7 proxy soil types |
| 5 | `Cultivated_Area_ha` | Numeric | Field area in hectares |
| 6 | `Rainfall_mm` | Numeric | Seasonal rainfall (100–2500 mm) |
| 7 | `Average_Temperature_C` | Numeric | Ambient temperature (10–45°C) |
| 8 | `Irrigation_Availability` | Categorical | 5 levels (High → Rainfed) |
| 9 | `Soil_Moisture_pct` | Numeric | Root-zone moisture (12–48%) |
| 10 | `Soil_pH` | Numeric | Topsoil pH (4.5–8.5) |
| 11 | `Nitrogen_N` | Numeric | Available N kg/ha (optional, auto-imputed) |
| 12 | `Phosphorus_P` | Numeric | Available P kg/ha (optional, auto-imputed) |
| 13 | `Potassium_K` | Numeric | Available K kg/ha (optional, auto-imputed) |

#### Benchmark Results (67,356 held-out test fields)

| Metric | Score |
| :--- | :---: |
| **Stage 1 — Category Top-1 Accuracy** | **89.51%** |
| **Stage 1 — Category Top-2 Accuracy** | **98.56%** |
| **Stage 2 — Top-1 Exact Crop Accuracy** | **74.09%** |
| **Stage 2 — Top-2 Accuracy** | **88.97%** |
| **Stage 2 — Top-3 Advisory Accuracy** | **94.43%** |
| **Stage 2 — Top-5 Advisory Accuracy** | **98.19%** |
| **Stage 2 — Top-10 Spectrum Accuracy** | **99.77%** |
| **Weighted Precision / F1** | 0.7422 / 0.7408 |
| **Macro F1-Score** | **0.7065** |
| **OOB (Out-of-Bag) Score** | 73.74% |
| **Inference Throughput** | **39,710 QPS** (0.025 ms/query) |

#### Gini Feature Importance

| Rank | Feature | Importance |
| :-: | :--- | :---: |
| 1 | `Soil_Moisture_pct` | 55.38% |
| 2 | `District` | 12.49% |
| 3 | `Rainfall_mm` | 8.01% |
| 4 | `Irrigation_Availability` | 5.40% |
| 5 | `Average_Temperature_C` | 5.27% |
| 6 | `Crop_Season` | 4.47% |
| 7 | `State` | 3.73% |
| 8 | `Soil_Type` | 1.13% |
| 9–12 | `Soil_pH`, `K`, `P`, `N` | ~1% each |

### 2. Disease Detection Engine (EfficientNet-B0)

| Parameter | Value |
| :--- | :--- |
| **Architecture** | EfficientNet-B0 (fine-tuned) |
| **Input Resolution** | 224 × 224 RGB |
| **Normalization** | ImageNet (mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225]) |
| **Classes** | 38 (14 crop species, covers healthy + diseased states) |
| **Validation Accuracy** | **98.3%** |
| **Weights File** | `model_v1.pt` |
| **Inference Mode** | FastAPI endpoint + standalone CLI |

**Crops Covered**: Apple, Blueberry, Cherry, Corn (Maize), Grape, Orange (Citrus), Peach, Bell Pepper, Potato, Raspberry, Soybean, Squash, Strawberry, Tomato.

**Diseases Diagnosed**: Apple Scab, Black Rot, Cedar Rust, Powdery Mildew, Gray Leaf Spot, Common Rust, Northern Leaf Blight, Grape Black Rot, Esca, Huanglongbing (Citrus Greening), Bacterial Spot, Early Blight, Late Blight, Leaf Mold, Septoria Leaf Spot, Spider Mites, Target Spot, TYLCV, Tomato Mosaic Virus, and more.

Each diagnosis includes: **pathogen type**, **severity rating**, **detailed symptoms**, **chemical treatment with dosage**, **organic/biological treatment**, and **prevention measures**.

### 3. Evaluation Summary

| Model | Architecture | Classes | Key Metric | Status |
| :--- | :--- | :---: | :--- | :---: |
| **Crop Recommender (Stage 2)** | Random Forest (140 trees) | 50 | 94.43% Top-3 Advisory | ✅ Active |
| **Crop Category (Stage 1)** | Random Forest (100 trees) | 10 | 89.51% Top-1 | ✅ Active |
| **Disease Classifier** | EfficientNet-B0 | 38 | 98.3% Validation Acc. | ✅ Active |

#### Other Models Evaluated (Disease Classification)

| Model | Architecture | Classes | Status | Repository |
| :--- | :--- | :---: | :---: | :--- |
| **AgriSmart AI India v1** | DINOv2 ViT-B/14 | 387 | Tested | [GitHub](https://github.com/Vatsal2008/AgriSmart-AI) |
| **Plant Disease Classifier** | EfficientNet-B0 | 38 | ✅ Active Model | [GitHub](https://github.com/pavanmanjunath18/Plant_Disease_Classifier) |
| **Custom Crop Disease Classifier** | YOLO11m-cls | 75 | Trained (checkpoint lost) | [Ultralytics](https://github.com/ultralytics/ultralytics) |

> **Note:** The custom YOLO11m checkpoint was not recovered after the Colab runtime disconnected. The pretrained model repositories and dataset links are provided for reference. Check each project's license before redistributing its model weights or dataset images.

---

## 📚 Dataset & Reference Links

### 🍂 Disease Detection Datasets

| Dataset | Source |
| :--- | :--- |
| **Multi-Crop Disease Dataset** | [Mendeley Data](https://data.mendeley.com/datasets/6243z8r6t6/1) |
| **15-Crop Disease Dataset** | [Mendeley Data](https://data.mendeley.com/datasets/8fr7grr73p/1) |
| **PlantVillage Dataset** | [Kaggle](https://www.kaggle.com/datasets/abdallahalidev/plantvillage-dataset) |

**Training Technologies**: [Python](https://www.python.org/) · [PyTorch](https://pytorch.org/) · [Ultralytics YOLO](https://docs.ultralytics.com/) · [Hugging Face timm](https://github.com/huggingface/pytorch-image-models) · [Google Colab](https://colab.research.google.com/)

### 🌾 Crop Prediction & Yield Data Sources

#### 📥 Actual Data Source
*   **Direct Raw Dataset**: [GitHub copy of Kaggle "Crop Production in India" CSV](https://raw.githubusercontent.com/surajs2005/-Crop-Production-in-India-project-/HEAD/crop_production.csv)
*   **Repository Page**: [surajs2005/-Crop-Production-in-India-project-](https://github.com/surajs2005/-Crop-Production-in-India-project-)
*   *Note*: Downloaded and cleaned for the model. This is a third-party copy of government Area, Production, and Yield (APY) statistics rather than an extract directly from the official portal.

#### 🏛️ Official Sources (Original Upstream Data)
Reference portals where the official APY statistics originate:
*   **Area Production Yield (APY)**: [India Data Portal APY Dataset](https://ckandev.indiadataportal.com/dataset/area-production-yield-apy)
*   **Official APY Extraction Portal**: [DES Agri Portal](https://data.desagri.gov.in/login) *(Authentication required)*
*   **Ministry of Agriculture & Farmers Welfare (DES)**: [DES Agriculture Page](https://desagri.gov.in/?p=3537)
*   **Agricultural Statistics at a Glance**: [Area, Production & Yield of Principal Crops Report](https://desagri.gov.in/documents-reports/agricultural-statistics-at-a-glance-2007/4-area-production-and-yield-of-principal-crops/)

#### 🧪 Supplementary Soil & Climate Reference Sources
Sources evaluated for soil nutrient (N, P, K, pH) and micro-climatic parameters:
*   **Soil Health Card Dataset**: [India Data Portal Soil Health Card](https://ckandev.indiadataportal.com/dataset/soil-health-card) *(Official portal: [soilhealth.dac.gov.in](https://soilhealth.dac.gov.in/))*
*   **ICRISAT District-Level Data**: [Mendeley Data Repository](https://data.mendeley.com/datasets/ywp3y5j9vv)
*   **TCI & ICRISAT District-Level Database**: [Tata-Cornell Institute (TCI) Database](https://tci.cornell.edu/data)
*   **Database Partnership Overview**: [ICRISAT Press Release on Indian Food Systems Data](https://pressroom.icrisat.org/tci-and-icrisat-continue-partnership-to-improve-access-to-indian-food-systems-data)

---

## 🏁 Getting Started

### Prerequisites

| Requirement | Version |
| :--- | :--- |
| **Node.js** | v18.0.0 or higher |
| **npm** or **yarn** | Latest |
| **Python** | v3.10 or higher with `pip` |
| **PostgreSQL** | Running locally or via cloud (Neon / Supabase / AWS RDS) |
| **Clerk Account** | For authentication credentials → [clerk.com](https://clerk.com/) |
| **Google AI Studio API Key** | For Gemini AI → [aistudio.google.com](https://aistudio.google.com/) |

### Installation & Setup

#### 1. Clone the Repository

```bash
git clone https://github.com/Barshan-Majumdar/Kisan-Mitra.git
cd Kisan-Mitra
```

#### 2. AI Microservice (Python)

```bash
cd ai-service
pip install -r requirements.txt
```

> ⚠️ **Important**: Place the trained model files (`random_forest_crop_model.joblib`, `random_forest_category_model.joblib`, `model_v1.pt`) in the `ai-service/` directory. These are not included in the repository due to file size constraints.

Start the AI service:

```bash
python main.py
```

The FastAPI server will be available at `http://127.0.0.1:8000`.  
Health check: `http://127.0.0.1:8000/health`

#### 3. Backend (Node.js + Express)

```bash
cd ../backend
npm install
```

Create `backend/.env` (refer to `.env.example`):

```env
DATABASE_URL="postgresql://username:password@localhost:5432/kisan_mitra?schema=public"
PORT=3000
NODE_ENV=development
GEMINI_API_KEY="your_gemini_api_key_here"
CROP_PREDICTION_API_URL="http://127.0.0.1:8000/predict"
```

Run database migrations and seed:

```bash
npx prisma migrate dev
npx prisma db seed
```

Start the backend:

```bash
npm run dev
```

The Express server will be available at `http://localhost:3000`.

#### 4. Frontend (React + Vite)

```bash
cd ../frontend
npm install
```

Create `frontend/.env` (refer to `.env.example`):

```env
VITE_CLERK_PUBLISHABLE_KEY="pk_test_your_clerk_key_here"
VITE_API_URL="http://localhost:3000/api"
```

Start the development server:

```bash
npm run dev
```

#### 5. Access the Application

Open your browser and navigate to:

```
http://localhost:5173
```

### Running All Three Services

For full functionality, all three services must be running simultaneously:

| Service | Directory | Command | Port |
| :--- | :--- | :--- | :---: |
| **AI Microservice** | `ai-service/` | `python main.py` | `8000` |
| **Backend API** | `backend/` | `npm run dev` | `3000` |
| **Frontend** | `frontend/` | `npm run dev` | `5173` |

---

## 🔌 API Endpoints

### Backend REST API (`/api`)

| Method | Endpoint | Description |
| :---: | :--- | :--- |
| `POST` | `/api/crops/recommend` | Crop recommendation with yield prediction |
| `GET` | `/api/crops` | List all crops in database |
| `POST` | `/api/disease/predict` | Plant disease diagnosis from image |
| `GET` | `/api/disease/history` | Disease diagnosis history |
| `GET` | `/api/market-prices` | Live APMC mandi prices |
| `GET` | `/api/schemes` | Government welfare schemes |
| `GET/POST` | `/api/soil-data` | Soil health data operations |
| `GET` | `/api/weather` | Weather telemetry |
| `POST` | `/api/chat` | Gemini chatbot interaction |
| `GET` | `/api/advisories` | Crop advisory history |
| `GET` | `/api/dashboard` | Dashboard aggregated stats |
| `GET/POST` | `/api/todos` | Farm task management |

### AI Microservice (`Port 8000`)

| Method | Endpoint | Description |
| :---: | :--- | :--- |
| `GET` | `/health` | Service status and model load state |
| `GET` | `/options` | Frontend dropdown schema (states, districts, seasons, soils) |
| `POST` | `/predict` | Two-Stage RF crop recommendation |
| `POST` | `/predict-disease` | EfficientNet-B0 plant disease diagnosis |
| `GET` | `/disease/classes` | List of 38 recognizable disease classes |

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