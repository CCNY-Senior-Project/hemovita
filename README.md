# 🩸 HemoVita – AI-Driven Blood Screening System  
**Empowering Personalized Healthcare Through AI**

---

## 💡 Why HemoVita?  
Micronutrient deficiencies—especially in Iron, B12, and Vitamin D—are common, underdiagnosed, and difficult for non-experts to interpret. HemoVita transforms raw blood test data into clear, personalized health recommendations using AI.  

Built for accessibility, HemoVita empowers users to understand their nutrient status and take action—without needing a clinician to decode lab reports.  

---

## 👩‍💻 Meet the Team  
**Project Manager & Developer** – *Selma Doganata*  
📧 sdogana000@citymail.cuny.edu  
Oversees technical development and system design.

**Machine Learning Engineer** – *Jubyaid Uddin*  
📧 juddin002@citymail.cuny.edu  
Develops ML models for nutrient deficiency classification and interpretability.

**Researcher & Data Analyst** – *Rahat Rahman*  
📧 rrahman008@citymail.cuny.edu  
Curates datasets, establishes clinical thresholds, and supports validation.

---

## 🔬 Scientific Foundation  
Deficiencies are detected using a hybrid method:  

- **Rule-Based Thresholding**  
  - *Iron*: Ferritin < 30 µg/L, MCV < 80 fL  
  - *B12*: B12 < 200 ng/L  
  - *Vitamin D*: 25-OH Vit D < 20 ng/mL  

- **Machine Learning Classification**  
  - Triggered for overlapping or borderline cases using tabular lab data and XGBoost.

---

## 🔄 System Pipeline  

1. **Data Upload & Extraction**  
   Users submit PDFs or CSVs of blood tests. The system uses structured parsing and, soon, OCR to extract lab values such as Ferritin, MCV, RDW, B12, and Vitamin D.

2. **Preprocessing & Normalization**  
   Extracted values are cleaned, converted to standard units, and mapped to expected input formats. Missing data is handled via imputation or flagged for user review.

3. **Deficiency Detection**  
   A hybrid approach is applied:  
   - **Threshold-based rules** identify deficiencies in clear cases.  
   - **XGBoost classifier** is used for nuanced or conflicting signals, combining features like RDW, MCV, and B12.

4. **Nutrient Interaction Modeling**  
   Once a deficiency is detected, the system evaluates nutrient interdependencies using a **knowledge graph** derived from clinical literature (e.g., Iron-B12 synergy, B12–Folate overlap).  
   This modeling ensures:  
   - No redundant supplementation  
   - Improved recommendations when multiple deficiencies co-occur

5. **Recommendation Engine**  
   Personalized supplement suggestions are generated based on the detected deficiencies and their interactions. Outputs are filtered through dosage safety checks and linked to common clinical guidelines.

6. **Interpretability & Transparency**  
   With SHAP values, users can see which biomarkers contributed most to the model’s decision—making results understandable and trustworthy.

7. **Results Interface** *(in development)*  
   A clean dashboard will visualize current results, previous uploads, and improvement over time—powered by Streamlit or Power BI.

---

## 🛠️ Tech Stack  

### Backend  
- **Python (FastAPI)** – Web API and logic  
- **XGBoost** – ML classification  
- **SHAP** – Interpretability  
- **AutoGluon** – Model benchmarking  
- **Optuna** – Hyperparameter tuning  

### Frontend  
- **Next.js** – Web framework  
- **Tailwind CSS** – Styling  
- **Axios** – API calls  

### Database  
- **SQLite** (initial) → **PostgreSQL** (scalable)
