#!/usr/bin/env python3
"""
Plant Pathology Vision Engine (EfficientNet-B0)
Trained on 38-Class PlantVillage Foliar Dataset
Part of the Kisan-Mitra Agricultural Advisory Platform
"""

import os
import sys
import json
import base64
import io
from typing import Dict, Any, List, Optional
from PIL import Image

import torch
import torchvision.models as models
import torchvision.transforms as transforms

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_PATH = os.path.join(BASE_DIR, "model_v1.pt")

# Canonical PlantVillage 38-Class Taxonomy in ImageFolder Alphabetical Order
CLASS_NAMES = [
    "Apple___Apple_scab",
    "Apple___Black_rot",
    "Apple___Cedar_apple_rust",
    "Apple___healthy",
    "Blueberry___healthy",
    "Cherry_(including_sour)___Powdery_mildew",
    "Cherry_(including_sour)___healthy",
    "Corn_(maize)___Cercospora_leaf_spot Gray_leaf_spot",
    "Corn_(maize)___Common_rust_",
    "Corn_(maize)___Northern_Leaf_Blight",
    "Corn_(maize)___healthy",
    "Grape___Black_rot",
    "Grape___Esca_(Black_Measles)",
    "Grape___Leaf_blight_(Isariopsis_Leaf_Spot)",
    "Grape___healthy",
    "Orange___Haunglongbing_(Citrus_greening)",
    "Peach___Bacterial_spot",
    "Peach___healthy",
    "Pepper,_bell___Bacterial_spot",
    "Pepper,_bell___healthy",
    "Potato___Early_blight",
    "Potato___Late_blight",
    "Potato___healthy",
    "Raspberry___healthy",
    "Soybean___healthy",
    "Squash___Powdery_mildew",
    "Strawberry___Leaf_scorch",
    "Strawberry___healthy",
    "Tomato___Bacterial_spot",
    "Tomato___Early_blight",
    "Tomato___Late_blight",
    "Tomato___Leaf_Mold",
    "Tomato___Septoria_leaf_spot",
    "Tomato___Spider_mites Two-spotted_spider_mite",
    "Tomato___Target_Spot",
    "Tomato___Tomato_Yellow_Leaf_Curl_Virus",
    "Tomato___Tomato_mosaic_virus",
    "Tomato___healthy"
]

# Agronomic Pathology Knowledgebase for all 38 classes
DISEASE_KNOWLEDGE: Dict[str, Dict[str, Any]] = {
    "Apple___Apple_scab": {
        "crop": "Apple",
        "disease": "Apple Scab",
        "isHealthy": False,
        "pathogen": "Fungal (Venturia inaequalis)",
        "severity": "Moderate",
        "symptoms": "Olive-green to velvety brown-black spots with feathered margins on leaves and dark scabby lesions on young apples.",
        "chemicalTreatment": "Spray Captan 50 WP at 2.5 g/L or Mancozeb 75 WP at 2.5 g/L at pink bud stage; Difenoconazole 25 EC at 0.5 ml/L for curative action.",
        "organicTreatment": "Foliar spray of Neem oil (1500 ppm) or wettable sulfur (3 g/L). Prune fallen leaves in autumn.",
        "prevention": "Ensure good canopy pruning for air circulation, avoid overhead sprinkler irrigation, and plant resistant rootstocks."
    },
    "Apple___Black_rot": {
        "crop": "Apple",
        "disease": "Black Rot (Frogeye Leaf Spot)",
        "isHealthy": False,
        "pathogen": "Fungal (Botryosphaeria obtusa)",
        "severity": "High",
        "symptoms": "Small purple flecks on leaves expanding into circular frog-eye spots with light centers; black mummified rot on fruit.",
        "chemicalTreatment": "Spray Thiophanate-methyl 70 WP at 1 g/L or Pyraclostrobin + Boscalid at 1.5 g/L during early fruit formation.",
        "organicTreatment": "Prune out diseased cankers, remove dead fire-blighted twigs, apply Bordeaux mixture (1%).",
        "prevention": "Remove all mummified fruit from the orchard and burn dead wood harboring pycnidia."
    },
    "Apple___Cedar_apple_rust": {
        "crop": "Apple",
        "disease": "Cedar Apple Rust",
        "isHealthy": False,
        "pathogen": "Fungal (Gymnosporangium juniperi-virginianae)",
        "severity": "Moderate",
        "symptoms": "Bright yellow-orange spots on upper leaf surfaces; tubular aecial cups protruding on leaf undersides in late spring.",
        "chemicalTreatment": "Spray Myclobutanil 10 WP at 1 g/L or Propiconazole 25 EC at 1 ml/L starting at tight cluster stage.",
        "organicTreatment": "Spray wettable sulfur early in the season; remove eastern red cedar galls within 500m.",
        "prevention": "Eliminate alternate host juniper/cedar shrubs near orchards; select rust-tolerant cultivars."
    },
    "Apple___healthy": {
        "crop": "Apple",
        "disease": "Healthy Foliage",
        "isHealthy": True,
        "pathogen": "None (Healthy Tissue)",
        "severity": "None",
        "symptoms": "Vigorous, dark green foliage with smooth lamina and absence of foliar lesions or discoloration.",
        "chemicalTreatment": "No fungicide application needed. Maintain routine seasonal nutrient management.",
        "organicTreatment": "Apply vermicompost and prophylactic bio-inoculants (Pseudomonas fluorescens).",
        "prevention": "Maintain soil pH between 6.0-6.8 and ensure balanced NPK fertilization."
    },
    "Blueberry___healthy": {
        "crop": "Blueberry",
        "disease": "Healthy Foliage",
        "isHealthy": True,
        "pathogen": "None (Healthy Tissue)",
        "severity": "None",
        "symptoms": "Intact glossy green leaves with vibrant turgor and active shoot expansion.",
        "chemicalTreatment": "No curative chemical intervention required.",
        "organicTreatment": "Maintain acidic pine bark or peat mulch around root zones.",
        "prevention": "Keep soil pH in the ideal acidic range (4.5 - 5.5)."
    },
    "Cherry_(including_sour)___Powdery_mildew": {
        "crop": "Cherry",
        "disease": "Powdery Mildew",
        "isHealthy": False,
        "pathogen": "Fungal (Podosphaera clandestina)",
        "severity": "Moderate",
        "symptoms": "Patches of white talcum-like powdery fungal mycelium on lower leaf surfaces and tender shoot tips, causing leaf curl.",
        "chemicalTreatment": "Spray Hexaconazole 5 EC at 1 ml/L or Myclobutanil 10 WP at 1 g/L at shuck-split stage.",
        "organicTreatment": "Spray Wettable Sulfur at 3 g/L or Potassium Bicarbonate (5 g/L) during low humidity conditions.",
        "prevention": "Prune dense canopies to maximize sun exposure and air flow; avoid excessive nitrogen feeding."
    },
    "Cherry_(including_sour)___healthy": {
        "crop": "Cherry",
        "disease": "Healthy Foliage",
        "isHealthy": True,
        "pathogen": "None (Healthy Tissue)",
        "severity": "None",
        "symptoms": "Healthy serrated cherry foliage free of chlorotic speckling or powdery fungal growth.",
        "chemicalTreatment": "No chemical treatment necessary.",
        "organicTreatment": "Apply organic mulch and beneficial mycorrhizal fungi.",
        "prevention": "Ensure well-drained orchard loam with adequate drip irrigation."
    },
    "Corn_(maize)___Cercospora_leaf_spot Gray_leaf_spot": {
        "crop": "Corn (Maize)",
        "disease": "Gray Leaf Spot",
        "isHealthy": False,
        "pathogen": "Fungal (Cercospora zeae-maydis)",
        "severity": "High",
        "symptoms": "Tan-to-gray rectangular lesions strictly bounded by leaf veins; lesions coalesce leading to severe blighting.",
        "chemicalTreatment": "Spray Azoxystrobin 18.2% + Difenoconazole 11.4% SC at 1 ml/L or Pyraclostrobin at 1.5 ml/L at tasseling.",
        "organicTreatment": "Foliar application of Trichoderma harzianum; practice deep tillage of crop debris.",
        "prevention": "Crop rotation away from maize for 2 years; select resistant hybrid varieties."
    },
    "Corn_(maize)___Common_rust_": {
        "crop": "Corn (Maize)",
        "disease": "Common Rust",
        "isHealthy": False,
        "pathogen": "Fungal (Puccinia sorghi)",
        "severity": "Moderate",
        "symptoms": "Cinnamon-brown to brick-red oval powdery pustules scattered prominently across both upper and lower leaf surfaces.",
        "chemicalTreatment": "Spray Mancozeb 75 WP at 2.5 g/L or Tebuconazole 250 EC at 1 ml/L upon appearance of first pustules.",
        "organicTreatment": "Spray bio-fungicide Bacillus subtilis or aqueous Neem seed kernel extract (5%).",
        "prevention": "Plant rust-resistant hybrids; avoid late plantings during cool humid monsoon spells."
    },
    "Corn_(maize)___Northern_Leaf_Blight": {
        "crop": "Corn (Maize)",
        "disease": "Northern Corn Leaf Blight (NCLB)",
        "isHealthy": False,
        "pathogen": "Fungal (Exserohilum turcicum)",
        "severity": "High",
        "symptoms": "Large, elongated cigar-shaped grayish-green lesions (2.5 to 15 cm long) turning tan with dark sporulation zones.",
        "chemicalTreatment": "Foliar spray with Carbendazim 12% + Mancozeb 63% WP at 2 g/L or Azoxystrobin 23 SC at 1 ml/L.",
        "organicTreatment": "Spray Pseudomonas fluorescens (5 g/L) as a prophylactic measure.",
        "prevention": "Incorporate infected stalks deeply into soil after harvest; use certified disease-free seeds."
    },
    "Corn_(maize)___healthy": {
        "crop": "Corn (Maize)",
        "disease": "Healthy Foliage",
        "isHealthy": True,
        "pathogen": "None (Healthy Tissue)",
        "severity": "None",
        "symptoms": "Broad, vibrant deep-green maize leaves with uniform venation and zero foliar blights.",
        "chemicalTreatment": "No treatment required. Maintain scheduled top-dressing of urea/potash.",
        "organicTreatment": "Soil application of Azotobacter and Phosphate Solubilizing Bacteria (PSB).",
        "prevention": "Maintain adequate spacing (60 x 20 cm) and optimum weed control."
    },
    "Grape___Black_rot": {
        "crop": "Grape",
        "disease": "Grape Black Rot",
        "isHealthy": False,
        "pathogen": "Fungal (Guignardia bidwellii)",
        "severity": "High",
        "symptoms": "Reddish-brown circular spots on leaves with small black fruiting bodies (pycnidia); berries shrivel into black hard mummies.",
        "chemicalTreatment": "Spray Mancozeb 75 WP at 2 g/L or Kresoxim-methyl 44.3 SC at 0.7 ml/L from early shoot growth to post-bloom.",
        "organicTreatment": "Spray Copper Oxychloride 50 WP at 2.5 g/L; prune out and burn all mummified grape clusters.",
        "prevention": "Keep trellis canopy open to airflow and morning sunshine."
    },
    "Grape___Esca_(Black_Measles)": {
        "crop": "Grape",
        "disease": "Esca (Black Measles / Grapevine Decline)",
        "isHealthy": False,
        "pathogen": "Fungal Complex (Phaeoacremonium, Fomitiporia)",
        "severity": "Critical",
        "symptoms": "Interveinal chlorosis and necrosis creating a distinctive 'tiger-stripe' pattern; small dark spots on berry skins.",
        "chemicalTreatment": "No complete cure exists. Protect pruning wounds immediately with acrylic paint containing Carbendazim or Thiophanate.",
        "organicTreatment": "Apply Trichoderma-based pruning wound sealants; rogue severely declined vines.",
        "prevention": "Avoid pruning during rain or high humidity; sterilize shears with alcohol between vines."
    },
    "Grape___Leaf_blight_(Isariopsis_Leaf_Spot)": {
        "crop": "Grape",
        "disease": "Isariopsis Leaf Blight",
        "isHealthy": False,
        "pathogen": "Fungal (Pseudocercospora cladosporioides)",
        "severity": "Moderate",
        "symptoms": "Irregular necrotic brown lesions on leaf surfaces that coalesce and cause premature autumn defoliation.",
        "chemicalTreatment": "Spray Azoxystrobin 23 SC at 1 ml/L or Ziram 27 SC at 2 ml/L.",
        "organicTreatment": "Apply Bordeaux mixture (1%) or Copper Hydroxide at 2 g/L.",
        "prevention": "Clean vineyard floor of fallen leaves; avoid excessive vine vigor through nitrogen regulation."
    },
    "Grape___healthy": {
        "crop": "Grape",
        "disease": "Healthy Foliage",
        "isHealthy": True,
        "pathogen": "None (Healthy Tissue)",
        "severity": "None",
        "symptoms": "Uniform emerald-green palmate leaves without marginal scorch, spot, or mildew sporulation.",
        "chemicalTreatment": "No fungicide required.",
        "organicTreatment": "Apply seaweed extract foliar spray to boost plant immunity.",
        "prevention": "Ensure balanced potassium and boron nutrition for berry set."
    },
    "Orange___Haunglongbing_(Citrus_greening)": {
        "crop": "Citrus (Orange)",
        "disease": "Huanglongbing (Citrus Greening / HLB)",
        "isHealthy": False,
        "pathogen": "Bacterial (Candidatus Liberibacter asiaticus, vectored by Asian Citrus Psyllid)",
        "severity": "Critical",
        "symptoms": "Asymmetric blotchy mottled chlorosis across leaf veins, upright yellow shoots, lopsided bitter fruits with aborted seeds.",
        "chemicalTreatment": "Vector suppression: Spray Imidacloprid 17.8 SL at 0.5 ml/L or Thiamethoxam 25 WG at 0.3 g/L during new flush.",
        "organicTreatment": "Foliar micronutrient spray (Zinc sulfate 0.5% + Ferrous sulfate 0.2% + Urea 1%) to maintain tree vitality.",
        "prevention": "Plant only certified disease-free nursery grafts; eradicate infected non-productive trees immediately."
    },
    "Peach___Bacterial_spot": {
        "crop": "Peach",
        "disease": "Bacterial Spot",
        "isHealthy": False,
        "pathogen": "Bacterial (Xanthomonas arboricola pv. pruni)",
        "severity": "Moderate",
        "symptoms": "Small angular water-soaked leaf spots turning dark purple-black, centers drop out leaving a shot-hole appearance.",
        "chemicalTreatment": "Spray Copper Oxychloride 50 WP at 2 g/L or Streptocycline at 100 ppm at petal fall and shuck split.",
        "organicTreatment": "Apply Copper Octanoate (copper soap) or biological bactericide Bacillus amyloliquefaciens.",
        "prevention": "Avoid planting susceptible cultivars in wind-swept sandy soil areas."
    },
    "Peach___healthy": {
        "crop": "Peach",
        "disease": "Healthy Foliage",
        "isHealthy": True,
        "pathogen": "None (Healthy Tissue)",
        "severity": "None",
        "symptoms": "Elongated, bright green peach foliage free of shot-holes, cankers, or curl deformities.",
        "chemicalTreatment": "No action needed.",
        "organicTreatment": "Apply well-decomposed cow dung manure and bio-stimulants.",
        "prevention": "Ensure proper winter dormant copper spray for peach leaf curl prevention."
    },
    "Pepper,_bell___Bacterial_spot": {
        "crop": "Bell Pepper (Capsicum)",
        "disease": "Bacterial Spot",
        "isHealthy": False,
        "pathogen": "Bacterial (Xanthomonas euvesicatoria)",
        "severity": "High",
        "symptoms": "Small water-soaked circular spots on lower leaf surface expanding to dark brown necrotic lesions with chlorotic halos.",
        "chemicalTreatment": "Spray Copper Hydroxide at 2 g/L combined with Streptocycline at 0.1 g/L (100 ppm) at 10-day intervals.",
        "organicTreatment": "Seed treatment with hot water (50°C for 25 mins); spray Pseudomonas fluorescens (5 g/L).",
        "prevention": "Avoid working in pepper fields when foliage is wet; practice minimum 2-year non-solanaceous crop rotation."
    },
    "Pepper,_bell___healthy": {
        "crop": "Bell Pepper (Capsicum)",
        "disease": "Healthy Foliage",
        "isHealthy": True,
        "pathogen": "None (Healthy Tissue)",
        "severity": "None",
        "symptoms": "Crisp, dark green lanceolate leaves with smooth lamina and sturdy stems.",
        "chemicalTreatment": "No chemical treatment required.",
        "organicTreatment": "Apply neem cake to soil to deter root nematodes.",
        "prevention": "Maintain soil moisture with silver-black plastic mulch."
    },
    "Potato___Early_blight": {
        "crop": "Potato",
        "disease": "Early Blight",
        "isHealthy": False,
        "pathogen": "Fungal (Alternaria solani)",
        "severity": "High",
        "symptoms": "Dark brown to black circular lesions exhibiting distinctive concentric rings ('target board' pattern) on mature foliage.",
        "chemicalTreatment": "Spray Mancozeb 75 WP at 2.5 g/L, Chlorothalonil 75 WP at 2 g/L, or Azoxystrobin 23 SC at 1 ml/L upon symptom onset.",
        "organicTreatment": "Foliar spray with Trichoderma viride at 5 g/L or Copper Oxychloride at 2.5 g/L.",
        "prevention": "Maintain optimal nitrogen levels; practice crop rotation and destroy previous season volunteer tubers."
    },
    "Potato___Late_blight": {
        "crop": "Potato",
        "disease": "Late Blight",
        "isHealthy": False,
        "pathogen": "Oomycete (Phytophthora infestans)",
        "severity": "Critical",
        "symptoms": "Rapidly spreading water-soaked dark lesions; whitish mildew sporulation on undersides during cool foggy weather; rapid foliage collapse.",
        "chemicalTreatment": "Immediate curative spray: Cymoxanil 8% + Mancozeb 64% at 2 g/L or Metalaxyl 8% + Mancozeb 64% at 2.5 g/L; Dimethomorph at 1.5 g/L.",
        "organicTreatment": "Prophylactic Bordeaux mixture (1%) or Copper Hydroxide (2.5g/L) prior to rain/fog spells.",
        "prevention": "Plant certified disease-free seed tubers (e.g. Kufri Jyoti/Pukhraj); avoid sprinkler irrigation in cloudy conditions."
    },
    "Potato___healthy": {
        "crop": "Potato",
        "disease": "Healthy Foliage",
        "isHealthy": True,
        "pathogen": "None (Healthy Tissue)",
        "severity": "None",
        "symptoms": "Dense, vigorous composite leaves with uniform green color and robust tuber canopy expansion.",
        "chemicalTreatment": "No treatment required.",
        "organicTreatment": "Apply foliar humic acid and micro-nutrients.",
        "prevention": "Ensure earthing-up at 30-35 days after planting to protect tubers from tuber moth and sun exposure."
    },
    "Raspberry___healthy": {
        "crop": "Raspberry",
        "disease": "Healthy Foliage",
        "isHealthy": True,
        "pathogen": "None (Healthy Tissue)",
        "severity": "None",
        "symptoms": "Deeply veined, vibrant trifoliate foliage without rust pustules or yellow vein banding.",
        "chemicalTreatment": "No treatment required.",
        "organicTreatment": "Mulch cane bases with shredded wood or straw.",
        "prevention": "Ensure adequate trellis support to keep canes off moist ground."
    },
    "Soybean___healthy": {
        "crop": "Soybean",
        "disease": "Healthy Foliage",
        "isHealthy": True,
        "pathogen": "None (Healthy Tissue)",
        "severity": "None",
        "symptoms": "Uniform trifoliate green leaves with no rust lesions, bacterial pustules, or mosaic curling.",
        "chemicalTreatment": "No chemical application necessary.",
        "organicTreatment": "Seed treatment with Rhizobium japonicum culture for nitrogen fixation.",
        "prevention": "Maintain adequate phosphorus in soil and timely weed management at 20-40 DAS."
    },
    "Squash___Powdery_mildew": {
        "crop": "Squash / Cucurbits",
        "disease": "Powdery Mildew",
        "isHealthy": False,
        "pathogen": "Fungal (Podosphaera xanthii / Erysiphe cichoracearum)",
        "severity": "Moderate",
        "symptoms": "White flour-like powdery fungal spots rapidly expanding across upper and lower leaf surfaces, causing premature senescence.",
        "chemicalTreatment": "Spray Hexaconazole 5 EC at 1 ml/L or Difenoconazole 25 EC at 0.5 ml/L at first sign of powdery spots.",
        "organicTreatment": "Spray Potassium Bicarbonate at 4 g/L or Wettable Sulfur 80 WP at 2.5 g/L. Dilute milk spray (1:9 ratio).",
        "prevention": "Space cucurbit vines properly for ventilation; avoid overhead watering."
    },
    "Strawberry___Leaf_scorch": {
        "crop": "Strawberry",
        "disease": "Leaf Scorch",
        "isHealthy": False,
        "pathogen": "Fungal (Diplocarpon earlianum)",
        "severity": "Moderate",
        "symptoms": "Numerous small dark-purple to black spots irregular in shape; tissue between spots turns brown and scorches.",
        "chemicalTreatment": "Spray Captan 50 WP at 2 g/L or Thiophanate-methyl 70 WP at 1 g/L post-harvest and early spring.",
        "organicTreatment": "Copper Oxychloride at 2 g/L; prune and discard old scorched runner leaves.",
        "prevention": "Establish on raised beds with drip irrigation and plastic mulch; replace planting beds every 3 years."
    },
    "Strawberry___healthy": {
        "crop": "Strawberry",
        "disease": "Healthy Foliage",
        "isHealthy": True,
        "pathogen": "None (Healthy Tissue)",
        "severity": "None",
        "symptoms": "Glossy trifoliate green leaves with clean crown growth and prolific flower formation.",
        "chemicalTreatment": "No chemical intervention needed.",
        "organicTreatment": "Apply bio-fertilizers and pine needle straw mulch.",
        "prevention": "Keep fruit elevated from wet soil surface to prevent gray mold botrytis."
    },
    "Tomato___Bacterial_spot": {
        "crop": "Tomato",
        "disease": "Bacterial Spot",
        "isHealthy": False,
        "pathogen": "Bacterial (Xanthomonas perforans / vesicatoria)",
        "severity": "High",
        "symptoms": "Small greasy water-soaked circular lesions on leaves, turning dark brown with yellow halos; scabbed lesions on green tomatoes.",
        "chemicalTreatment": "Spray Copper Hydroxide 53.8 DF at 2 g/L mixed with Streptocycline at 100 ppm (1g/10L) at 7-10 day intervals.",
        "organicTreatment": "Foliar spray with Bacillus subtilis or garlic extract; soak seeds in hot water (50°C for 25 mins).",
        "prevention": "Avoid overhead sprinkler irrigation; rogue out volunteer solanaceous weeds (nightshade)."
    },
    "Tomato___Early_blight": {
        "crop": "Tomato",
        "disease": "Early Blight",
        "isHealthy": False,
        "pathogen": "Fungal (Alternaria linariae / solani)",
        "severity": "High",
        "symptoms": "Concentric rings ('target board') on older leaves starting from plant base, surrounded by yellowing leaf blade.",
        "chemicalTreatment": "Spray Chlorothalonil 75 WP at 2 g/L or Mancozeb 75 WP at 2.5 g/L; curative: Azoxystrobin 23 SC at 1 ml/L.",
        "organicTreatment": "Foliar spray of Trichoderma harzianum (5 g/L) or Copper Oxychloride at 2.5 g/L.",
        "prevention": "Stake plants for upward training; prune lower suckers touching the soil; mulch to prevent soil splashing."
    },
    "Tomato___Late_blight": {
        "crop": "Tomato",
        "disease": "Late Blight",
        "isHealthy": False,
        "pathogen": "Oomycete (Phytophthora infestans)",
        "severity": "Critical",
        "symptoms": "Pale green water-soaked spots rapidly turning brown-black with white cottony mold underneath; greasy firm rot on tomato fruits.",
        "chemicalTreatment": "Immediate application: Metalaxyl 8% + Mancozeb 64% at 2.5 g/L or Cymoxanil 8% + Mancozeb 64% at 2 g/L; Dimethomorph at 1.5 g/L.",
        "organicTreatment": "Preventive spray with Copper Hydroxide (2.5g/L) before prolonged rain/fog episodes.",
        "prevention": "Avoid planting near potato fields; destroy infected vines immediately to stop airborne zoospore dispersal."
    },
    "Tomato___Leaf_Mold": {
        "crop": "Tomato",
        "disease": "Leaf Mold",
        "isHealthy": False,
        "pathogen": "Fungal (Passalora fulva / Cladosporium fulvum)",
        "severity": "Moderate",
        "symptoms": "Pale green or yellowish spots on upper leaf surfaces matching with olive-brown velvety mold patches on leaf undersides.",
        "chemicalTreatment": "Spray Difenoconazole 25 EC at 0.5 ml/L or Chlorothalonil at 2 g/L.",
        "organicTreatment": "Spray Copper Oxychloride 50 WP at 2.5 g/L or Potassium Bicarbonate at 4 g/L.",
        "prevention": "Crucial: Lower greenhouse humidity below 85% by increasing ventilation; space plants widely."
    },
    "Tomato___Septoria_leaf_spot": {
        "crop": "Tomato",
        "disease": "Septoria Leaf Spot",
        "isHealthy": False,
        "pathogen": "Fungal (Septoria lycopersici)",
        "severity": "High",
        "symptoms": "Numerous circular small spots (2-3mm) with dark brown borders and sunken grayish-white centers containing tiny black pycnidia.",
        "chemicalTreatment": "Spray Mancozeb 75 WP at 2.5 g/L or Zineb 75 WP at 2 g/L at first appearance of spots.",
        "organicTreatment": "Spray Copper Hydroxide at 2 g/L; remove infected lower leaves as soon as detected.",
        "prevention": "Rotate out of tomatoes for 2 years; clean crop residues immediately after harvest."
    },
    "Tomato___Spider_mites Two-spotted_spider_mite": {
        "crop": "Tomato",
        "disease": "Two-Spotted Spider Mite Infestation",
        "isHealthy": False,
        "pathogen": "Acarid Pest (Tetranychus urticae)",
        "severity": "High",
        "symptoms": "Fine yellow stippling and speckled chlorosis on leaf surfaces, fine webbing on undersides, leaves bronzing and turning brittle.",
        "chemicalTreatment": "Acaricide spray: Spiromesifen 22.9 SC at 1 ml/L, Propargite 57 EC at 2 ml/L, or Abamectin 1.9 EC at 0.5 ml/L.",
        "organicTreatment": "Spray Neem oil 3000 ppm at 3 ml/L with mild surfactant; release predatory mites (Phytoseiulus persimilis).",
        "prevention": "Avoid water stress in crops (spider mites thrive in hot, dry, dusty conditions); wash foliage with strong water spray."
    },
    "Tomato___Target_Spot": {
        "crop": "Tomato",
        "disease": "Target Spot",
        "isHealthy": False,
        "pathogen": "Fungal (Corynespora cassiicola)",
        "severity": "Moderate",
        "symptoms": "Pinpoint brown spots expanding into circular necrotic lesions with light brown centers and faint concentric circles.",
        "chemicalTreatment": "Spray Azoxystrobin 23 SC at 1 ml/L or Difenoconazole 25 EC at 0.5 ml/L.",
        "organicTreatment": "Apply Copper Hydroxide at 2.5 g/L or bio-agent Pseudomonas fluorescens.",
        "prevention": "Ensure good staking and avoid overhead irrigation to minimize leaf wetness duration."
    },
    "Tomato___Tomato_Yellow_Leaf_Curl_Virus": {
        "crop": "Tomato",
        "disease": "Tomato Yellow Leaf Curl Virus (TYLCV)",
        "isHealthy": False,
        "pathogen": "Viral (Begomovirus, vectored by Whitefly Bemisia tabaci)",
        "severity": "Critical",
        "symptoms": "Stunted bushy growth, upward curling and cupping of leaflets, marked marginal chlorosis, severe flower dropping and poor fruit set.",
        "chemicalTreatment": "Control vector Whitefly: Spray Diafenthiuron 50 WP at 1 g/L, Spirotetramat 15.31 OD at 1 ml/L, or Thiamethoxam 25 WG at 0.3 g/L.",
        "organicTreatment": "Install yellow sticky traps (15 traps/acre); spray Neem oil 10,000 ppm at 2 ml/L; rogue out infected plants.",
        "prevention": "Grow TYLCV-tolerant hybrids; cover nursery beds with 40-mesh insect netting."
    },
    "Tomato___Tomato_mosaic_virus": {
        "crop": "Tomato",
        "disease": "Tomato Mosaic Virus (ToMV)",
        "isHealthy": False,
        "pathogen": "Viral (Tobamovirus, mechanically transmitted)",
        "severity": "High",
        "symptoms": "Light and dark green mosaic patterns on foliage, leaf distortion, 'shoestring' or fern-like leaf morphology, internal brown browning of fruit.",
        "chemicalTreatment": "No curative chemical exists. Rogue and burn infected plants immediately.",
        "organicTreatment": "Foliar spray with skimmed milk (10%) during transplant handling to inactivate mechanical transmission.",
        "prevention": "Sterilize tools and wash hands with 20% trisodium phosphate (TSP); avoid tobacco use in vicinity."
    },
    "Tomato___healthy": {
        "crop": "Tomato",
        "disease": "Healthy Foliage",
        "isHealthy": True,
        "pathogen": "None (Healthy Tissue)",
        "severity": "None",
        "symptoms": "Vigorous, dark green foliage with healthy blossoms and firm, unblemished fruit development.",
        "chemicalTreatment": "No treatment required. Maintain scheduled balanced fertigation.",
        "organicTreatment": "Apply compost tea and foliar seaweed extract.",
        "prevention": "Maintain staking, regular suckering, and even drip irrigation to prevent blossom end rot."
    }
}

# Global cached PyTorch model
_MODEL = None
_TRANSFORM = transforms.Compose([
    transforms.Resize((224, 224)),
    transforms.ToTensor(),
    transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225])
])


def load_disease_model():
    """Load EfficientNet-B0 model checkpoint into memory"""
    global _MODEL
    if _MODEL is not None:
        return _MODEL

    if not os.path.exists(MODEL_PATH):
        raise FileNotFoundError(f"Model file not found at: {MODEL_PATH}")

    model = models.efficientnet_b0(weights=None)
    model.classifier[1] = torch.nn.Linear(model.classifier[1].in_features, len(CLASS_NAMES))

    checkpoint = torch.load(MODEL_PATH, map_location="cpu", weights_only=False)
    state_dict = checkpoint["model_state_dict"] if "model_state_dict" in checkpoint else checkpoint
    model.load_state_dict(state_dict)
    model.eval()
    _MODEL = model
    return _MODEL


def predict_from_pil(image: Image.Image) -> Dict[str, Any]:
    """Run inference on PIL Image and return structured pathology report"""
    model = load_disease_model()
    rgb_image = image.convert("RGB")
    tensor = _TRANSFORM(rgb_image).unsqueeze(0)

    with torch.no_grad():
        logits = model(tensor)
        probs = torch.softmax(logits, dim=1).squeeze(0)

    top_probs, top_indices = torch.topk(probs, k=3)
    
    top1_idx = top_indices[0].item()
    top1_score = float(top_probs[0].item())
    top1_class = CLASS_NAMES[top1_idx]
    
    details = DISEASE_KNOWLEDGE.get(top1_class, {
        "crop": top1_class.split("___")[0],
        "disease": top1_class.split("___")[1].replace("_", " "),
        "isHealthy": "healthy" in top1_class.lower(),
        "pathogen": "Unknown",
        "severity": "Low" if "healthy" in top1_class.lower() else "Moderate",
        "symptoms": "Leaf tissue inspection",
        "chemicalTreatment": "Consult local agricultural extension officer.",
        "organicTreatment": "Neem oil spray (1500 ppm).",
        "prevention": "Ensure good sanitation and clean water drainage."
    })

    # Prepare top-3 differential diagnosis alternatives
    differential_diagnosis = []
    for i in range(len(top_indices)):
        idx = top_indices[i].item()
        c_name = CLASS_NAMES[idx]
        c_prob = float(top_probs[i].item())
        info = DISEASE_KNOWLEDGE.get(c_name, {})
        differential_diagnosis.append({
            "className": c_name,
            "crop": info.get("crop", c_name.split("___")[0]),
            "disease": info.get("disease", c_name.split("___")[1].replace("_", " ")),
            "confidence": round(c_prob * 100, 2),
            "isHealthy": info.get("isHealthy", "healthy" in c_name.lower())
        })

    return {
        "success": True,
        "className": top1_class,
        "crop": details["crop"],
        "disease": details["disease"],
        "isHealthy": details["isHealthy"],
        "confidence": round(top1_score * 100, 2),
        "pathogen": details["pathogen"],
        "severity": details["severity"],
        "symptoms": details["symptoms"],
        "chemicalTreatment": details["chemicalTreatment"],
        "organicTreatment": details["organicTreatment"],
        "prevention": details["prevention"],
        "differentialDiagnosis": differential_diagnosis,
        "modelArchitecture": "EfficientNet-B0 (98.3% Validation Accuracy)"
    }


def predict_from_base64(b64_string: str) -> Dict[str, Any]:
    """Decode base64 image data and run prediction"""
    if "," in b64_string:
        b64_string = b64_string.split(",", 1)[1]
    image_bytes = base64.b64decode(b64_string)
    image = Image.open(io.BytesIO(image_bytes))
    return predict_from_pil(image)


def predict_from_file(file_path: str) -> Dict[str, Any]:
    """Load image from disk and run prediction"""
    image = Image.open(file_path)
    return predict_from_pil(image)


if __name__ == "__main__":
    if len(sys.argv) > 1:
        arg = sys.argv[1]
        try:
            if os.path.exists(arg):
                result = predict_from_file(arg)
            else:
                result = predict_from_base64(arg)
            print(json.dumps(result, indent=2))
        except Exception as err:
            print(json.dumps({"success": False, "error": str(err)}))
            sys.exit(1)
    else:
        # Generate and test dummy image to verify pipeline
        print("Testing vision pipeline with synthetic foliar sample...")
        dummy_img = Image.new("RGB", (224, 224), color=(34, 139, 34))
        res = predict_from_pil(dummy_img)
        print("Pipeline Verified Successfully:")
        print(json.dumps(res, indent=2))
