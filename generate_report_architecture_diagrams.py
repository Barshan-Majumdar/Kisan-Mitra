import os
import matplotlib.pyplot as plt
import matplotlib.patches as patches

OUTPUT_DIR = r'd:\Kisan-Mitra\report_visuals'
os.makedirs(OUTPUT_DIR, exist_ok=True)

plt.rcParams['font.sans-serif'] = 'Segoe UI'
plt.rcParams['font.family'] = 'sans-serif'

def draw_box(ax, x, y, w, h, title, subtitle="", fc="#FFFFFF", ec="#0F172A", lw=1.2, radius=0.08, title_color="#0F172A", sub_color="#475569", title_size=9.0, sub_size=7.5, pad=0.02):
    box = patches.FancyBboxPatch(
        (x, y), w, h,
        boxstyle=f"round,pad={pad},rounding_size={radius}",
        facecolor=fc, edgecolor=ec, linewidth=lw, zorder=2
    )
    ax.add_patch(box)
    if subtitle:
        ax.text(x + w/2, y + h*0.62, title, ha='center', va='center', fontsize=title_size, fontweight='bold', color=title_color, zorder=3)
        ax.text(x + w/2, y + h*0.28, subtitle, ha='center', va='center', fontsize=sub_size, color=sub_color, zorder=3)
    else:
        ax.text(x + w/2, y + h/2, title, ha='center', va='center', fontsize=title_size, fontweight='bold', color=title_color, zorder=3)
    return box

def draw_arrow(ax, x1, y1, x2, y2, label="", color="#475569", lw=1.3, label_color="#1E293B", label_size=7.0, label_offset=(0, 0.12)):
    ax.annotate(
        "", xy=(x2, y2), xytext=(x1, y1),
        arrowprops=dict(arrowstyle="-|>", color=color, lw=lw, mutation_scale=11, shrinkA=2, shrinkB=2),
        zorder=4
    )
    if label:
        mx = (x1 + x2) / 2 + label_offset[0]
        my = (y1 + y2) / 2 + label_offset[1]
        ax.text(mx, my, label, ha='center', va='center', fontsize=label_size, color=label_color, fontweight='bold',
                bbox=dict(boxstyle="round,pad=0.18", fc="#FFFFFF", ec="#CBD5E1", lw=0.6, alpha=0.95), zorder=5)

# =========================================================================
# FIGURE 1: Proposed System Architecture Diagram (Clean 3-Column Layout)
# =========================================================================
print("[1/3] Generating System_Architecture_Diagram.png...")
fig, ax = plt.subplots(figsize=(15.5, 11.2), dpi=300)
ax.set_xlim(0, 15.5)
ax.set_ylim(0, 11.2)
ax.axis('off')

# Title
ax.text(7.75, 10.8, "Figure 1: Proposed System Architecture Diagram", ha='center', va='center', fontsize=14, fontweight='bold', color='#0F172A')
ax.text(7.75, 10.45, "Kisan-Mitra: Autonomous AI Agronomy, Multi-Stage Crop Recommender & Plant Pathology Platform", ha='center', va='center', fontsize=9.5, color='#475569')

# --- TIER 1: CLIENT LAYER (Top) ---
t1_box = patches.FancyBboxPatch((0.5, 8.5), 14.5, 1.6, boxstyle="round,pad=0.03,rounding_size=0.1", fc="#F8FAFC", ec="#94A3B8", lw=1.2, linestyle="--")
ax.add_patch(t1_box)
ax.text(0.8, 9.85, "TIER 1: PRESENTATION & CLIENT LAYER (React 18 + Vite SPA / PWA)", fontsize=9.5, fontweight='bold', color='#1E293B')

draw_box(ax, 0.8, 8.65, 4.2, 1.1, "13-Feature Field Input & Soil Wizard", "Climatic, Soil & Area Inputs | PWA Offline Support", fc="#EFF6FF", ec="#3B82F6")
draw_box(ax, 5.6, 8.65, 4.2, 1.1, "Foliar Pathology Vision Camera", "Leaf Image Capture | HTML5 Canvas Compression", fc="#EFF6FF", ec="#3B82F6")
draw_box(ax, 10.4, 8.65, 4.2, 1.1, "Dashboard, Mandi & Farm Copilot", "Live Weather, Agmarknet Trends & Gemini Chat", fc="#EFF6FF", ec="#3B82F6")

# --- TIER 2: API GATEWAY (Middle Top) ---
t2_box = patches.FancyBboxPatch((0.5, 6.0), 14.5, 1.7, boxstyle="round,pad=0.03,rounding_size=0.1", fc="#F8FAFC", ec="#94A3B8", lw=1.2, linestyle="--")
ax.add_patch(t2_box)
ax.text(0.8, 7.45, "TIER 2: API GATEWAY & APPLICATION SERVER (Node.js + Express 5, Port 3000)", fontsize=9.5, fontweight='bold', color='#1E293B')

draw_box(ax, 0.8, 6.15, 4.2, 1.1, "Crop Advisory Controller", "Validation, Categorical Encoding & AI Routing", fc="#F0FDF4", ec="#16A34A")
draw_box(ax, 5.6, 6.15, 4.2, 1.1, "Disease Diagnostic Controller", "Multipart Stream Parser, Timeout & Fallbacks", fc="#F0FDFA", ec="#0D9488")
draw_box(ax, 10.4, 6.15, 4.2, 1.1, "Market, Weather & Chat Controllers", "External API Caching, Telemetry Proxy & GenAI", fc="#FFFBEB", ec="#D97706")

# --- TIER 3: AI MICROSERVICE (Middle Bottom) ---
t3_box = patches.FancyBboxPatch((0.5, 2.7), 14.5, 2.5, boxstyle="round,pad=0.03,rounding_size=0.1", fc="#F8FAFC", ec="#94A3B8", lw=1.2, linestyle="--")
ax.add_patch(t3_box)
ax.text(0.8, 4.95, "TIER 3: AI & COMPUTER VISION MICROSERVICE (FastAPI + PyTorch + Scikit-Learn, Port 8000)", fontsize=9.5, fontweight='bold', color='#1E293B')

# Column 1 inside Tier 3: Crop Recommender Pipeline
draw_box(ax, 0.8, 3.8, 4.2, 0.95, "Two-Stage Random Forest Engine", "Stage 1: 10 Categories (89.5%) | Stage 2: 50 Crops (94.4% Top-3)", fc="#ECFDF5", ec="#059669")
draw_box(ax, 0.8, 2.85, 4.2, 0.8, "Soil Baselines & Yield Calculator", "regional_soil_baselines.json & crop_yield_reference.json", fc="#FFFFFF", ec="#A7F3D0", title_size=8.0, sub_size=6.8)

# Column 2 inside Tier 3: Disease Vision Pipeline
draw_box(ax, 5.6, 3.8, 4.2, 0.95, "EfficientNet-B0 Vision Engine (model_v1.pt)", "38 Pathological Classes | 98.21% Test Accuracy", fc="#F0FDFA", ec="#0D9488")
draw_box(ax, 5.6, 2.85, 4.2, 0.8, "38-Class Pathology Knowledgebase", "Pathogen Identification, Chemical & Organic Dosages", fc="#FFFFFF", ec="#99F6E4", title_size=8.0, sub_size=6.8)

# Column 3 inside Tier 3: GenAI Advisory & Synthesis Engine
draw_box(ax, 10.4, 3.8, 4.2, 0.95, "Gemini Precision Advisory Synthesizer", "6-Section Agronomic Plan & Conversational Copilot", fc="#F5F3FF", ec="#7C3AED")
draw_box(ax, 10.4, 2.85, 4.2, 0.8, "Cultural Terminology Localizer", "indian_popular_crop_names.json (e.g. Matki, Chana, Kapas)", fc="#FFFFFF", ec="#DDD6FE", title_size=8.0, sub_size=6.8)

# --- TIER 4: PERSISTENCE & EXTERNAL CLOUD SERVICES (Bottom) ---
t4_box = patches.FancyBboxPatch((0.5, 0.3), 14.5, 1.6, boxstyle="round,pad=0.03,rounding_size=0.1", fc="#F8FAFC", ec="#94A3B8", lw=1.2, linestyle="--")
ax.add_patch(t4_box)
ax.text(0.8, 1.65, "TIER 4: DATA PERSISTENCE & EXTERNAL TELEMETRY SERVICES", fontsize=9.5, fontweight='bold', color='#1E293B')

draw_box(ax, 0.8, 0.45, 4.2, 1.05, "PostgreSQL Relational DB (Prisma)", "12 Models: Users, Advisories, Diagnosis, Tasks", fc="#F8FAFC", ec="#64748B", title_size=8.5, sub_size=7.0)
draw_box(ax, 5.6, 0.45, 4.2, 1.05, "Open-Meteo & data.gov.in (Agmarknet)", "Hyperlocal Weather & Live APMC Mandi Feeds", fc="#F8FAFC", ec="#64748B", title_size=8.5, sub_size=7.0)
draw_box(ax, 10.4, 0.45, 4.2, 1.05, "Google Gemini Generative AI API", "Cloud Multi-Model Cascade & Vision Fallbacks", fc="#F8FAFC", ec="#64748B", title_size=8.5, sub_size=7.0)

# --- CLEAN DIRECT DOWNWARD ARROWS (NO OVERLAPS OR CUT-THROUGHS) ---
# Column 1
draw_arrow(ax, 2.9, 8.65, 2.9, 7.25, "POST /api/crops/recommend", color="#2563EB", label_size=7.2)
draw_arrow(ax, 2.9, 6.15, 2.9, 4.75, "POST /predict", color="#059669", label_size=7.2)
draw_arrow(ax, 2.9, 2.85, 2.9, 1.50, "Persist Recommendations", color="#475569", label_size=7.0)

# Column 2
draw_arrow(ax, 7.7, 8.65, 7.7, 7.25, "POST /api/disease/diagnose", color="#2563EB", label_size=7.2)
draw_arrow(ax, 7.7, 6.15, 7.7, 4.75, "POST /predict-disease", color="#0D9488", label_size=7.2)
draw_arrow(ax, 7.7, 2.85, 7.7, 1.50, "Fetch Mandi & Weather Telemetry", color="#D97706", label_size=7.0)

# Column 3
draw_arrow(ax, 12.5, 8.65, 12.5, 7.25, "GET /market & POST /chat", color="#2563EB", label_size=7.2)
draw_arrow(ax, 12.5, 6.15, 12.5, 4.75, "GenAI Context Pipeline", color="#7C3AED", label_size=7.2)
draw_arrow(ax, 12.5, 2.85, 12.5, 1.50, "Synthesize Farming Plans", color="#7C3AED", label_size=7.0)

plt.tight_layout()
fig1_path = os.path.join(OUTPUT_DIR, "System_Architecture_Diagram.png")
plt.savefig(fig1_path, dpi=300)
plt.close()
print("Saved:", fig1_path)

# =========================================================================
# FIGURE 2: Data Flow Diagram (DFD Level 0 & Level 1) (Clean Alignment)
# =========================================================================
print("[2/3] Generating Data_Flow_Diagram_Level_0_and_1.png...")
fig, (ax0, ax1) = plt.subplots(2, 1, figsize=(15.5, 12.5), dpi=300, gridspec_kw={'height_ratios': [1, 2.2]})

# --- DFD LEVEL 0 (Top Panel) ---
ax0.set_xlim(0, 15.5)
ax0.set_ylim(0, 4.5)
ax0.axis('off')
ax0.text(7.75, 4.2, "Figure 2A: Context-Level Data Flow Diagram (DFD Level 0)", ha='center', va='center', fontsize=12.5, fontweight='bold', color='#0F172A')

draw_box(ax0, 0.8, 1.2, 2.8, 2.2, "Farmer / User\n(Client Interface)", "Web Browser / Mobile PWA\n(Soil Card, Camera, Mandi Query)", fc="#FEF3C7", ec="#D97706", title_size=9.5, sub_size=7.5)
draw_box(ax0, 5.8, 1.1, 4.0, 2.4, "0.0\nKisan-Mitra Platform\n(Autonomous Agronomy Engine)", "Express API Gateway + FastAPI AI Service\n(Prisma ORM & Python Models)", fc="#ECFDF5", ec="#059669", title_size=10.0, sub_size=7.8, radius=0.35)
draw_box(ax0, 12.0, 2.5, 2.7, 1.5, "External APIs\n(data.gov.in & Weather)", "Live Mandi Rates & Forecasts", fc="#F1F5F9", ec="#64748B", title_size=8.5, sub_size=7.0)
draw_box(ax0, 12.0, 0.6, 2.7, 1.5, "Generative AI\n(Google Gemini API)", "Agronomic Plan Synthesis", fc="#F5F3FF", ec="#7C3AED", title_size=8.5, sub_size=7.0)

draw_arrow(ax0, 3.6, 2.6, 5.8, 2.6, "Farm Parameters / Leaf Images / Queries", color="#1E293B", label_size=7.2, label_offset=(0, 0.16))
draw_arrow(ax0, 5.8, 1.8, 3.6, 1.8, "Crop Recommendations / Yield / Prescriptions", color="#059669", label_size=7.2, label_offset=(0, -0.16))
draw_arrow(ax0, 12.0, 3.1, 9.8, 2.7, "Mandi Feeds & Weather Telemetry", color="#64748B", label_size=7.0, label_offset=(0, 0.14))
draw_arrow(ax0, 9.8, 1.8, 12.0, 1.3, "Context Prompt & Advisory Generation", color="#7C3AED", label_size=7.0, label_offset=(0, -0.14))

# --- DFD LEVEL 1 (Bottom Panel - Clean Parallel Flows) ---
ax1.set_xlim(0, 15.5)
ax1.set_ylim(0, 8.8)
ax1.axis('off')
ax1.text(7.75, 8.5, "Figure 2B: Functional Decomposition Data Flow Diagram (DFD Level 1)", ha='center', va='center', fontsize=12.5, fontweight='bold', color='#0F172A')

draw_box(ax1, 0.6, 2.8, 2.2, 3.0, "Farmer / User\n(Client)", "Mobile / Web Interface\nInput Parameters\nCamera Photos\nChatbot Prompts", fc="#FEF3C7", ec="#D97706", title_size=9.5, sub_size=7.5)

# 5 Level-1 Processes (Stacked evenly)
draw_box(ax1, 4.6, 7.1, 4.6, 1.2, "1.0 User Authentication & Field Profiling", "Clerk JWT Validation & Farm Location Management", fc="#EFF6FF", ec="#2563EB", title_size=8.5, sub_size=7.0, radius=0.2)
draw_box(ax1, 4.6, 5.4, 4.6, 1.3, "2.0 Crop Recommendation & Yield Engine", "Two-Stage RF (10 Categories -> 50 Crops) | Harvest Calculation", fc="#ECFDF5", ec="#059669", title_size=8.5, sub_size=7.0, radius=0.2)
draw_box(ax1, 4.6, 3.7, 4.6, 1.3, "3.0 Plant Pathology Vision Diagnostic", "EfficientNet-B0 (model_v1.pt) | 38 Disease Classes & Prescriptions", fc="#F0FDFA", ec="#0D9488", title_size=8.5, sub_size=7.0, radius=0.2)
draw_box(ax1, 4.6, 2.0, 4.6, 1.3, "4.0 APMC Mandi Intelligence & Weather", "data.gov.in Agmarknet Filtering & Open-Meteo Telemetry", fc="#FFFBEB", ec="#D97706", title_size=8.5, sub_size=7.0, radius=0.2)
draw_box(ax1, 4.6, 0.3, 4.6, 1.3, "5.0 Precision Advisory & Farm Copilot", "Gemini 6-Section Plan Synthesis & Agricultural Chat Assistant", fc="#F5F3FF", ec="#7C3AED", title_size=8.5, sub_size=7.0, radius=0.2)

# 5 Dedicated Data Stores (Parallel on the right)
def draw_datastore(ax, x, y, w, h, id_label, name):
    ds = patches.Rectangle((x, y), w, h, facecolor="#F8FAFC", edgecolor="#64748B", linewidth=1.1, zorder=2)
    ax.add_patch(ds)
    ax.plot([x, x+w], [y, y], color="#475569", lw=1.2, zorder=3)
    ax.plot([x, x+w], [y+h, y+h], color="#475569", lw=1.2, zorder=3)
    ax.plot([x+0.6, x+0.6], [y, y+h], color="#94A3B8", lw=0.8, linestyle=":", zorder=3)
    ax.text(x+0.3, y+h/2, id_label, ha='center', va='center', fontsize=7.5, fontweight='bold', color="#0F172A", zorder=4)
    ax.text(x+0.8+(w-0.8)/2, y+h/2, name, ha='center', va='center', fontsize=7.5, fontweight='semibold', color="#1E293B", zorder=4)

draw_datastore(ax1, 11.2, 7.3, 3.6, 0.8, "D1", "Users & Farm Profiles (DB)")
draw_datastore(ax1, 11.2, 5.65, 3.6, 0.8, "D2", "Recommendation History (DB)")
draw_datastore(ax1, 11.2, 3.95, 3.6, 0.8, "D3", "Disease Diagnosis History (DB)")
draw_datastore(ax1, 11.2, 2.25, 3.6, 0.8, "D4", "Mandi Prices & Yield Baselines")
draw_datastore(ax1, 11.2, 0.55, 3.6, 0.8, "D5", "Advisories, Plans & Farm Tasks")

# Straight parallel arrows (No crossings)
draw_arrow(ax1, 2.8, 5.5, 4.6, 7.7, "Auth Credentials", color="#2563EB", label_size=6.8)
draw_arrow(ax1, 2.8, 4.7, 4.6, 6.0, "13 Soil & Climate Params", color="#059669", label_size=6.8)
draw_arrow(ax1, 2.8, 4.1, 4.6, 4.3, "Leaf Pathology Photo", color="#0D9488", label_size=6.8)
draw_arrow(ax1, 2.8, 3.5, 4.6, 2.6, "Commodity / Mandi Query", color="#D97706", label_size=6.8)
draw_arrow(ax1, 2.8, 2.9, 4.6, 0.9, "Farmer Questions / Prompts", color="#7C3AED", label_size=6.8)

draw_arrow(ax1, 9.2, 7.7, 11.2, 7.7, "Store Profile State", color="#2563EB", label_size=6.8)
draw_arrow(ax1, 9.2, 6.05, 11.2, 6.05, "Log Ranked Crops & Yield", color="#059669", label_size=6.8)
draw_arrow(ax1, 9.2, 4.35, 11.2, 4.35, "Log Diagnosis & Remedy", color="#0D9488", label_size=6.8)
draw_arrow(ax1, 9.2, 2.65, 11.2, 2.65, "Cache Daily Mandi Benchmarks", color="#D97706", label_size=6.8)
draw_arrow(ax1, 9.2, 0.95, 11.2, 0.95, "Save 6-Section Advisory Plan", color="#7C3AED", label_size=6.8)

plt.tight_layout()
fig2_path = os.path.join(OUTPUT_DIR, "Data_Flow_Diagram_Level_0_and_1.png")
plt.savefig(fig2_path, dpi=300)
plt.close()
print("Saved:", fig2_path)

# =========================================================================
# FIGURE 3: Algorithm Execution Flowchart (Clean Converging Layout)
# =========================================================================
print("[3/3] Generating Algorithm_Execution_Flowchart.png...")
fig, ax = plt.subplots(figsize=(15.0, 13.0), dpi=300)
ax.set_xlim(0, 15.0)
ax.set_ylim(0, 13.0)
ax.axis('off')

ax.text(7.5, 12.65, "Figure 3: Algorithm Execution Flowchart (Section 3.2)", ha='center', va='center', fontsize=13.5, fontweight='bold', color='#0F172A')
ax.text(7.5, 12.35, "Algorithmic Control Flow for Crop Recommendation (Random Forest) & Foliar Pathology (EfficientNet-B0)", ha='center', va='center', fontsize=9.5, color='#475569')

# Start Node
draw_box(ax, 5.5, 11.5, 4.0, 0.65, "START: Farmer Input Received", "13 Environmental Parameters or Leaf Photo", fc="#F8FAFC", ec="#0F172A", radius=0.3, title_size=9.0, sub_size=7.5)

# Branch Decision Diamond
def draw_diamond(ax, cx, cy, w, h, text, sub=""):
    pts = [[cx, cy + h/2], [cx + w/2, cy], [cx, cy - h/2], [cx - w/2, cy]]
    poly = patches.Polygon(pts, closed=True, facecolor="#FEF3C7", edgecolor="#D97706", linewidth=1.2, zorder=2)
    ax.add_patch(poly)
    if sub:
        ax.text(cx, cy + 0.08, text, ha='center', va='center', fontsize=8.5, fontweight='bold', color="#92400E", zorder=3)
        ax.text(cx, cy - 0.16, sub, ha='center', va='center', fontsize=7.0, color="#78350F", zorder=3)
    else:
        ax.text(cx, cy, text, ha='center', va='center', fontsize=8.5, fontweight='bold', color="#92400E", zorder=3)

draw_diamond(ax, 7.5, 10.3, 3.8, 1.2, "Operation Type?", "Crop Advisory vs Disease Vision")
draw_arrow(ax, 7.5, 11.5, 7.5, 10.9, color="#0F172A")

# --- LEFT BRANCH: CROP RECOMMENDATION PIPELINE ---
draw_arrow(ax, 5.6, 10.3, 3.8, 10.3, "Crop Advisory", color="#059669", label_size=7.5, label_offset=(0, 0.14))
draw_arrow(ax, 3.8, 10.3, 3.8, 9.6, color="#059669")

draw_box(ax, 1.8, 8.9, 4.0, 0.7, "Validate 13 Input Features", "State, District, Season, Soil, Area, Rainfall, etc.", fc="#ECFDF5", ec="#059669")
draw_arrow(ax, 3.8, 8.9, 3.8, 8.3, color="#059669")

draw_diamond(ax, 3.8, 7.6, 3.2, 1.1, "NPK Provided?", "Are Soil Card Values Known?")

# No NPK path
draw_arrow(ax, 2.2, 7.6, 0.9, 7.6, "NO", color="#DC2626", label_size=7.0, label_offset=(0, 0.12))
draw_arrow(ax, 0.9, 7.6, 0.9, 6.7, color="#DC2626")
draw_box(ax, 0.1, 6.1, 2.5, 0.6, "Auto-Impute Baselines", "regional_soil_baselines.json", fc="#FEF2F2", ec="#EF4444", title_size=8.0, sub_size=6.8)
draw_arrow(ax, 0.9, 6.1, 0.9, 5.5, color="#EF4444")
draw_arrow(ax, 0.9, 5.5, 2.3, 5.5, color="#EF4444")

# Yes NPK path
draw_arrow(ax, 3.8, 7.05, 3.8, 5.9, "YES (Direct Readings)", color="#059669", label_size=6.8, label_offset=(0.55, 0))
draw_box(ax, 2.2, 5.15, 3.2, 0.7, "Categorical Integer Encoding", "rf_model_bundle_metadata.json", fc="#ECFDF5", ec="#059669")

draw_arrow(ax, 3.8, 5.15, 3.8, 4.5, color="#059669")
draw_box(ax, 1.6, 3.8, 4.4, 0.7, "Stage 1: Category Classifier (100 Trees)", "Predicts 10 Agricultural Families (89.51% Accuracy)", fc="#ECFDF5", ec="#059669")

draw_arrow(ax, 3.8, 3.8, 3.8, 3.2, color="#059669")
draw_box(ax, 1.6, 2.5, 4.4, 0.7, "Stage 2: 50-Crop Classifier (140 Trees)", "Sub-linear Weights (α=0.35) -> Top-5 Ranked Crops", fc="#ECFDF5", ec="#059669")

draw_arrow(ax, 3.8, 2.5, 3.8, 1.9, color="#059669")
draw_box(ax, 1.6, 1.2, 4.4, 0.7, "Harvest Yield Engine & Name Localization", "Yield (t/ha) × Area = Total Tonnes | Vernacular Names", fc="#ECFDF5", ec="#059669")

# --- RIGHT BRANCH: PLANT DISEASE VISION PIPELINE ---
draw_arrow(ax, 9.4, 10.3, 11.2, 10.3, "Disease Vision", color="#0D9488", label_size=7.5, label_offset=(0, 0.14))
draw_arrow(ax, 11.2, 10.3, 11.2, 9.6, color="#0D9488")

draw_box(ax, 9.0, 8.9, 4.4, 0.7, "Foliar Image Acquisition", "Decode Base64 / Camera Multi-Part Stream", fc="#F0FDFA", ec="#0D9488")
draw_arrow(ax, 11.2, 8.9, 11.2, 8.3, color="#0D9488")

draw_box(ax, 9.0, 7.6, 4.4, 0.7, "Image Preprocessing Pipeline", "Resize 224×224 RGB | Normalize with ImageNet μ, σ", fc="#F0FDFA", ec="#0D9488")
draw_arrow(ax, 11.2, 7.6, 11.2, 6.9, color="#0D9488")

draw_box(ax, 9.0, 6.2, 4.4, 0.7, "Forward Pass: EfficientNet-B0 (model_v1.pt)", "Extract Deep Foliar Feature Embeddings", fc="#F0FDFA", ec="#0D9488")
draw_arrow(ax, 11.2, 6.2, 11.2, 5.5, color="#0D9488")

draw_box(ax, 9.0, 4.8, 4.4, 0.7, "Softmax Multi-Class Classification (38 Classes)", "Top-1 Diagnosis + Top-3 Differential Diagnostic Classes", fc="#F0FDFA", ec="#0D9488")
draw_arrow(ax, 11.2, 4.8, 11.2, 4.1, color="#0D9488")

draw_box(ax, 9.0, 3.4, 4.4, 0.7, "Pathology Knowledgebase Association", "Query Pathogen, Severity, Chemical & Organic Dosages", fc="#F0FDFA", ec="#0D9488")
draw_arrow(ax, 11.2, 3.4, 11.2, 2.5, color="#0D9488")

draw_box(ax, 9.0, 1.8, 4.4, 0.7, "Diagnosis Result Structuring", "Confidence Score, Severity Level & Treatment Options", fc="#F0FDFA", ec="#0D9488")

# --- CONVERGENCE: CLEAN RIGHT-ANGLE PATHS INTO CENTER BOTTOM OUTPUT ---
draw_arrow(ax, 3.8, 1.2, 3.8, 0.75, color="#059669")
draw_arrow(ax, 3.8, 0.75, 5.2, 0.75, color="#059669")

draw_arrow(ax, 11.2, 1.8, 11.2, 0.75, color="#0D9488")
draw_arrow(ax, 11.2, 0.75, 9.8, 0.75, color="#0D9488")

draw_box(ax, 5.2, 0.35, 4.6, 0.8, "OUTPUT: Agricultural Action Report", "Persist to PostgreSQL (Prisma) -> Render on Frontend UI", fc="#F5F3FF", ec="#7C3AED", radius=0.3, title_size=9.5, sub_size=7.5)

plt.tight_layout()
fig3_path = os.path.join(OUTPUT_DIR, "Algorithm_Execution_Flowchart.png")
plt.savefig(fig3_path, dpi=300)
plt.close()
print("Saved:", fig3_path)

print("\nALL 3 ARCHITECTURE DIAGRAMS REGENERATED WITH CLEAN DIRECT PATHWAYS!")
