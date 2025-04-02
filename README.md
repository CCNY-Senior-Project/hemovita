# 🩸 HemoVita - AI-Driven Blood Screening System  
#### Empowering Personalized Healthcare Through AI  

## 🧑‍💻 Meet the Team  
### **Project Manager & Developer** – Selma Doganata  
📧 Contact: [sdogana000@citymail.cuny.edu]  
Hello! I’m Selma, the Project Manager and Developer for HemoVita. My role involves overseeing the project's progress, coordinating team efforts, and ensuring smooth development.  

### **Machine Learning Engineer** – Jubyaid Uddin  
📧 Contact: [juddin002@citymail.cuny.edu]  
Hi, I’m Jubyaid! As the Machine Learning Engineer, I’m responsible for implementing AI models that analyze blood test data and provide personalized nutritional insights.  

### **Researcher & Data Analyst** – Rahat Rahman  
📧 Contact: [rrahman008@citymail.cuny.edu]  
Hey! I’m Rahat, the Researcher and Data Analyst for this project. My job is to curate high-quality datasets, research existing blood screening technologies, and ensure our AI model is data-driven and reliable.  

---

## 🩺 Application Overview  
HemoVita is an **AI-powered blood screening system** that identifies nutrient deficiencies and provides **personalized supplement recommendations**. By analyzing blood test results, our system offers insights into an individual's nutritional status and suggests dietary improvements.  

### 📌 Key Features  
✅ **Automated Bloodwork Analysis** – AI-driven deficiency detection  
✅ **Personalized Recommendations** – Tailored supplement and diet plans  
✅ **Absorption Optimization** – AI-suggested co-factors for better uptake  
✅ **Scalability** – Integration with multiple medical datasets  

---

## 📌 Problem Definition & Scope  

### **🚨 Problem Statement**  
Nutritional deficiencies affect billions, leading to conditions like anemia and osteoporosis. Current blood screening focuses on **disease detection**, while supplement recommendations remain **generic and ineffective** due to **individual absorption differences**.  

### **🎯 Target Application & Significance**  
HemoVita bridges this gap by using **AI to detect deficiencies and provide personalized nutrition insights**, enhancing **diagnostic precision** and **nutrient absorption** while enabling scalability in healthcare.  

HemoVita aims to fill this gap by developing an **AI-driven blood screening system** that not only **identifies micronutrient deficiencies** but also **provides personalized supplement recommendations**. This approach enhances **diagnostic precision**, and improves **nutrient absorption**.

### **📌 Scope & Assumptions**  
- **Scope:**  
  - AI-based **blood test analysis** for **micronutrient deficiencies**  
  - **Personalized supplement & diet recommendations**  
  - Designed for **individuals, healthcare providers, and researchers**  

- **Assumptions & Limitations:**  
  - **High-quality blood test data** availability is essential  
  - **Does not replace medical professionals** but aids decision-making  
  - **User compliance** impacts effectiveness
---
## 🔧 Project Subtasks

### 1. **Blood Test Data Parsing & Preprocessing**  
Transform raw blood test reports (PDFs or EHR exports) into clean, standardized data tables.  
- Tool Used: **Camelot** for PDF parsing, **Pandas** for label/unit standardization, **SimpleImputer** for handling missing values.

### 2. **Micronutrient Deficiency Detection via AI**  
Train machine learning models to detect nutritional deficiencies from parsed bloodwork data.  
- Tool Used: **XGBoost** for classification, **AutoGluon** for AutoML experimentation, **SHAP** for model explainability.

### 3. **Absorption Optimization Modeling**  
Build nutrient interaction graphs to recommend co-factors that improve supplement absorption.  
- Tool Used: **NetworkX** for interaction modeling, **PubTator** for biomedical relation mining, **Wikidata SPARQL** for ontology queries.

---

## 🛠️ How HemoVita Stands Out  
| **Feature** | **HemoVita** | **Existing Systems** |
|------------|-------------|--------------------|
| **Nutrient-Specific Analysis** | ✔ Focuses on **micronutrient deficiencies** | ❌ Detects **diseases only** |
| **AI-Driven Recommendations** | ✔ Personalized **supplements & diet** | ❌ Generic **interpretations** |
| **Data Integration** | ✔ Connects to **medical datasets** | ❌ Limited **scalability** |

---

## 🌎 Who is it for?  
🩸 **Patients & Individuals** – Track and optimize **nutrient intake**  
🏥 **Healthcare Providers** – AI-powered **clinical decision support**  
🔬 **Researchers & Data Scientists** – Contribute to **nutritional AI research**  
💊 **Supplement & Nutrition Companies** – Personalize **product recommendations**  

---

## 📌 Why This Project?  
With **nutritional deficiencies on the rise**, HemoVita shifts healthcare from **reactive disease treatment** to **preventative, AI-driven nutrition insights**—empowering users to make **data-driven health decisions**.  

---

## Project Workflow Diagram  
![image](https://github.com/user-attachments/assets/b781e4a9-81b6-437e-8c01-ecf27c9f7aea)  
