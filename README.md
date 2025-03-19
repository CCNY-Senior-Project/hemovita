# 🩸 HemoVita - AI-Driven Blood Screening System  
#### Empowering Personalized Healthcare Through AI  

## 🧑‍💻 Meet the Team  
### **Project Manager & Developer** – Selma Doganata  
📧 Contact: [Your Email]  
Hello! I’m Selma, the Project Manager and Developer for HemoVita. My role involves overseeing the project's progress, coordinating team efforts, and ensuring smooth development.  

### **Machine Learning Engineer** – Jubyaid Uddin  
📧 Contact: [Your Email]  
Hi, I’m Jubyaid! As the Machine Learning Engineer, I’m responsible for implementing AI models that analyze blood test data and provide personalized nutritional insights.  

### **Researcher & Data Analyst** – Rahat Rahman  
📧 Contact: [Your Email]  
Hey! I’m Rahat, the Researcher and Data Analyst for this project. My job is to curate high-quality datasets, research existing blood screening technologies, and ensure our AI model is data-driven and reliable.  

---

## 🩺 Application Overview  
HemoVita is an **AI-powered blood screening system** that identifies nutrient deficiencies and provides **personalized supplement recommendations**. By analyzing blood test results, our system offers insights into an individual's nutritional status and suggests dietary improvements.  

### 📌 Key Features  
✅ **Automated Bloodwork Analysis** – AI-driven identification of essential nutrient deficiencies.  
✅ **Personalized Recommendations** – Tailored supplement and dietary suggestions based on test results.  
✅ **Absorption Optimization** – AI-suggested co-factors that enhance nutrient uptake.  
✅ **Scalability & Adaptability** – Designed for integration with multiple medical datasets.  

---

## 🛠️ How HemoVita Stands Out  
| **Feature** | **HemoVita** | **Existing Blood Screening Systems** |
|------------|-------------|----------------------------------|
| **Nutrient-Specific Analysis** | ✔ Focuses on **micronutrient deficiencies** | ❌ Primarily detects **diseases** |
| **AI-Driven Recommendations** | ✔ Suggests **supplements and diet adjustments** | ❌ Limited to general **blood test interpretations** |
| **Data Integration** | ✔ Can be integrated with **various medical datasets** | ❌ Often reliant on **fixed datasets** |

---
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

### **1. Blood-Analysis Github**  
- **Features:** Implements AI-driven analysis of blood test results to detect potential health conditions.  
- **Usability:** Utilizes deep learning models trained on clinical datasets to provide diagnostic insights.  
- **Strength:** Provides robust detection of abnormalities but does not offer personalized nutrient recommendations.  

### **2. Hemo-Detect Github**  
- **Features:** AI-powered tool designed to identify blood disorders, including anemia and clotting disorders.  
- **Usability:** Leverages convolutional neural networks (CNNs) and other machine learning techniques to analyze hematological data.  
- **Strength:** Offers high accuracy in detection but lacks a comprehensive approach to dietary or nutritional guidance.  

### **3. Survival Analysis of Heart Failure Patients: A Case Study**  
- **Features:** Examines survival rates of heart failure patients using statistical and machine learning models.  
- **Usability:** Applies Kaplan-Meier survival analysis and Cox regression to assess patient outcomes based on clinical variables.  
- **Strength:** Provides insights into risk factors affecting survival but does not focus on blood-related nutritional deficiencies.  

### **4. Vitamin and Mineral Nutrition Information System - WHO**  
- **Features:** A global database that compiles information on micronutrient deficiencies, including iron, vitamin A, and iodine.  
- **Usability:** Provides country-level data and trends on vitamin and mineral intake, deficiencies, and health impacts.  
- **Strength:** Offers a comprehensive dataset but does not include AI-driven predictive analysis.  

### **5. NCHS Data Query System - CDC**  
- **Features:** A publicly accessible database that provides statistics on health conditions, including anemia and other blood-related issues.  
- **Usability:** Allows users to query large-scale national health datasets for trends in blood disorders, nutrition, and disease prevalence.  
- **Strength:** Delivers authoritative health data but lacks AI-powered diagnostic tools or real-time prediction capabilities.  

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
