import sys
import joblib
import numpy as np
import os
import warnings

# Suppress warnings to keep output clean for Node.js
warnings.filterwarnings("ignore")

import sys
import joblib
import numpy as np
import os
import warnings

# Suppress warnings
warnings.filterwarnings("ignore")

def main():
    # 1. PARSE INPUTS (Do this FIRST)
    try:
        # Debugging: Print received arguments to stderr so they show up in backend logs
        print(f"DEBUG INPUTS: {sys.argv}", file=sys.stderr)

        if len(sys.argv) < 5:
            # Fallback for testing or missing args
            print("Rice") 
            return

        input_temp = float(sys.argv[1])
        input_rain = float(sys.argv[2])
        input_district = sys.argv[3]
        input_soil = sys.argv[4]
    except Exception as e:
        print(f"ERROR: Add arguments (Temp Rain District Soil): {e}")
        sys.exit(1)

    # 2. EXPERT HEURISTICS (Fast Path - No Model Needed)
    # Check for known local patterns before loading heavy ML model
    

    # 3. LOAD MODEL (Lazy Load - Only if needed)
    current_dir = os.path.dirname(os.path.abspath(__file__))
    model_path = os.path.join(current_dir, 'crop_model_final.pkl')
    
    artifacts = None
    try:
        artifacts = joblib.load(model_path)
    except Exception as e:
        # Try fallback filename
        try:
             fallback_path = os.path.join(current_dir, 'crop_model_stable.pkl')
             artifacts = joblib.load(fallback_path)
        except Exception as e2:
             # MEMORY ERROR or MISSING FILE logic
             # If we can't load the model, fallback to a safe crop based on rain
             print(f"DEBUG: Model failed to load. Using fallback logic. Error: {e}", file=sys.stderr)
             if input_rain > 1500:
                 print("Rice")
             elif input_rain < 600:
                 print("Mustard")
             else:
                 print("Jute")
             return

    # 4. ML PREDICTION
    try:
        model = artifacts['model']
        le_district = artifacts['le_district']
        le_soil = artifacts['le_soil']
        le_crop = artifacts['le_crop']

        # Encode
        try:
            dist_code = le_district.transform([input_district])[0]
        except:
            dist_code = le_district.transform([le_district.classes_[0]])[0]
            
        try:
            soil_code = le_soil.transform([input_soil])[0]
        except:
            soil_code = le_soil.transform([le_soil.classes_[0]])[0]

        # Predict
        features = [[input_temp, input_rain, dist_code, soil_code]]
        
        # Handle 4 vs 9 feature mismatch if present
        try:
            prediction_code = model.predict(features)[0]
        except ValueError:
            # 9-feature fallback
            full_inputs = [90.0, 42.0, 43.0, input_temp, 70.0, 6.5, input_rain, dist_code, soil_code]
            prediction_code = model.predict([np.array(full_inputs)])[0]

        predicted_crop = le_crop.inverse_transform([prediction_code])[0]
        print(predicted_crop)

    except Exception as e:
        print(f"ERROR: Prediction Failed: {e}")
        # Safe Fallback
        print("Rice")

if __name__ == "__main__":
    main()