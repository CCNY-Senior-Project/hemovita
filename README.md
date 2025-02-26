# HemoVita - AI-Driven Blood Screening System

## Team Name
**Theranos**

## Team Members and Roles
- **Selma Doganata** - Project Manager / Developer
- **Jubyaid Uddin** - Machine Learning Engineer
- **Rahat Rahman** - Researcher / Data Analyst

## Project Overview
**HemaVita AI** is an **AI-powered blood screening system** designed to detect **nutrient deficiencies** and recommend **personalized supplement plans**. Using **machine learning**, the system analyzes blood test results, identifies key deficiencies, and suggests **supporting vitamins and minerals** to enhance absorption and effectiveness.

### Features:
- **Automated Bloodwork Analysis:** Identifies deficiencies in essential nutrients.
- **Personalized Recommendations:** Suggests supplements and dietary adjustments.
- **Absorption Optimization:** Recommends co-factors that improve nutrient uptake.
- **Scalability & Adaptability:** Designed for integration with various medical datasets.

## Research on Similar Projects
We analyzed **three existing blood screening projects** to understand their strengths and areas for improvement.

### **1. Blood Analysis System** ([GitHub](https://github.com/husseinmleng/Blood-Analysis/tree/main))
- **Purpose:** Detects various blood-related conditions using AI.
- **Strengths:** Uses deep learning for accurate predictions.
- **Weaknesses:** Lacks nutrient-specific recommendations.
- **Improvements:** Our system will focus specifically on **nutritional deficiencies and supplement recommendations**.

### **2. MedGem – Automated Blood Report Analyzer** ([GitHub](https://github.com/Vishwapatil26/MedGem-Automated-Blood-Report-Analyzer))
- **Purpose:** Parses blood reports and provides analysis.
- **Strengths:** User-friendly UI, supports multiple blood parameters.
- **Weaknesses:** Limited scope beyond general analysis.
- **Improvements:** Our project will integrate **AI-driven insights and personalized supplement plans**.

### **3. Hemo-Detect** ([GitHub](https://github.com/Shaz-5/hemo-detect))
- **Purpose:** Detects anemia and other blood disorders using AI.
- **Strengths:** Uses computer vision for blood cell classification.
- **Weaknesses:** Focuses only on disease detection.
- **Improvements:** We will expand the scope to **nutrition-based diagnostics and preventive healthcare**.

### **How Our Project Differs:**
✔ **Nutrient-Specific Analysis** – Instead of general disease detection, we focus on **identifying and treating nutritional deficiencies**.  
✔ **AI-Driven Recommendations** – Suggests **vitamins and minerals** that improve nutrient absorption.  
✔ **Scalability** – Can integrate with various **biomedical datasets** for future expansion.  

## Relevant Datasets
We analyzed **three research articles** and selected **five datasets** to strengthen the depth of our project. These can be found in the Datasets and Research_papers folders

### **1.

### **2.

### **3.

### **4.

### **5.

---

## Project Workflow Diagram
![image](https://github.com/user-attachments/assets/b781e4a9-81b6-437e-8c01-ecf27c9f7aea)
 

## Project Directory Structure
```plaintext
main/
│── 📁 data/            # Sample bloodwork datasets (CSV, JSON, API responses)
│── 📁 models/          # Trained machine learning models & weights
│── 📁 src/             # Core application code (data processing, AI models, API logic)
│   ├── preprocessing/  # Data cleaning and normalization scripts
│   ├── analysis/       # Deficiency detection & recommendation engine
│   ├── api/            # Backend API endpoints (Flask/FastAPI)
│── 📁 docs/            # Project documentation, research papers, and references
│── 📁 assets/          # UI mockups, UML diagrams, figures
│── 📁 notebooks/       # Jupyter notebooks for model training, testing, and visualization
│── 📁 tests/           # Unit tests and validation scripts
│── 📄 README.md        # Project overview and setup instructions
│── 📄 requirements.txt # List of dependencies and installation guide
│── 📄 app.py           # Main application entry point (if applicable)
│── 📄 config.py        # Configuration settings for the application
│── 📄 .gitignore       # Files and directories to ignore in version control 
