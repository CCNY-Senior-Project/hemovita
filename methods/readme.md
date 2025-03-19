# Evaluation Metrics for HemoVita AI

## Overview
The **Evaluation Metrics** subtask focuses on selecting and analyzing performance metrics to assess the effectiveness of machine learning models in detecting nutrient deficiencies from bloodwork data. Proper evaluation ensures that the model is **accurate, interpretable, and clinically reliable**, which is crucial for making **personalized supplement recommendations**.

## Relevance to the Overall Problem
Evaluation metrics help determine the **reliability and clinical applicability** of HemoVita AI. The right set of metrics ensures:
- **Accurate Deficiency Detection** – Models should correctly identify nutrient imbalances.
- **Minimal False Diagnoses** – Ensuring a low false positive/negative rate to avoid incorrect recommendations.
- **Clinical Trustworthiness** – The system should be interpretable for medical professionals.
- **Scalability & Adaptability** – Evaluation metrics should allow comparison across various datasets.

## Existing Technologies and Methodologies

Different types of evaluation metrics are used based on the **model type and prediction task**. Below are three key categories:

### 1. **Classification Metrics** (For Deficiency Detection)
- **Accuracy**: Measures the overall correctness of the model.
- **Precision & Recall (Sensitivity/Specificity)**: Evaluates how well deficiencies are identified without misclassifications.
- **F1 Score**: Balances precision and recall, useful for imbalanced datasets.
- **AUROC (Area Under the Receiver Operating Characteristic Curve)**: Measures the ability to distinguish between deficient and non-deficient cases.

📌 **Applicability:** Essential for models classifying blood samples as deficient/non-deficient.

**References:**
- Sokolova, M., & Lapalme, G. (2009). *A systematic analysis of performance measures for classification tasks*. Information Processing & Management. [DOI:10.1016/j.ipm.2009.03.002](https://doi.org/10.1016/j.ipm.2009.03.002)

---

### 2. **Regression Metrics** (For Continuous Nutrient Level Predictions)
- **Mean Absolute Error (MAE)**: Measures average deviation between predicted and actual values.
- **Mean Squared Error (MSE) & Root Mean Squared Error (RMSE)**: Penalizes larger errors more heavily.
- **R² Score (Coefficient of Determination)**: Measures how well the model explains variance in blood nutrient levels.

📌 **Applicability:** Useful when predicting **exact nutrient levels** instead of binary classification.

**References:**
- Willmott, C. J., & Matsuura, K. (2005). *Advantages of the mean absolute error (MAE) over the root mean square error (RMSE) in assessing average model performance*. Climate Research. [DOI:10.3354/cr010079](https://doi.org/10.3354/cr010079)

---

### 3. **Explainability & Trust Metrics** (For Clinical Reliability)
- **SHAP (Shapley Additive Explanations)**: Interprets individual model predictions.
- **LIME (Local Interpretable Model-Agnostic Explanations)**: Provides local feature importance.
- **Calibration Metrics (Brier Score, Reliability Diagrams)**: Ensures the model’s confidence matches reality.

📌 **Applicability:** Essential for **medical adoption** to ensure doctors and researchers trust AI-based diagnoses.

**References:**
- Ribeiro, M. T., Singh, S., & Guestrin, C. (2016). *"Why Should I Trust You?" Explaining the Predictions of Any Classifier*. Proceedings of the 22nd ACM SIGKDD. [DOI:10.1145/2939672.2939778](https://doi.org/10.1145/2939672.2939778)

---

## Reproducible Sources

### Open-Source Code Repositories:
1. **Scikit-learn Metrics Module** - Contains standard evaluation metrics for classification and regression: [Link](https://scikit-learn.org/stable/modules/model_evaluation.html)
2. **SHAP GitHub Repository** - Implementation of SHAP explainability framework: [Link](https://github.com/slundberg/shap)
3. **LIME GitHub Repository** - Implementation of LIME for model interpretation: [Link](https://github.com/marcotcr/lime)

### Public Datasets:
1. **Vitamin and Mineral Nutrition Information System (WHO)** - Global micronutrient deficiencies data: [Link](https://www.who.int/data)
2. **MIMIC-III Clinical Database** - Real-world electronic health records: [Link](https://physionet.org/content/mimic3/)
3. **Blood Chemistry Dataset (Kaggle)** - Blood test records for AI model evaluation: [Link](https://www.kaggle.com/datasets)

### Pretrained Models and Documentation:
1. **XGBoost for Medical Data** - [Link](https://github.com/dmlc/xgboost)
2. **TensorFlow Model Evaluation Toolkit** - [Link](https://www.tensorflow.org/tfx/guide/model_eval)
3. **Fairlearn (Fairness & Explainability for AI in Healthcare)** - [Link](https://github.com/fairlearn/fairlearn)

---

## Evaluation of Existing Solutions

### Effectiveness of Existing Approaches:
- **Standard Classification & Regression Metrics:** Effective for basic performance assessment but may not capture medical relevance.
- **SHAP & LIME for Explainability:** Useful but require integration into clinical workflows.
- **Calibration Metrics:** Improve trust but are often overlooked in AI-driven diagnostics.

### Limitations & Potential Improvements:
- **Medical Context Awareness:** Many existing metrics do not account for **clinical impact** (e.g., missing a critical deficiency).
- **Handling Imbalanced Data:** Precision/Recall tradeoffs need to be optimized for rare deficiencies.
- **Trust & Explainability Gaps:** Existing AI models lack widespread **clinician adoption** due to transparency concerns.

### Proposed Enhancements:
- **Clinical Impact-Driven Metrics:** Develop metrics incorporating **medical risks** of false positives/negatives.
- **Hybrid Model Evaluation:** Combine **traditional ML metrics + calibration + explainability tools**.
- **Benchmarking Framework:** Create a standardized **blood test AI evaluation toolkit** for research integration.

