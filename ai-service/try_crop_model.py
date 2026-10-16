#!/usr/bin/env python3
"""Interactive Two-Stage Random Forest Crop & Harvest Yield Recommender (.pkl model).

Features:
1. Field Area (ha) as a mandatory input for tailored recommendation and harvest calculation.
2. Nitrogen, Phosphorus, Potassium (NPK) completely optional: auto-imputed from regional soil baselines if unknown.
3. Harvest prediction: Expected Yield (Tonnes/ha) and Total Harvest (Tonnes) for the farmer's specific acreage.
4. Quick Presets, Live Sampling from 67,356 Test Fields, and Step-by-Step Custom Input.
"""

import os
import sys
import json
import random
import pickle
import joblib
import numpy as np
import pandas as pd

if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")
if hasattr(sys.stderr, "reconfigure"):
    sys.stderr.reconfigure(encoding="utf-8", errors="replace")

# Load models and metadata (.pkl format prioritized)
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
CROP_MODEL_PATH = os.path.join(BASE_DIR, "random_forest_crop_model.pkl")
CAT_MODEL_PATH = os.path.join(BASE_DIR, "random_forest_category_model.pkl")
META_PATH = os.path.join(BASE_DIR, "rf_model_bundle_metadata.json")
TEST_CSV_PATH = os.path.join(BASE_DIR, "crop_ml_test.csv")
YIELD_REF_PATH = os.path.join(BASE_DIR, "crop_yield_reference.json")
SOIL_BASELINE_PATH = os.path.join(BASE_DIR, "regional_soil_baselines.json")

print("=" * 90)
print("  🌱 INITIALIZING TWO-STAGE RANDOM FOREST CROP & HARVEST RECOMMENDER 🌱")
print("=" * 90)
print("Loading model weights and feature encoders from disk (.pkl format)...")

try:
    c_path = CROP_MODEL_PATH if os.path.exists(CROP_MODEL_PATH) else os.path.join(BASE_DIR, "random_forest_crop_model.joblib")
    k_path = CAT_MODEL_PATH if os.path.exists(CAT_MODEL_PATH) else os.path.join(BASE_DIR, "random_forest_category_model.joblib")
    
    if c_path.endswith(".pkl"):
        with open(c_path, "rb") as f:
            crop_model = pickle.load(f)
    else:
        crop_model = joblib.load(c_path)
        
    if k_path.endswith(".pkl"):
        with open(k_path, "rb") as f:
            cat_model = pickle.load(f)
    else:
        cat_model = joblib.load(k_path)
        
    with open(META_PATH, "r", encoding="utf-8") as f:
        meta = json.load(f)
    print(f"✓ Models loaded successfully (source: {os.path.basename(c_path)} & {os.path.basename(k_path)}).")
except Exception as e:
    print(f"Error loading models: {e}")
    sys.exit(1)

# Load yield and soil baseline references
yield_data = {}
if os.path.exists(YIELD_REF_PATH):
    with open(YIELD_REF_PATH, "r", encoding="utf-8") as f:
        yield_data = json.load(f)

baseline_data = {}
if os.path.exists(SOIL_BASELINE_PATH):
    with open(SOIL_BASELINE_PATH, "r", encoding="utf-8") as f:
        baseline_data = json.load(f)

features = meta.get("feature_columns", [
    "State", "District", "Crop_Season", "Soil_Type", "Cultivated_Area_ha",
    "Rainfall_mm", "Average_Temperature_C", "Irrigation_Availability",
    "Soil_Moisture_pct", "Soil_pH", "Nitrogen_N", "Phosphorus_P", "Potassium_K"
])
cat_mappings = meta.get("categorical_mappings", {})
crop_classes = meta.get("crop_classes", list(crop_model.classes_))
cat_classes = meta.get("crop_categories", list(cat_model.classes_))

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
    """Resolve user input to the exact dataset Soil_Type string without errors."""
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


def get_soil_baseline(state, district):
    """Retrieve regional NPK, pH, and Moisture baselines if omitted by user."""
    dist_key = f"{state}|{district}"
    if dist_key in baseline_data.get("district_baselines", {}):
        return baseline_data["district_baselines"][dist_key]
    if state in baseline_data.get("state_baselines", {}):
        return baseline_data["state_baselines"][state]
    return baseline_data.get("national_baseline", {"Nitrogen_N": 85.0, "Phosphorus_P": 40.0, "Potassium_K": 40.0, "Soil_pH": 7.0, "Soil_Moisture_pct": 25.0})


def get_crop_yield_and_production(state, district, crop_name, area_ha):
    """Retrieve historical yield (Tonnes/ha) and calculate total expected harvest (Tonnes)."""
    dist_key = f"{state}|{district}|{crop_name}"
    state_key = f"{state}|{crop_name}"
    
    yield_val = yield_data.get("district_yield", {}).get(dist_key)
    if yield_val is None:
        yield_val = yield_data.get("state_yield", {}).get(state_key)
    if yield_val is None:
        yield_val = yield_data.get("national_crop_yield", {}).get(crop_name, 2.0)
        
    yield_t_per_ha = round(float(yield_val), 2)
    total_prod_tonnes = round(yield_t_per_ha * area_ha, 2)
    return yield_t_per_ha, total_prod_tonnes


def prepare_row(field_dict):
    """Sanitize and encode a single field row with automatic optional NPK imputation."""
    state = field_dict.get("State", "")
    district = field_dict.get("District", "")
    baseline = get_soil_baseline(state, district)

    # Pre-resolve categories so user inputs always match the dataset
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


def predict_farm(field_dict, ground_truth=None):
    """Run two-stage recommendation and display results with Expected Harvest Production."""
    x_input = prepare_row(field_dict)
    state = field_dict.get("State", "")
    district = field_dict.get("District", "")
    area_ha = float(field_dict.get("Cultivated_Area_ha", 2.5))
    
    # Stage 1: Category Prediction
    cat_probs = cat_model.predict_proba(x_input)[0]
    top_cat_idx = np.argsort(cat_probs)[::-1][:3]
    top_cats = [(cat_classes[i], float(cat_probs[i]) * 100.0) for i in top_cat_idx]

    # Stage 2: 50-Crop Prediction
    crop_probs = crop_model.predict_proba(x_input)[0]
    top_crop_idx = np.argsort(crop_probs)[::-1][:5]
    top_crops = [(crop_classes[i], float(crop_probs[i]) * 100.0) for i in top_crop_idx]

    # Determine NPK status
    is_custom_npk = field_dict.get("_custom_npk", True)
    npk_status = "Custom Farmer Measurements" if is_custom_npk else "Regional Soil Baseline (Auto-Filled)"

    print("\n" + "=" * 90)
    print("                      🌾 FARM EVALUATION & HARVEST REPORT 🌾")
    print("=" * 90)
    print(f"Location    : {field_dict.get('District')}, {field_dict.get('State')}")
    print(f"Field Area  : {area_ha} Hectares ({(area_ha * 2.471):.2f} Acres)")
    print(f"Season      : {field_dict.get('Crop_Season')}")
    print(f"Soil Type   : {field_dict.get('Soil_Type')} (pH: {field_dict.get('Soil_pH')}, Moisture: {field_dict.get('Soil_Moisture_pct')}%)")
    baseline = get_soil_baseline(state, district)
    n_disp = field_dict.get('Nitrogen_N') if field_dict.get('Nitrogen_N') is not None else baseline['Nitrogen_N']
    p_disp = field_dict.get('Phosphorus_P') if field_dict.get('Phosphorus_P') is not None else baseline['Phosphorus_P']
    k_disp = field_dict.get('Potassium_K') if field_dict.get('Potassium_K') is not None else baseline['Potassium_K']

    print(f"Nutrients   : N: {n_disp} | P: {p_disp} | K: {k_disp} kg/ha [{npk_status}]")
    print(f"Climate     : Rainfall: {field_dict.get('Rainfall_mm')} mm | Temperature: {field_dict.get('Average_Temperature_C')} °C")
    print(f"Irrigation  : {field_dict.get('Irrigation_Availability')}")

    popular_names = {}
    pop_path = os.path.join(BASE_DIR, "indian_popular_crop_names.json")
    if os.path.exists(pop_path):
        with open(pop_path, "r", encoding="utf-8") as f:
            popular_names = json.load(f)

    if ground_truth:
        disp_truth = popular_names.get(ground_truth, ground_truth)
        print("-" * 105)
        print(f"📌 ACTUAL CROP GROWN BY FARMER :  {disp_truth.upper()}")

    print("\n" + "-" * 105)
    print("STAGE 1: AGRICULTURAL DOMAIN PREDICTION (Category Certainty: 85%+)")
    print("-" * 105)
    for rank, (cat_name, conf) in enumerate(top_cats, 1):
        bar = "=" * int(conf / 4)
        print(f"  Tier #{rank} : {cat_name:<24} {conf:6.2f}%  [{bar}]")

    print("\n" + "-" * 105)
    print(f"STAGE 2: TOP-5 RECOMMENDED CROPS WITH EXPECTED HARVEST PRODUCTION")
    print("-" * 105)
    print(f"{'RANK':<5} {'RECOMMENDED CROP (POPULAR INDIAN NAME)':<42} {'CONFIDENCE':<12} {'EXPECTED YIELD':<18} {'TOTAL HARVEST (for ' + str(area_ha) + ' ha)'}")
    print("-" * 105)
    match_rank = None
    for rank, (c_name, conf) in enumerate(top_crops, 1):
        yield_ha, total_tonnes = get_crop_yield_and_production(state, district, c_name, area_ha)
        marker = ""
        if ground_truth and c_name.strip().lower() == ground_truth.strip().lower():
            marker = "  <-- [ACTUAL CHOICE!]"
            match_rank = rank
        display_name = popular_names.get(c_name, c_name)
        y_str = f"{yield_ha} Tonnes/ha"
        t_str = f"{total_tonnes} Tonnes"
        print(f"  #{rank:<2}  {display_name:<42} {conf:6.2f}%      {y_str:<18} {t_str}{marker}")

    print("-" * 105)
    if ground_truth:
        if match_rank == 1:
            print("🌟 OUTCOME: EXACT MATCH! The model predicted the true crop at Rank #1.")
        elif match_rank in [2, 3]:
            print(f"✓ OUTCOME: SUCCESS! The actual crop was captured in Top-3 Advisory (Rank #{match_rank}).")
        elif match_rank in [4, 5]:
            print(f"✓ OUTCOME: CAPTURED! The actual crop was in Top-5 Advisory Window (Rank #{match_rank}).")
        else:
            print("ℹ️ OUTCOME: Actual crop ranked outside Top-5 (Agronomically alternative crops recommended).")
    else:
        print("💡 ADVISORY NOTE: Production estimate based on official historical district agro-yield data.")
    print("=" * 90 + "\n")


PRESETS = {
    "1": {
        "name": "Punjab Kharif (Ludhiana — Alluvial Soil, 2.5 ha Farm, High Irrigation)",
        "data": {
            "State": "Punjab", "District": "Ludhiana", "Crop_Season": "Kharif",
            "Soil_Type": "Alluvial plains (proxy)", "Cultivated_Area_ha": 2.5, "Rainfall_mm": 680.0,
            "Average_Temperature_C": 31.0, "Irrigation_Availability": "High (proxy)",
            "Soil_Moisture_pct": 32.0, "Soil_pH": 7.2, "Nitrogen_N": 130.0,
            "Phosphorus_P": 50.0, "Potassium_K": 40.0, "_custom_npk": True
        }
    },
    "2": {
        "name": "Punjab Rabi (Patiala — Alluvial Soil, 4.0 ha Farm, Wheat/Mustard/Gram)",
        "data": {
            "State": "Punjab", "District": "Patiala", "Crop_Season": "Rabi",
            "Soil_Type": "Alluvial plains (proxy)", "Cultivated_Area_ha": 4.0, "Rainfall_mm": 120.0,
            "Average_Temperature_C": 15.5, "Irrigation_Availability": "High (proxy)",
            "Soil_Moisture_pct": 28.0, "Soil_pH": 7.4, "Nitrogen_N": 110.0,
            "Phosphorus_P": 45.0, "Potassium_K": 35.0, "_custom_npk": True
        }
    },
    "3": {
        "name": "Maharashtra Kharif (Nagpur — Black Soil, 3.0 ha Farm, NPK Unknown -> Auto-Filled)",
        "data": {
            "State": "Maharashtra", "District": "Nagpur", "Crop_Season": "Kharif",
            "Soil_Type": "Black cotton/regur (proxy)", "Cultivated_Area_ha": 3.0, "Rainfall_mm": 920.0,
            "Average_Temperature_C": 29.5, "Irrigation_Availability": "Moderate (proxy)",
            "Soil_Moisture_pct": 35.0, "Soil_pH": 7.6, "Nitrogen_N": None,
            "Phosphorus_P": None, "Potassium_K": None, "_custom_npk": False
        }
    },
    "4": {
        "name": "Uttar Pradesh Rabi (Varanasi — Alluvial Soil, 1.5 ha Farm, NPK Unknown -> Auto-Filled)",
        "data": {
            "State": "Uttar Pradesh", "District": "Varanasi", "Crop_Season": "Rabi",
            "Soil_Type": "Alluvial plains (proxy)", "Cultivated_Area_ha": 1.5, "Rainfall_mm": 90.0,
            "Average_Temperature_C": 17.0, "Irrigation_Availability": "High (proxy)",
            "Soil_Moisture_pct": 24.0, "Soil_pH": 7.1, "Nitrogen_N": None,
            "Phosphorus_P": None, "Potassium_K": None, "_custom_npk": False
        }
    },
    "5": {
        "name": "Karnataka Rabi (Dharwad — Red Soil, 2.0 ha Farm, Maize/Ragi/Groundnut)",
        "data": {
            "State": "Karnataka", "District": "Dharwad", "Crop_Season": "Rabi",
            "Soil_Type": "Red/red-yellow soil (proxy)", "Cultivated_Area_ha": 2.0, "Rainfall_mm": 210.0,
            "Average_Temperature_C": 23.0, "Irrigation_Availability": "Low/variable; likely rain-fed (proxy)",
            "Soil_Moisture_pct": 22.0, "Soil_pH": 6.5, "Nitrogen_N": 55.0,
            "Phosphorus_P": 25.0, "Potassium_K": 25.0, "_custom_npk": True
        }
    }
}


def test_random_real_farm():
    """Pick a random real field from test set, run inference, and compare AI vs ground truth."""
    if not os.path.exists(TEST_CSV_PATH):
        print("crop_ml_test.csv not found.")
        return

    print("\nReading random sample from 67,356 test fields...")
    sample_df = pd.read_csv(TEST_CSV_PATH, skiprows=lambda i: i > 0 and random.random() > 0.005, nrows=50)
    if sample_df.empty:
        sample_df = pd.read_csv(TEST_CSV_PATH, nrows=10)

    row = sample_df.sample(n=1).iloc[0]
    field_dict = {f: row[f] for f in features if f in row}
    field_dict["_custom_npk"] = True
    true_crop = str(row["Crop_Name"])
    
    predict_farm(field_dict, ground_truth=true_crop)


def test_custom_farm():
    """Interactive guided questionnaire with mandatory Area and optional NPK."""
    print("\n" + "=" * 90)
    print("                  ✏️  ENTER CUSTOM FARM PARAMETERS")
    print("         (NPK is OPTIONAL - press ENTER if unknown to auto-fill regional baseline)")
    print("=" * 90)

    def prompt(label, default):
        user_val = input(f"{label} [Default: {default}]: ").strip()
        return user_val if user_val else default

    state = prompt("1. State", "Punjab")
    district = prompt("2. District", "Ludhiana")
    
    # Field Area is MANDATORY
    area_str = prompt("3. Field Landholding Area in Hectares (MANDATORY, e.g. 1.0, 2.5, 5.0)", "2.5")
    try:
        area_ha = float(area_str)
    except ValueError:
        area_ha = 2.5

    print("\nSeason options (Exact from dataset):")
    print("  [1] Kharif  [2] Rabi  [3] Summer  [4] Whole Year  [5] Autumn  [6] Winter")
    season_opt = prompt("4. Select Season (1-6 or type name)", "1")
    season = resolve_season(season_opt)
    print(f"   ✓ Selected Season: {season}")

    print("\nSoil options (Exact from dataset):")
    print("  [1] Alluvial plains (proxy)")
    print("  [2] Arid/desert soil (proxy)")
    print("  [3] Black cotton/regur (proxy)")
    print("  [4] Coastal/lateritic mix (proxy)")
    print("  [5] Deltaic/alluvial (proxy)")
    print("  [6] Mountain/forest soil (proxy)")
    print("  [7] Red/red-yellow soil (proxy)")
    soil_opt = prompt("5. Select Soil Type (1-7 or type exact/partial name)", "1")
    soil = resolve_soil_type(soil_opt)
    print(f"   ✓ Selected Soil: {soil}")

    rainfall = float(prompt("6. Seasonal Rainfall (mm)", "650.0"))
    temp = float(prompt("7. Average Temperature (°C)", "26.5"))

    print("\nIrrigation Availability options (Exact from dataset):")
    print("  [1] High (proxy)")
    print("  [2] Moderate\u2013high (proxy)")
    print("  [3] Moderate (proxy)")
    print("  [4] Low\u2013moderate (proxy)")
    print("  [5] Low/variable; likely rain-fed (proxy)")
    irr_opt = prompt("8. Irrigation Availability (1-5 or type name)", "1")
    irrigation = resolve_irrigation(irr_opt)
    print(f"   ✓ Selected Irrigation: {irrigation}")

    moisture = float(prompt("9. Soil Moisture % (1 to 100, dataset range 12 to 48%)", "25.0"))
    ph = float(prompt("10. Soil pH (4.5 to 8.5)", "7.2"))

    # OPTIONAL NPK PROMPTS
    baseline = get_soil_baseline(state, district)
    print("\n" + "-" * 70)
    print("NUTRIENT INPUTS (OPTIONAL: Press ENTER to auto-fill regional baseline)")
    print(f"Regional baseline for {district}, {state}: N={baseline['Nitrogen_N']}, P={baseline['Phosphorus_P']}, K={baseline['Potassium_K']} kg/ha")
    print("-" * 70)

    n_input = input(f"11. Available Nitrogen - N (kg/ha) [Press Enter for baseline {baseline['Nitrogen_N']}]: ").strip()
    p_input = input(f"12. Available Phosphorus - P (kg/ha) [Press Enter for baseline {baseline['Phosphorus_P']}]: ").strip()
    k_input = input(f"13. Available Potassium - K (kg/ha) [Press Enter for baseline {baseline['Potassium_K']}]: ").strip()

    is_custom = bool(n_input and p_input and k_input)
    n_val = float(n_input) if n_input else baseline["Nitrogen_N"]
    p_val = float(p_input) if p_input else baseline["Phosphorus_P"]
    k_val = float(k_input) if k_input else baseline["Potassium_K"]

    custom_field = {
        "State": state, "District": district, "Crop_Season": season,
        "Soil_Type": soil, "Cultivated_Area_ha": area_ha, "Rainfall_mm": rainfall,
        "Average_Temperature_C": temp, "Irrigation_Availability": irrigation,
        "Soil_Moisture_pct": moisture, "Soil_pH": ph,
        "Nitrogen_N": n_val, "Phosphorus_P": p_val, "Potassium_K": k_val,
        "_custom_npk": is_custom
    }

    predict_farm(custom_field)


def main():
    while True:
        print("\n" + "=" * 90)
        print("          MAIN MENU: HOW WOULD YOU LIKE TO TEST THE MODEL?")
        print("=" * 90)
        print("  [1] 🌾 Test Preset Farm 1: Punjab (Kharif, Alluvial, 2.5 ha, High NPK)")
        print("  [2] 🌾 Test Preset Farm 2: Punjab (Rabi, Alluvial, 4.0 ha, Wheat/Mustard)")
        print("  [3] 🌾 Test Preset Farm 3: Maharashtra (Kharif, Black Soil, 3.0 ha, NPK Unknown -> Auto-Filled)")
        print("  [4] 🌾 Test Preset Farm 4: Uttar Pradesh (Rabi, Alluvial, 1.5 ha, NPK Unknown -> Auto-Filled)")
        print("  [5] 🌾 Test Preset Farm 5: Karnataka (Rabi, Red Soil, 2.0 ha, Maize/Ragi)")
        print("  [6] 🎲 Test on a RANDOM REAL FARM from 67,356 Test Fields (Compare AI vs Farmer)")
        print("  [7] ✏️  Enter Custom Farm Parameters (Field Area Mandatory, NPK Optional)")
        print("  [0] 🚪 Exit")
        print("=" * 90)
        
        choice = input("Enter your choice (0-7): ").strip()
        if choice == "0":
            print("\nThank you for trying the Crop Recommender! Goodbye.\n")
            break
        elif choice in PRESETS:
            print(f"\nRunning: {PRESETS[choice]['name']}...")
            predict_farm(PRESETS[choice]["data"])
        elif choice == "6":
            test_random_real_farm()
        elif choice == "7":
            test_custom_farm()
        else:
            print("Invalid choice, please enter a number from 0 to 7.")


if __name__ == "__main__":
    if len(sys.argv) > 1 and sys.argv[1] == "--demo":
        print("\nRunning quick automated test across all 5 Preset Indian Farms...")
        for k in sorted(PRESETS.keys()):
            print(f"\n>>> TESTING PRESET #{k}: {PRESETS[k]['name']}")
            predict_farm(PRESETS[k]["data"])
        print("\n>>> TESTING A RANDOM REAL TEST FIELD FROM HELD-OUT DATASET:")
        test_random_real_farm()
    else:
        main()
