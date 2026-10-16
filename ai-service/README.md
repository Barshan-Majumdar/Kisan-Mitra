# 🌾 Kisan-Mitra AI Recommendation Microservice

This microservice provides high-precision, Two-Stage Agricultural Recommendations and Harvest Yield Estimates tailored for Indian farming conditions across **33 States and 652 Districts**.

---

## 🚀 Features

* **Stage 1 (Domain Certainty)**: Predicts broad agricultural family (`Cereal`, `Pulse`, `Oilseed`, `Fiber`, `Horticulture`, etc.) with **89.5% accuracy**.
* **Stage 2 (Specific Crops)**: Predicts ranked Top-5 suitable crops from a 50-crop basket with **94.4% Top-3 advisory accuracy**.
* **Harvest Production Engine**: Calculates Expected Yield (`Tonnes/ha`) and Total Expected Harvest (`Tonnes`) based on actual cultivated farm size.
* **Automatic Soil Baseline Imputation**: Automatically fills regional Nitrogen, Phosphorus, Potassium (NPK), and pH if soil test data is not provided.
* **Cultural Localization**: Translates technical botanical names into everyday Indian crop terminology (e.g. *Moth* ➔ *Moth Bean / Matki*, *Gram* ➔ *Chickpea / Chana*).

---

## 🏁 Quick Start

### 1. Install Dependencies
```bash
pip install -r requirements.txt
```

### 2. Start the Microservice
```bash
python main.py
```
Or simply double-click `start_ai_service.bat`.

The service runs on **http://127.0.0.1:8000**.

---

## 📡 Endpoints

### `GET /health`
Verifies server health and model memory residency.

### `GET /options`
Returns pre-compiled frontend dropdown options (33 States, 652 Districts, 7 Soil types, 6 Seasons, 5 Irrigation levels).

### `POST /predict` (or `/recommend`)
Generates two-stage recommendations and harvest predictions.

**Request:**
```json
{
  "State": "West Bengal",
  "District": "Nadia",
  "Crop_Season": "Kharif",
  "Soil_Type": "Alluvial plains (proxy)",
  "Cultivated_Area_ha": 2.5,
  "Rainfall_mm": 700.0,
  "Average_Temperature_C": 28.0,
  "Irrigation_Availability": "High (proxy)",
  "Soil_Moisture_pct": 25.0,
  "Soil_pH": 7.0,
  "Nitrogen_N": null,
  "Phosphorus_P": null,
  "Potassium_K": null,
  "top_k": 5
}
```

---

## 📦 Large File Notes for Git / GitHub
* `random_forest_crop_model.pkl` is **2.59 GB**.
* By default, `.gitignore` ignores `*.pkl` and `*.csv` so `git push` to GitHub will not be blocked by GitHub's 100 MB hard limit.
* For cloud deployment, host the model pickle file on Cloud Storage (AWS S3, Render Disks, or Hugging Face Hub) or track using `git lfs`.
