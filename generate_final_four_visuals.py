import os
import glob
import json
import joblib
import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns
from PIL import Image, ImageDraw, ImageFont
from sklearn.metrics import confusion_matrix, accuracy_score, precision_score, recall_score, f1_score, classification_report

OUTPUT_DIR = r'd:\Kisan-Mitra\report_visuals'
os.makedirs(OUTPUT_DIR, exist_ok=True)

# Remove all existing PNGs so that ONLY the 4 official visuals will exist
for f in glob.glob(os.path.join(OUTPUT_DIR, "*.png")):
    try:
        os.remove(f)
    except:
        pass

plt.rcParams['font.sans-serif'] = 'DejaVu Sans'
plt.rcParams['axes.edgecolor'] = '#333333'
plt.rcParams['axes.linewidth'] = 0.9

# =========================================================================
# MODEL 1: CROP PREDICTION (Two-Stage Random Forest)
# =========================================================================

# -------------------------------------------------------------------------
# Visual 1: Crop_Prediction_Confusion_Matrix.png
# -------------------------------------------------------------------------
print("[1/4] Generating Crop_Prediction_Confusion_Matrix.png...")
META_PATH = r'd:\Kisan-Mitra\ai-service\rf_model_bundle_metadata.json'
TEST_PATH = r'd:\Kisan-Mitra\ai-service\crop_ml_test.csv'
CAT_MODEL_PATH = r'd:\Kisan-Mitra\ai-service\random_forest_category_model.joblib'

with open(META_PATH, 'r', encoding='utf-8') as f:
    meta = json.load(f)

feature_cols = meta['feature_columns']
cat_cols = meta['categorical_columns']
cat_mappings = meta['categorical_mappings']
cat_classes = meta['crop_categories']

test_df = pd.read_csv(TEST_PATH, low_memory=False)
X_test = test_df[feature_cols].copy()
for col in cat_cols:
    X_test[col] = X_test[col].astype(str).map(cat_mappings[col]).fillna(-1).astype(int)

y_true_cat_idx = np.array([cat_classes.index(c) for c in test_df['Crop_Category']])

cat_model = joblib.load(CAT_MODEL_PATH)
cat_probs = cat_model.predict_proba(X_test)
cat_preds = np.argmax(cat_probs, axis=1)
cat_acc = accuracy_score(y_true_cat_idx, cat_preds)

cm_cat = confusion_matrix(y_true_cat_idx, cat_preds, labels=np.arange(len(cat_classes)))
cm_cat_norm = cm_cat.astype('float') / cm_cat.sum(axis=1)[:, np.newaxis]
display_cat_labels = [c.replace('_', ' ') for c in cat_classes]

plt.figure(figsize=(10.5, 8.5), dpi=300)
annot_text = np.empty_like(cm_cat, dtype=object)
for i in range(cm_cat.shape[0]):
    for j in range(cm_cat.shape[1]):
        count = cm_cat[i, j]
        pct = cm_cat_norm[i, j] * 100
        annot_text[i, j] = f"{count:,}\n({pct:.1f}%)" if count > 0 else "0"

sns.heatmap(
    cm_cat_norm,
    annot=annot_text,
    fmt="",
    cmap="Blues",
    xticklabels=display_cat_labels,
    yticklabels=display_cat_labels,
    cbar_kws={'label': 'Normalized Prediction Fraction'},
    linewidths=0.6,
    linecolor='#E2E8F0',
    annot_kws={'size': 8.5, 'weight': 'semibold'}
)

plt.title(
    f"Crop Prediction Model — Confusion Matrix\n(Evaluated on 67,356 Unseen Fields | Accuracy: {cat_acc*100:.2f}%)",
    fontsize=12, pad=16, fontweight='bold', color='#0F172A'
)
plt.xlabel("Predicted Category", fontsize=11, fontweight='bold', labelpad=12, color='#1E293B')
plt.ylabel("Actual Category", fontsize=11, fontweight='bold', labelpad=12, color='#1E293B')
plt.xticks(rotation=35, ha='right', fontsize=9.5)
plt.yticks(rotation=0, fontsize=9.5)
plt.tight_layout()

fig1_path = os.path.join(OUTPUT_DIR, "Crop_Prediction_Confusion_Matrix.png")
plt.savefig(fig1_path, dpi=300)
plt.close()
print("Saved:", fig1_path)

# -------------------------------------------------------------------------
# Visual 2: Crop_Prediction_Performance_Metrics.png (Accuracy, Precision, Recall, F1)
# -------------------------------------------------------------------------
print("[2/4] Generating Crop_Prediction_Performance_Metrics.png (All 4 Factors)...")
rep_cat = classification_report(y_true_cat_idx, cat_preds, target_names=cat_classes, output_dict=True)

groups = [c.replace('_', ' ') for c in cat_classes] + ['OVERALL MODEL']
precisions = [rep_cat[c]['precision'] * 100 for c in cat_classes] + [precision_score(y_true_cat_idx, cat_preds, average='weighted') * 100]
recalls    = [rep_cat[c]['recall'] * 100 for c in cat_classes] + [recall_score(y_true_cat_idx, cat_preds, average='weighted') * 100]
f1_scores  = [rep_cat[c]['f1-score'] * 100 for c in cat_classes] + [f1_score(y_true_cat_idx, cat_preds, average='weighted') * 100]
accuracies = [cm_cat_norm[i, i] * 100 for i in range(len(cat_classes))] + [cat_acc * 100]

x = np.arange(len(groups))
width = 0.20

plt.figure(figsize=(15.0, 7.2), dpi=300)

# Coolors Palette: https://coolors.co/palette/dabfff-907ad6-4f518c-2c2a4a
c_acc,  e_acc  = '#DABFFF', '#7A5BB8' # Soft Lavender
c_prec, e_prec = '#907AD6', '#5E4AA8' # Iris Violet
c_rec,  e_rec  = '#4F518C', '#2C2A4A' # Slate Indigo
c_f1,   e_f1   = '#2C2A4A', '#131124' # Midnight Violet

plt.bar(x - 1.5*width, accuracies, width, label='Accuracy (%)', color=c_acc, edgecolor=e_acc, linewidth=0.8)
plt.bar(x - 0.5*width, precisions, width, label='Precision (%)', color=c_prec, edgecolor=e_prec, linewidth=0.8)
plt.bar(x + 0.5*width, recalls, width, label='Recall (%)', color=c_rec, edgecolor=e_rec, linewidth=0.8)
plt.bar(x + 1.5*width, f1_scores, width, label='F1-Score (%)', color=c_f1, edgecolor=e_f1, linewidth=0.8)

# Highlighting the Overall Model column
plt.axvline(x=len(groups) - 1.5, color='#94A3B8', linestyle='--', linewidth=1.5)

# Clean, elegant callout box for Overall Model metrics
summary_text = (
    f"OVERALL METRICS\n"
    f"• Accuracy : {accuracies[-1]:.2f}%\n"
    f"• Precision: {precisions[-1]:.2f}%\n"
    f"• Recall   : {recalls[-1]:.2f}%\n"
    f"• F1-Score : {f1_scores[-1]:.2f}%"
)
plt.annotate(
    summary_text,
    xy=(len(groups) - 1, max(accuracies[-1], precisions[-1])),
    xytext=(0, 20),
    textcoords="offset points",
    ha='center',
    fontsize=8.5,
    fontfamily='monospace',
    fontweight='bold',
    color='#0F172A',
    bbox=dict(boxstyle="round,pad=0.4", fc="#F8FAFC", ec="#64748B", lw=1.2)
)

plt.title("Crop Prediction Model — Performance Evaluation Across 4 Core Statistical Metrics\n(Accuracy, Precision, Recall, and F1-Score Evaluated on 67,356 Held-Out Farms)", 
          fontsize=12.5, pad=16, fontweight='bold', color='#0F172A')
plt.xlabel("Agricultural Domain Category & Benchmark Summary", fontsize=11, fontweight='bold', labelpad=10, color='#1E293B')
plt.ylabel("Score (%)", fontsize=11, fontweight='bold', labelpad=10, color='#1E293B')
plt.xticks(x, groups, rotation=25, ha='right', fontsize=9.5, fontweight='semibold')
plt.ylim(0, 118)
plt.grid(axis='y', linestyle=':', alpha=0.6, color='#CBD5E1')
plt.legend(loc='upper left', frameon=True, facecolor='white', edgecolor='#CBD5E1', fontsize=10, ncol=4)
plt.tight_layout()

fig2_path = os.path.join(OUTPUT_DIR, "Crop_Prediction_Performance_Metrics.png")
plt.savefig(fig2_path, dpi=300)
plt.close()
print("Saved:", fig2_path)

# =========================================================================
# MODEL 2: DISEASE PREDICTION (EfficientNet-B0)
# =========================================================================

# -------------------------------------------------------------------------
# Visual 3: Disease_Prediction_Confusion_Matrix.png
# -------------------------------------------------------------------------
print("[3/4] Generating Disease_Prediction_Confusion_Matrix.png...")
RAW_DISEASE_CM_PATH = r'E:\Downloads\Plant_Disease_Classifier\artifacts\reports\confusion_matrix.png'
img_disease = Image.open(RAW_DISEASE_CM_PATH).convert('RGB')
draw = ImageDraw.Draw(img_disease)

# Cleanly wipe out the old title text (x: 1000..2600, y: 280..480)
draw.rectangle([(1000, 280), (2600, 480)], fill=(255, 255, 255))

font_title = ImageFont.truetype('C:/Windows/Fonts/segoeuib.ttf', 52)
font_sub = ImageFont.truetype('C:/Windows/Fonts/segoeui.ttf', 38)

t1 = "Disease Prediction Model — Confusion Matrix"
t2 = "EfficientNet-B0 on 5,430 PlantVillage Test Images | Accuracy: 98.21% | Macro F1: 0.9765"

bbox1 = draw.textbbox((0, 0), t1, font=font_title)
w1 = bbox1[2] - bbox1[0]
bbox2 = draw.textbbox((0, 0), t2, font=font_sub)
w2 = bbox2[2] - bbox2[0]

draw.text((1785 - (w1 // 2), 330), t1, fill=(15, 23, 42), font=font_title)
draw.text((1785 - (w2 // 2), 405), t2, fill=(71, 85, 105), font=font_sub)

fig3_path = os.path.join(OUTPUT_DIR, "Disease_Prediction_Confusion_Matrix.png")
img_disease.save(fig3_path, dpi=(300, 300))
print("Saved:", fig3_path)

# -------------------------------------------------------------------------
# Visual 4: Disease_Prediction_Performance_Metrics.png (Accuracy, Precision, Recall, F1)
# -------------------------------------------------------------------------
print("[4/4] Generating Disease_Prediction_Performance_Metrics.png (All 4 Factors)...")
DISEASE_REPORT_PATH = r'E:\Downloads\Plant_Disease_Classifier\artifacts\reports\classification_report.txt'

with open(DISEASE_REPORT_PATH, 'r') as f:
    lines = f.readlines()

crop_stats = {}
for line in lines[2:]:
    parts = line.strip().split()
    if len(parts) == 5 and parts[0] not in ['accuracy', 'macro', 'weighted']:
        name, prec, rec, f1, supp = parts
        crop = name.split('___')[0].replace('_(including_sour)', '').replace(',_bell', '')
        if crop not in crop_stats:
            crop_stats[crop] = {'prec': [], 'rec': [], 'f1': [], 'supp': 0}
        s = int(supp)
        crop_stats[crop]['prec'].append(float(prec) * s)
        crop_stats[crop]['rec'].append(float(rec) * s)
        crop_stats[crop]['f1'].append(float(f1) * s)
        crop_stats[crop]['supp'] += s

disease_crops = sorted(crop_stats.keys())
d_prec = []
d_rec = []
d_f1 = []
d_acc = []

for c in disease_crops:
    s = crop_stats[c]['supp']
    p = (sum(crop_stats[c]['prec']) / s) * 100.0
    r = (sum(crop_stats[c]['rec']) / s) * 100.0
    f = (sum(crop_stats[c]['f1']) / s) * 100.0
    d_prec.append(p)
    d_rec.append(r)
    d_f1.append(f)
    d_acc.append(r)

disease_groups = disease_crops + ['OVERALL MODEL']
d_prec.append(98.26)
d_rec.append(98.21)
d_f1.append(98.22)
d_acc.append(98.21)

x_d = np.arange(len(disease_groups))
width_d = 0.20

plt.figure(figsize=(16.0, 7.2), dpi=300)

# Coolors Palette: https://coolors.co/palette/dabfff-907ad6-4f518c-2c2a4a
plt.bar(x_d - 1.5*width_d, d_acc, width_d, label='Accuracy (%)', color='#DABFFF', edgecolor='#7A5BB8', linewidth=0.7)
plt.bar(x_d - 0.5*width_d, d_prec, width_d, label='Precision (%)', color='#907AD6', edgecolor='#5E4AA8', linewidth=0.7)
plt.bar(x_d + 0.5*width_d, d_rec, width_d, label='Recall (%)', color='#4F518C', edgecolor='#2C2A4A', linewidth=0.7)
plt.bar(x_d + 1.5*width_d, d_f1, width_d, label='F1-Score (%)', color='#2C2A4A', edgecolor='#131124', linewidth=0.7)

plt.axvline(x=len(disease_groups) - 1.5, color='#94A3B8', linestyle='--', linewidth=1.5)

d_summary_text = (
    f"OVERALL METRICS\n"
    f"• Accuracy : {d_acc[-1]:.2f}%\n"
    f"• Precision: {d_prec[-1]:.2f}%\n"
    f"• Recall   : {d_rec[-1]:.2f}%\n"
    f"• F1-Score : {d_f1[-1]:.2f}%"
)
plt.annotate(
    d_summary_text,
    xy=(len(disease_groups) - 1, max(d_acc[-1], d_prec[-1])),
    xytext=(0, 20),
    textcoords="offset points",
    ha='center',
    fontsize=8.5,
    fontfamily='monospace',
    fontweight='bold',
    color='#0F172A',
    bbox=dict(boxstyle="round,pad=0.4", fc="#F8FAFC", ec="#64748B", lw=1.2)
)

plt.title("Disease Prediction Model — Performance Evaluation Across 4 Core Statistical Metrics\n(Accuracy, Precision, Recall, and F1-Score Evaluated on 5,430 Test Images Across 14 Crops & 38 Conditions)", 
          fontsize=12.5, pad=16, fontweight='bold', color='#0F172A')
plt.xlabel("Host Crop Species & Benchmark Summary", fontsize=11, fontweight='bold', labelpad=10, color='#1E293B')
plt.ylabel("Score (%)", fontsize=11, fontweight='bold', labelpad=10, color='#1E293B')
plt.xticks(x_d, disease_groups, rotation=25, ha='right', fontsize=9.5, fontweight='semibold')
plt.ylim(0, 118)
plt.grid(axis='y', linestyle=':', alpha=0.6, color='#CBD5E1')
plt.legend(loc='upper left', frameon=True, facecolor='white', edgecolor='#CBD5E1', fontsize=10, ncol=4)
plt.tight_layout()

fig4_path = os.path.join(OUTPUT_DIR, "Disease_Prediction_Performance_Metrics.png")
plt.savefig(fig4_path, dpi=300)
plt.close()
print("Saved:", fig4_path)

print("\nSUCCESS! EXACTLY 4 VISUAL FILES GENERATED IN:", OUTPUT_DIR)
