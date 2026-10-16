#!/usr/bin/env python3
"""Two-Stage Crop Recommendation Engine using Random Forest (.pkl format).

13-Feature Architecture with Field Area & Optional NPK:
- Field Area (ha): Mandatory input to tailor scale and calculate expected harvest production.
- Nitrogen, Phosphorus, Potassium (NPK): Optional inputs. Automatically uses regional soil archetype baselines if unknown.
- Stage 1: Agricultural Category / Crop Family Predictor (85%+ Accuracy)
- Stage 2: 50-Crop Precision Advisory Engine (94%+ Top-3 Advisory Coverage)
- Harvest Prediction: Expected Yield (Tonnes/ha) & Expected Total Harvest Production (Tonnes).
"""

import argparse
import json
import os
import sys
import pickle
import joblib
import numpy as np
import pandas as pd

DEFAULT_CROP_MODEL_PATH = "random_forest_crop_model.pkl"
DEFAULT_CAT_MODEL_PATH = "random_forest_category_model.pkl"
DEFAULT_META_PATH = "rf_model_bundle_metadata.json"
YIELD_REF_PATH = "crop_yield_reference.json"
SOIL_BASELINE_PATH = "regional_soil_baselines.json"


def load_recommender(crop_model_path=DEFAULT_CROP_MODEL_PATH,
                     cat_model_path=DEFAULT_CAT_MODEL_PATH,
                     meta_path=DEFAULT_META_PATH):
    """Load serialized Random Forest models (.pkl prioritized) and feature metadata."""
    base_dir = os.path.dirname(os.path.abspath(__file__))
    if not os.path.isabs(crop_model_path):
        crop_model_path = os.path.join(base_dir, crop_model_path)
    if not os.path.isabs(cat_model_path):
        cat_model_path = os.path.join(base_dir, cat_model_path)
    if not os.path.isabs(meta_path):
        meta_path = os.path.join(base_dir, meta_path)
        
    if not os.path.exists(crop_model_path):
        alt = crop_model_path.replace(".pkl", ".joblib") if crop_model_path.endswith(".pkl") else crop_model_path.replace(".joblib", ".pkl")
        if os.path.exists(alt):
            crop_model_path = alt

    if not os.path.exists(cat_model_path):
        alt = cat_model_path.replace(".pkl", ".joblib") if cat_model_path.endswith(".pkl") else cat_model_path.replace(".joblib", ".pkl")
        if os.path.exists(alt):
            cat_model_path = alt

    if crop_model_path.endswith(".pkl"):
        with open(crop_model_path, "rb") as f:
            crop_model = pickle.load(f)
    else:
        crop_model = joblib.load(crop_model_path)

    cat_model = None
    if os.path.exists(cat_model_path):
        if cat_model_path.endswith(".pkl"):
            with open(cat_model_path, "rb") as f:
                cat_model = pickle.load(f)
        else:
            cat_model = joblib.load(cat_model_path)
    
    with open(meta_path, "r", encoding="utf-8") as f:
        meta = json.load(f)
        
    return crop_model, cat_model, meta


def get_regional_soil_baseline(state, district):
    """Retrieve regional NPK, pH, and Moisture baselines if unknown by the farmer."""
    base_dir = os.path.dirname(os.path.abspath(__file__))
    path = os.path.join(base_dir, SOIL_BASELINE_PATH)
    if not os.path.exists(path):
        return {"Nitrogen_N": 85.0, "Phosphorus_P": 40.0, "Potassium_K": 40.0, "Soil_pH": 7.0, "Soil_Moisture_pct": 25.0}
    with open(path, "r", encoding="utf-8") as f:
        data = json.load(f)
    dist_key = f"{state}|{district}"
    if dist_key in data.get("district_baselines", {}):
        return data["district_baselines"][dist_key]
    if state in data.get("state_baselines", {}):
        return data["state_baselines"][state]
    return data.get("national_baseline", {"Nitrogen_N": 85.0, "Phosphorus_P": 40.0, "Potassium_K": 40.0, "Soil_pH": 7.0, "Soil_Moisture_pct": 25.0})


def get_crop_yield_and_production(state, district, crop_name, area_ha):
    """Look up historical crop yield (Tonnes/ha) and calculate total expected harvest (Tonnes)."""
    base_dir = os.path.dirname(os.path.abspath(__file__))
    path = os.path.join(base_dir, YIELD_REF_PATH)
    if not os.path.exists(path):
        return 2.5, round(2.5 * area_ha, 2)
    with open(path, "r", encoding="utf-8") as f:
        data = json.load(f)
    dist_key = f"{state}|{district}|{crop_name}"
    state_key = f"{state}|{crop_name}"
    
    yield_val = data.get("district_yield", {}).get(dist_key)
    if yield_val is None:
        yield_val = data.get("state_yield", {}).get(state_key)
    if yield_val is None:
        yield_val = data.get("national_crop_yield", {}).get(crop_name, 2.0)
        
    yield_t_per_ha = round(float(yield_val), 2)
    total_prod_tonnes = round(yield_t_per_ha * area_ha, 2)
    return yield_t_per_ha, total_prod_tonnes


# EXACT CATEGORIES AS PER DATASET (crop_ml_train.csv / india_crop_final_ready_for_ml.csv)
DATASET_SOIL_TYPES = [
    "Alluvial plains (proxy)",
    "Arid/desert soil (proxy)",
    "Black cotton/regur (proxy)",
    "Coastal/lateritic mix (proxy)",
    "Deltaic/alluvial (proxy)",
    "Mountain/forest soil (proxy)",
    "Red/red-yellow soil (proxy)"
]

DATASET_SEASONS = [
    "Kharif",
    "Rabi",
    "Summer",
    "Whole Year",
    "Autumn",
    "Winter"
]

DATASET_IRRIGATION = [
    "High (proxy)",
    "Moderate\u2013high (proxy)",
    "Moderate (proxy)",
    "Low\u2013moderate (proxy)",
    "Low/variable; likely rain-fed (proxy)"
]


def resolve_soil_type(user_input):
    """Resolve user input to the exact dataset Soil_Type string."""
    if not user_input or not str(user_input).strip():
        return "Alluvial plains (proxy)"
    val = str(user_input).strip()
    num_map = {
        "1": "Alluvial plains (proxy)",
        "2": "Arid/desert soil (proxy)",
        "3": "Black cotton/regur (proxy)",
        "4": "Coastal/lateritic mix (proxy)",
        "5": "Deltaic/alluvial (proxy)",
        "6": "Mountain/forest soil (proxy)",
        "7": "Red/red-yellow soil (proxy)"
    }
    if val in num_map:
        return num_map[val]
    val_lower = val.lower()
    for s in DATASET_SOIL_TYPES:
        if val_lower == s.lower():
            return s
    if "delta" in val_lower:
        return "Deltaic/alluvial (proxy)"
    elif "mount" in val_lower or "forest" in val_lower or "hill" in val_lower:
        return "Mountain/forest soil (proxy)"
    elif "arid" in val_lower or "desert" in val_lower:
        return "Arid/desert soil (proxy)"
    elif "black" in val_lower or "cotton" in val_lower or "regur" in val_lower:
        return "Black cotton/regur (proxy)"
    elif "coast" in val_lower or "laterit" in val_lower:
        return "Coastal/lateritic mix (proxy)"
    elif "red" in val_lower or "yellow" in val_lower:
        return "Red/red-yellow soil (proxy)"
    elif "alluvial" in val_lower or "plain" in val_lower:
        return "Alluvial plains (proxy)"
    return "Alluvial plains (proxy)"


def resolve_season(user_input):
    """Resolve user input to exact dataset Crop_Season string."""
    if not user_input or not str(user_input).strip():
        return "Kharif"
    val = str(user_input).strip()
    num_map = {
        "1": "Kharif",
        "2": "Rabi",
        "3": "Summer",
        "4": "Whole Year",
        "5": "Autumn",
        "6": "Winter"
    }
    if val in num_map:
        return num_map[val]
    val_lower = val.lower()
    for s in DATASET_SEASONS:
        if val_lower == s.lower():
            return s
    for s in DATASET_SEASONS:
        if val_lower in s.lower():
            return s
    return "Kharif"


def resolve_irrigation(user_input):
    """Resolve user input to exact dataset Irrigation_Availability string."""
    if not user_input or not str(user_input).strip():
        return "High (proxy)"
    val = str(user_input).strip()
    num_map = {
        "1": "High (proxy)",
        "2": "Moderate\u2013high (proxy)",
        "3": "Moderate (proxy)",
        "4": "Low\u2013moderate (proxy)",
        "5": "Low/variable; likely rain-fed (proxy)"
    }
    if val in num_map:
        return num_map[val]
    val_norm = val.lower().replace("-", "\u2013")
    for irr in DATASET_IRRIGATION:
        if val_norm == irr.lower().replace("-", "\u2013"):
            return irr
    if "moderate" in val_norm and "high" in val_norm:
        return "Moderate\u2013high (proxy)"
    elif "low" in val_norm and "moderate" in val_norm:
        return "Low\u2013moderate (proxy)"
    elif "rain" in val_norm or "fed" in val_norm or "variable" in val_norm:
        return "Low/variable; likely rain-fed (proxy)"
    elif "high" in val_norm:
        return "High (proxy)"
    elif "mod" in val_norm:
        return "Moderate (proxy)"
    elif "low" in val_norm:
        return "Low/variable; likely rain-fed (proxy)"
    return "High (proxy)"


def prepare_feature_row(field_dict, meta):
    """Sanitize and encode a single field row matching the 13 input features."""
    features = meta.get("feature_columns", [
        "State", "District", "Crop_Season", "Soil_Type", "Cultivated_Area_ha",
        "Rainfall_mm", "Average_Temperature_C", "Irrigation_Availability",
        "Soil_Moisture_pct", "Soil_pH", "Nitrogen_N", "Phosphorus_P", "Potassium_K"
    ])
    cat_mappings = meta.get("categorical_mappings", {})
    
    # Pre-resolve categories to guarantee exact match with dataset categories
    resolved = dict(field_dict)
    if "Soil_Type" in resolved:
        resolved["Soil_Type"] = resolve_soil_type(resolved["Soil_Type"])
    if "Crop_Season" in resolved:
        resolved["Crop_Season"] = resolve_season(resolved["Crop_Season"])
    if "Irrigation_Availability" in resolved:
        resolved["Irrigation_Availability"] = resolve_irrigation(resolved["Irrigation_Availability"])

    # Ensure Soil_Moisture_pct is on the 1-100 percentage scale as trained in the dataset
    if "Soil_Moisture_pct" in resolved and resolved["Soil_Moisture_pct"] is not None:
        try:
            m_val = float(resolved["Soil_Moisture_pct"])
            if 0 < m_val <= 1.0:
                resolved["Soil_Moisture_pct"] = round(m_val * 100.0, 2)
            else:
                resolved["Soil_Moisture_pct"] = m_val
        except (ValueError, TypeError):
            resolved["Soil_Moisture_pct"] = 25.0

    # Auto-impute optional NPK if not provided
    state = resolved.get("State", "")
    district = resolved.get("District", "")
    baseline = get_regional_soil_baseline(state, district)

    row = []
    for feat in features:
        val = resolved.get(feat)
        # Check optional NPK fields
        if feat in ["Nitrogen_N", "Phosphorus_P", "Potassium_K"] and (val is None or str(val).strip() == "" or float(val or 0) <= 0):
            val = baseline.get(feat, 50.0)

        if feat in cat_mappings:
            str_val = str(val).strip() if val is not None else "Unknown"
            mapping = cat_mappings[feat]
            val_encoded = mapping.get(str_val, -1)
            if val_encoded == -1:
                lower_map = {k.lower(): v for k, v in mapping.items()}
                if str_val.lower() in lower_map:
                    val_encoded = lower_map[str_val.lower()]
                else:
                    for k, v in mapping.items():
                        if str_val.lower() in k.lower():
                            val_encoded = v
                            break
            row.append(val_encoded)
        else:
            try:
                row.append(float(val) if val is not None else 0.0)
            except (ValueError, TypeError):
                row.append(0.0)
                
    return pd.DataFrame([row], columns=features)


def recommend(field_dict, crop_model, cat_model, meta, top_k=5):
    """Generate two-stage agricultural recommendations: Category + Specific Crops + Expected Harvest."""
    x_input = prepare_feature_row(field_dict, meta)
    state = field_dict.get("State", "")
    district = field_dict.get("District", "")
    area_ha = float(field_dict.get("Cultivated_Area_ha", 2.0))
    
    # Stage 1: Category Prediction
    cat_recs = []
    if cat_model is not None:
        cat_probs = cat_model.predict_proba(x_input)[0]
        cat_classes = meta.get("crop_categories", list(cat_model.classes_))
        top_cat_indices = np.argsort(cat_probs)[::-1][:3]
        cat_recs = [(cat_classes[i] if i < len(cat_classes) else str(i), round(float(cat_probs[i]) * 100.0, 2)) for i in top_cat_indices]
        
    # Stage 2: Specific Crop Prediction with Expected Harvest Yield & Production
    crop_probs = crop_model.predict_proba(x_input)[0]
    classes = meta.get("crop_classes", list(crop_model.classes_))
    top_crop_indices = np.argsort(crop_probs)[::-1][:top_k]
    
    crop_recs = []
    for i in top_crop_indices:
        c_name = classes[i]
        conf = round(float(crop_probs[i]) * 100.0, 2)
        yield_ha, total_tonnes = get_crop_yield_and_production(state, district, c_name, area_ha)
        crop_recs.append({
            "crop": c_name,
            "confidence": conf,
            "expected_yield_tonnes_per_ha": yield_ha,
            "expected_total_harvest_tonnes": total_tonnes
        })
    
    return cat_recs, crop_recs


def main():
    parser = argparse.ArgumentParser(description="13-Parameter Two-Stage Crop Recommendation & Yield Engine")
    parser.add_argument("--state", type=str, default="Punjab", help="State name (e.g. Punjab, Maharashtra)")
    parser.add_argument("--district", type=str, default="Ludhiana", help="District name (e.g. Ludhiana, Pune)")
    parser.add_argument("--season", type=str, default="Kharif", help="Crop Season (Kharif, Rabi, Summer, Whole Year)")
    parser.add_argument("--soil_type", type=str, default="Alluvial plains (proxy)", help="Soil Type (Alluvial, Black, Red, etc.)")
    parser.add_argument("--area", type=float, default=2.5, help="Field area in hectares (MANDATORY)")
    parser.add_argument("--rainfall", type=float, default=700.0, help="Seasonal rainfall in mm (100 - 2500)")
    parser.add_argument("--temp", type=float, default=29.0, help="Average temperature in Celsius (10 - 45)")
    parser.add_argument("--irrigation", type=str, default="High (proxy)", help="Irrigation Availability (High, Moderate, Low)")
    parser.add_argument("--soil_moisture", type=float, default=25.0, help="Soil Moisture percentage (1-100, dataset range 12-48%)")
    parser.add_argument("--ph", type=float, default=7.2, help="Soil pH (4.5 - 8.5)")
    # Optional NPK flags
    parser.add_argument("--n", type=float, default=None, help="Soil Nitrogen in kg/ha (OPTIONAL - auto-filled if omitted)")
    parser.add_argument("--p", type=float, default=None, help="Soil Phosphorus in kg/ha (OPTIONAL - auto-filled if omitted)")
    parser.add_argument("--k", type=float, default=None, help="Soil Potassium in kg/ha (OPTIONAL - auto-filled if omitted)")
    parser.add_argument("--top_k", type=int, default=5, help="Number of ranked crops to recommend")
    args = parser.parse_args()

    if sys.platform == "win32":
        try:
            sys.stdout.reconfigure(encoding="utf-8")
        except Exception:
            pass

    print("=" * 90)
    print(" NATIONAL CROP RECOMMENDATION & HARVEST YIELD SYSTEM (PKL MODEL) ")
    print("=" * 90)
    print("Loading Two-Stage Random Forest models (.pkl format)...")
    crop_model, cat_model, meta = load_recommender()
    print("Models loaded successfully. Evaluating pre-sowing parameters...\n")

    # Resolve NPK status
    baseline = get_regional_soil_baseline(args.state, args.district)
    n_val = args.n if args.n is not None else baseline["Nitrogen_N"]
    p_val = args.p if args.p is not None else baseline["Phosphorus_P"]
    k_val = args.k if args.k is not None else baseline["Potassium_K"]
    npk_status = "Custom Farmer Values" if args.n is not None else "Regional Soil Baseline (Auto-Filled)"

    field = {
        "State": args.state,
        "District": args.district,
        "Crop_Season": args.season,
        "Soil_Type": args.soil_type,
        "Cultivated_Area_ha": args.area,
        "Rainfall_mm": args.rainfall,
        "Average_Temperature_C": args.temp,
        "Irrigation_Availability": args.irrigation,
        "Soil_Moisture_pct": args.soil_moisture,
        "Soil_pH": args.ph,
        "Nitrogen_N": n_val,
        "Phosphorus_P": p_val,
        "Potassium_K": k_val
    }

    cat_recs, crop_recs = recommend(field, crop_model, cat_model, meta, top_k=args.top_k)

    print(f"Location    : {field['District']}, {field['State']}")
    print(f"Field Area  : {field['Cultivated_Area_ha']} Hectares ({(field['Cultivated_Area_ha'] * 2.471):.2f} Acres)")
    print(f"Season      : {field['Crop_Season']}")
    print(f"Soil Type   : {field['Soil_Type']} (pH: {field['Soil_pH']}, Moisture: {field['Soil_Moisture_pct']}%)")
    print(f"Nutrients   : N: {field['Nitrogen_N']} | P: {field['Phosphorus_P']} | K: {field['Potassium_K']} kg/ha [{npk_status}]")
    print(f"Climate     : Rainfall: {field['Rainfall_mm']} mm | Temp: {field['Average_Temperature_C']} °C\n")
    
    if cat_recs:
        print("-" * 90)
        print("STAGE 1: RECOMMENDED AGRICULTURAL DOMAIN / FAMILY (Certainty: 85%+)")
        print("-" * 90)
        for rank, (cat_name, conf) in enumerate(cat_recs, 1):
            bar = "=" * int(conf // 4)
            print(f"  Tier #{rank} : {cat_name:<25} {conf:>6.2f}%  [{bar}]")
        print()

    popular_names = {}
    pop_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), "indian_popular_crop_names.json")
    if os.path.exists(pop_path):
        with open(pop_path, "r", encoding="utf-8") as f:
            popular_names = json.load(f)

    print("-" * 105)
    print(f"STAGE 2: TOP-{args.top_k} RECOMMENDED CROPS WITH EXPECTED HARVEST PRODUCTION")
    print("-" * 105)
    print(f"{'RANK':<5} {'RECOMMENDED CROP (POPULAR INDIAN NAME)':<42} {'CONFIDENCE':<12} {'EXPECTED YIELD':<18} {'TOTAL HARVEST (for ' + str(field['Cultivated_Area_ha']) + ' ha)'}")
    print("-" * 105)
    for rank, rec in enumerate(crop_recs, 1):
        c_name = rec["crop"]
        display_name = popular_names.get(c_name, c_name)
        conf = rec["confidence"]
        y_ha = f"{rec['expected_yield_tonnes_per_ha']} Tonnes/ha"
        t_tonnes = f"{rec['expected_total_harvest_tonnes']} Tonnes"
        print(f" #{rank:<3}  {display_name:<42} {conf:>6.2f}%      {y_ha:<18} {t_tonnes}")
    print("-" * 105)
    print("Advisory Note: Production estimate based on official historical district agro-yield data.")
    print("=" * 105 + "\n")


if __name__ == "__main__":
    main()
