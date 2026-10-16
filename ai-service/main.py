#!/usr/bin/env python3
"""
FastAPI Microservice for Indian National Crop Recommendation & Harvest Yield System.
Part of the Kisan-Mitra Agricultural Advisory Platform.
"""

import os
import sys
import json
import pickle
import joblib
import numpy as np
import pandas as pd
from typing import Optional, Dict, Any, List
from contextlib import asynccontextmanager

if sys.platform == "win32":
    try:
        sys.stdout.reconfigure(encoding="utf-8")
        sys.stderr.reconfigure(encoding="utf-8")
    except Exception:
        pass

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

# File Paths
CROP_MODEL_PATH = os.path.join(BASE_DIR, "random_forest_crop_model.pkl")
CAT_MODEL_PATH = os.path.join(BASE_DIR, "random_forest_category_model.pkl")
META_PATH = os.path.join(BASE_DIR, "rf_model_bundle_metadata.json")
YIELD_PATH = os.path.join(BASE_DIR, "crop_yield_reference.json")
BASELINE_PATH = os.path.join(BASE_DIR, "regional_soil_baselines.json")
POPULAR_NAMES_PATH = os.path.join(BASE_DIR, "indian_popular_crop_names.json")
OPTIONS_PATH = os.path.join(BASE_DIR, "frontend_dropdown_options.json")

# In-memory global model cache
ai_resources = {
    "crop_model": None,
    "cat_model": None,
    "metadata": None,
    "yield_data": {},
    "baselines": {},
    "popular_names": {},
    "options": {}
}

# Lifespan event for FastAPI (loads 2.5GB model once on startup)
@asynccontextmanager
async def lifespan(app: FastAPI):
    print("[AI Service] Initializing Two-Stage Random Forest Crop Recommendation Models...")
    
    # 1. Metadata
    if os.path.exists(META_PATH):
        with open(META_PATH, "r", encoding="utf-8") as f:
            ai_resources["metadata"] = json.load(f)
        print("[AI Service] Metadata and Encoders loaded.")

    # 2. Yield Reference
    if os.path.exists(YIELD_PATH):
        with open(YIELD_PATH, "r", encoding="utf-8") as f:
            ai_resources["yield_data"] = json.load(f)
        print("[AI Service] Crop Yield Reference loaded.")

    # 3. Regional Soil Baselines
    if os.path.exists(BASELINE_PATH):
        with open(BASELINE_PATH, "r", encoding="utf-8") as f:
            ai_resources["baselines"] = json.load(f)
        print("[AI Service] Regional Soil Baselines loaded.")

    # 4. Popular Names Dictionary
    if os.path.exists(POPULAR_NAMES_PATH):
        with open(POPULAR_NAMES_PATH, "r", encoding="utf-8") as f:
            ai_resources["popular_names"] = json.load(f)
        print("[AI Service] Popular Indian Names loaded.")

    # 5. Frontend Options Schema
    if os.path.exists(OPTIONS_PATH):
        with open(OPTIONS_PATH, "r", encoding="utf-8") as f:
            ai_resources["options"] = json.load(f)
        print("[AI Service] Frontend Dropdown Options loaded.")

    # 6. Stage 1 Category Model
    if os.path.exists(CAT_MODEL_PATH):
        try:
            with open(CAT_MODEL_PATH, "rb") as f:
                ai_resources["cat_model"] = pickle.load(f)
            print("[AI Service] Stage 1 Category Model loaded (89.5% accuracy).")
        except Exception as e:
            print(f"[AI Service] Failed to load category model: {e}")

    # 7. Stage 2 50-Crop Random Forest Model
    if os.path.exists(CROP_MODEL_PATH):
        try:
            print("[AI Service] Loading 2.59 GB Stage 2 Specific Crop Model (this may take ~10-15s)...")
            with open(CROP_MODEL_PATH, "rb") as f:
                ai_resources["crop_model"] = pickle.load(f)
            print("[AI Service] Stage 2 Specific Crop Model loaded successfully (94.4% Top-3 advisory).")
        except Exception as e:
            print(f"[AI Service] Failed to load crop model: {e}")

    print("[AI Service] Agricultural Recommendation Engine is READY on http://localhost:8000")
    yield
    print("[AI Service] Shutting down.")


app = FastAPI(
    title="Kisan-Mitra AI Agriculture Advisory Service",
    description="Two-Stage Random Forest Crop Recommendation & Harvest Yield Engine",
    version="2.0.0",
    lifespan=lifespan
)

# Enable CORS for Frontend & Backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Helper Functions
def get_soil_baseline(state: str, district: str) -> Dict[str, float]:
    baselines = ai_resources.get("baselines", {})
    dist_key = f"{state}|{district}"
    if dist_key in baselines.get("district_baselines", {}):
        return baselines["district_baselines"][dist_key]
    if state in baselines.get("state_baselines", {}):
        return baselines["state_baselines"][state]
    return baselines.get("national_baseline", {
        "Nitrogen_N": 85.0,
        "Phosphorus_P": 40.0,
        "Potassium_K": 40.0,
        "Soil_pH": 7.0,
        "Soil_Moisture_pct": 25.0
    })


def calculate_harvest_yield(state: str, district: str, crop_name: str, area_ha: float):
    yield_data = ai_resources.get("yield_data", {})
    dist_key = f"{state}|{district}|{crop_name}"
    state_key = f"{state}|{crop_name}"

    yield_val = yield_data.get("district_yield", {}).get(dist_key)
    if yield_val is None:
        yield_val = yield_data.get("state_yield", {}).get(state_key)
    if yield_val is None:
        yield_val = yield_data.get("national_crop_yield", {}).get(crop_name, 2.0)

    yield_t_per_ha = round(float(yield_val), 2)
    total_tonnes = round(yield_t_per_ha * area_ha, 2)
    return yield_t_per_ha, total_tonnes


# Exact categories as per dataset
DATASET_SOIL_TYPES = [
    "Alluvial plains (proxy)",
    "Arid/desert soil (proxy)",
    "Black cotton/regur (proxy)",
    "Coastal/lateritic mix (proxy)",
    "Deltaic/alluvial (proxy)",
    "Mountain/forest soil (proxy)",
    "Red/red-yellow soil (proxy)"
]

DATASET_SEASONS = ["Kharif", "Rabi", "Summer", "Whole Year", "Autumn", "Winter"]

DATASET_IRRIGATION = [
    "High (proxy)",
    "Moderate–high (proxy)",
    "Moderate (proxy)",
    "Low–moderate (proxy)",
    "Low/variable; likely rain-fed (proxy)"
]

def resolve_soil_type(val: Optional[str]) -> str:
    if not val or not str(val).strip():
        return "Alluvial plains (proxy)"
    s = str(val).strip().lower()
    if "delta" in s:
        return "Deltaic/alluvial (proxy)"
    elif "mount" in s or "forest" in s or "hill" in s:
        return "Mountain/forest soil (proxy)"
    elif "arid" in s or "desert" in s:
        return "Arid/desert soil (proxy)"
    elif "black" in s or "cotton" in s or "regur" in s:
        return "Black cotton/regur (proxy)"
    elif "coast" in s or "laterit" in s:
        return "Coastal/lateritic mix (proxy)"
    elif "red" in s or "yellow" in s:
        return "Red/red-yellow soil (proxy)"
    elif "alluvial" in s or "gangetic" in s or "plain" in s or "loam" in s:
        return "Alluvial plains (proxy)"
    return "Alluvial plains (proxy)"


def resolve_season(val: Optional[str]) -> str:
    if not val or not str(val).strip():
        return "Kharif"
    s = str(val).strip().lower()
    for item in DATASET_SEASONS:
        if s == item.lower() or s in item.lower():
            return item
    return "Kharif"


def resolve_irrigation(val: Optional[str]) -> str:
    if not val or not str(val).strip():
        return "High (proxy)"
    s = str(val).strip().lower().replace("-", "–")
    if "rain" in s or "fed" in s or "variable" in s:
        return "Low/variable; likely rain-fed (proxy)"
    elif "moderate" in s and "high" in s:
        return "Moderate–high (proxy)"
    elif "low" in s and "moderate" in s:
        return "Low–moderate (proxy)"
    elif "high" in s or "borewell" in s or "canal" in s or "drip" in s:
        return "High (proxy)"
    elif "mod" in s:
        return "Moderate (proxy)"
    return "High (proxy)"


# Pydantic Request Model
class CropPredictionRequest(BaseModel):
    # Support both new 13-feature naming and legacy naming
    State: Optional[str] = Field("West Bengal", description="Indian State")
    District: Optional[str] = Field("Nadia", description="District")
    Crop_Season: Optional[str] = Field("Kharif", description="Crop Season")
    Soil_Type: Optional[str] = Field("Alluvial plains (proxy)", description="Soil Type")
    Cultivated_Area_ha: Optional[float] = Field(2.0, description="Field Area in Hectares")
    Rainfall_mm: Optional[float] = Field(700.0, description="Seasonal Rainfall in mm")
    Average_Temperature_C: Optional[float] = Field(28.0, description="Average Temperature in °C")
    Irrigation_Availability: Optional[str] = Field("High (proxy)", description="Irrigation Level")
    Soil_Moisture_pct: Optional[float] = Field(25.0, description="Soil Moisture %")
    Soil_pH: Optional[float] = Field(7.0, description="Soil pH")
    Nitrogen_N: Optional[float] = Field(None, description="Nitrogen kg/ha (optional)")
    Phosphorus_P: Optional[float] = Field(None, description="Phosphorus kg/ha (optional)")
    Potassium_K: Optional[float] = Field(None, description="Potassium kg/ha (optional)")
    top_k: Optional[int] = Field(5, description="Number of crop recommendations")

    # Legacy field support from old frontend
    Temp: Optional[float] = None
    Rainfall: Optional[float] = None
    Soil: Optional[str] = None
    area: Optional[float] = None
    irrigation: Optional[str] = None
    season: Optional[str] = None


@app.get("/")
@app.get("/health")
def health_check():
    return {
        "status": "online",
        "service": "Kisan-Mitra AI Recommendation Service",
        "crop_model_loaded": ai_resources["crop_model"] is not None,
        "category_model_loaded": ai_resources["cat_model"] is not None,
        "districts_count": len(ai_resources.get("options", {}).get("districts_count", [652]) if isinstance(ai_resources.get("options", {}).get("districts_count"), list) else [652])
    }


@app.get("/options")
def get_dropdown_options():
    """Returns dynamic states, districts, soil types, seasons, and irrigation options for frontend."""
    if ai_resources["options"]:
        return ai_resources["options"]
    if os.path.exists(OPTIONS_PATH):
        with open(OPTIONS_PATH, "r", encoding="utf-8") as f:
            return json.load(f)
    raise HTTPException(status_code=404, detail="Frontend options schema not found.")


@app.post("/predict")
@app.post("/recommend")
def recommend_crop(req: CropPredictionRequest):
    """
    Two-Stage Crop Recommendation and Harvest Yield Prediction.
    Stage 1: Predicts broad Agricultural Family/Domain.
    Stage 2: Predicts Top-K ranked suitable crops with yield & production.
    """
    crop_model = ai_resources["crop_model"]
    cat_model = ai_resources["cat_model"]
    meta = ai_resources["metadata"]

    if crop_model is None or meta is None:
        raise HTTPException(status_code=503, detail="AI Recommendation models are still loading or unavailable.")

    # Harmonize legacy vs new payload fields
    state = req.State or "West Bengal"
    district = req.District or "Nadia"
    season = resolve_season(req.Crop_Season or req.season or "Kharif")
    soil = resolve_soil_type(req.Soil_Type or req.Soil or "Alluvial plains (proxy)")
    
    # Handle area (hectares)
    area_ha = req.Cultivated_Area_ha or req.area or 2.0
    try:
        area_ha = float(area_ha)
        if area_ha <= 0:
            area_ha = 1.0
    except (ValueError, TypeError):
        area_ha = 2.0

    rainfall = req.Rainfall_mm or req.Rainfall or 700.0
    temp = req.Average_Temperature_C or req.Temp or 28.0
    irrigation = resolve_irrigation(req.Irrigation_Availability or req.irrigation or "High (proxy)")
    
    # Moisture scaling
    moisture = req.Soil_Moisture_pct if req.Soil_Moisture_pct is not None else 25.0
    if 0 < moisture <= 1.0:
        moisture = moisture * 100.0

    ph = req.Soil_pH if req.Soil_pH is not None else 7.0

    # Auto-impute NPK if missing/zero
    baseline = get_soil_baseline(state, district)
    n = req.Nitrogen_N if (req.Nitrogen_N is not None and req.Nitrogen_N > 0) else baseline.get("Nitrogen_N", 85.0)
    p = req.Phosphorus_P if (req.Phosphorus_P is not None and req.Phosphorus_P > 0) else baseline.get("Phosphorus_P", 40.0)
    k = req.Potassium_K if (req.Potassium_K is not None and req.Potassium_K > 0) else baseline.get("Potassium_K", 40.0)
    npk_source = "Custom Farmer Input" if (req.Nitrogen_N is not None and req.Nitrogen_N > 0) else "Regional Soil Baseline"

    # Prepare input feature row
    features = meta.get("feature_columns", [
        "State", "District", "Crop_Season", "Soil_Type", "Cultivated_Area_ha",
        "Rainfall_mm", "Average_Temperature_C", "Irrigation_Availability",
        "Soil_Moisture_pct", "Soil_pH", "Nitrogen_N", "Phosphorus_P", "Potassium_K"
    ])
    cat_mappings = meta.get("categorical_mappings", {})

    row_data = {
        "State": state,
        "District": district,
        "Crop_Season": season,
        "Soil_Type": soil,
        "Cultivated_Area_ha": area_ha,
        "Rainfall_mm": float(rainfall),
        "Average_Temperature_C": float(temp),
        "Irrigation_Availability": irrigation,
        "Soil_Moisture_pct": float(moisture),
        "Soil_pH": float(ph),
        "Nitrogen_N": float(n),
        "Phosphorus_P": float(p),
        "Potassium_K": float(k)
    }

    encoded_vals = []
    for feat in features:
        val = row_data[feat]
        if feat in cat_mappings:
            mapping = cat_mappings[feat]
            code = mapping.get(str(val), -1)
            if code == -1:
                lower_map = {k.lower(): v for k, v in mapping.items()}
                code = lower_map.get(str(val).lower(), -1)
                if code == -1:
                    for k_map, v_code in mapping.items():
                        if str(val).lower() in k_map.lower():
                            code = v_code
                            break
            encoded_vals.append(code if code != -1 else 0)
        else:
            encoded_vals.append(float(val))

    x_input = pd.DataFrame([encoded_vals], columns=features)

    # Stage 1: Category Domain Prediction
    stage1_results = []
    if cat_model is not None:
        cat_probs = cat_model.predict_proba(x_input)[0]
        cat_classes = meta.get("crop_categories", list(cat_model.classes_))
        top_cat_indices = np.argsort(cat_probs)[::-1][:3]
        for idx in top_cat_indices:
            cat_name = cat_classes[idx] if idx < len(cat_classes) else str(idx)
            conf = round(float(cat_probs[idx]) * 100.0, 2)
            stage1_results.append({
                "category": cat_name,
                "confidence_pct": conf
            })

    # Stage 2: Specific Crop Prediction + Expected Harvest Yield
    crop_probs = crop_model.predict_proba(x_input)[0]
    crop_classes = meta.get("crop_classes", list(crop_model.classes_))
    top_k = min(max(req.top_k or 5, 1), 10)
    top_crop_indices = np.argsort(crop_probs)[::-1][:top_k]

    popular_names = ai_resources.get("popular_names", {})
    stage2_results = []
    for rank, idx in enumerate(top_crop_indices, 1):
        raw_crop = crop_classes[idx]
        conf = round(float(crop_probs[idx]) * 100.0, 2)
        yield_ha, total_harvest = calculate_harvest_yield(state, district, raw_crop, area_ha)
        stage2_results.append({
            "rank": rank,
            "crop_name": raw_crop,
            "popular_indian_name": popular_names.get(raw_crop, raw_crop),
            "confidence_pct": conf,
            "expected_yield_tonnes_per_ha": yield_ha,
            "expected_total_harvest_tonnes": total_harvest
        })

    # Top prediction for backward compatibility with existing single-crop consumer
    top_crop = stage2_results[0]["crop_name"] if stage2_results else "Rice"

    return {
        "success": True,
        "status": "success",
        "prediction": top_crop,  # Legacy field
        "farm_summary": {
            "location": f"{district}, {state}",
            "state": state,
            "district": district,
            "cultivated_area_ha": area_ha,
            "cultivated_area_acres": round(area_ha * 2.47105, 2),
            "season": season,
            "soil_type": soil,
            "soil_moisture_pct": moisture,
            "soil_ph": ph,
            "npk_used": {
                "Nitrogen_N": round(n, 1),
                "Phosphorus_P": round(p, 1),
                "Potassium_K": round(k, 1),
                "source": npk_source
            }
        },
        "stage1_domain": stage1_results,
        "stage2_recommendations": stage2_results
    }


# ==============================================================================
# Crop Disease Pathology Vision Diagnostics (model_v1.pt - EfficientNet-B0)
# ==============================================================================

class DiseasePredictRequest(BaseModel):
    image: str = Field(..., description="Base64 encoded foliar image or data URI")

@app.post("/predict-disease")
@app.post("/disease/predict")
async def predict_disease_api(req: DiseasePredictRequest):
    """
    Diagnoses foliar plant diseases using fine-tuned EfficientNet-B0 (model_v1.pt).
    Supports 38 disease categories across 14 crops with precision fungicide treatments.
    """
    try:
        from predict_disease import predict_from_base64
        result = predict_from_base64(req.image)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Vision pathology diagnosis failed: {str(e)}")

@app.get("/disease/classes")
async def get_disease_classes():
    """Returns the list of 38 recognizable foliar disease classes"""
    from predict_disease import CLASS_NAMES
    return {"classes": CLASS_NAMES, "total": len(CLASS_NAMES)}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=False)

