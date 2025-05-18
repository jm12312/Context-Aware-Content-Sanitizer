# Context-Aware Content Sanitizer

## Overview

This project provides a **content moderation API** that detects and filters offensive language in text. It offers **three distinct filtering modes** for different audiences: **Adult**, **Teen**, and **Child**.

---

## 🚀 Features

### 🔥 Three Content Filtering Modes

- **Adult Mode:**  
  - Shows original text with offensive content **highlighted**.

- **Teen Mode:**  
  - Masks offensive words (e.g., `"f***"`).

- **Child Mode:**  
  - Fully censors offensive content (e.g., `"[censored]"`).

---

### 🎯 High Accuracy Detection

- Fine-tuned **DistilBERT** model achieves **91.29% accuracy**
- Trained on a comprehensive hate speech dataset

---

## 🧠 Model Training

- **Dataset:**  
  [Hate Speech and Offensive Language Dataset](https://www.kaggle.com/datasets/thedevastator/hate-speech-and-offensive-language-detection)
- **Model:**  
  DistilBERT (distilled version of BERT)
- **Training:**  
  6 epochs, AdamW optimizer (learning rate 1e-5)
- **Batch Size:**  
  16 (training), 32 (validation)

**Performance:**

| Metric           | Value     |
|------------------|-----------|
| Validation Loss  | 0.2884    |
| Accuracy         | 91.29%    |
| F1 Score         | 91.04%    |

---

## 📝 Example Input

![Input Example](https://github.com/user-attachments/assets/b4df1763-17f5-45f9-b36b-a573bb0824fc)

**Input Text:**  
> Alright, just got out of that new superhero movie, and I gotta vent. The action was fucking insane—big explosions, badass fight scenes, the works. Like, my jaw dropped at some of the stunts. But the[...]

---

## 👀 Output for Each Mode

### 1. **Adult Mode**

![Adult Mode Output](https://github.com/user-attachments/assets/17607c33-7e38-450a-b9cf-84152ba0335f)

---

### 2. **Teen Mode**

![Teen Mode Output](https://github.com/user-attachments/assets/828345d1-ea33-4645-8b84-e2b37eef3e20)

---

### 3. **Child Mode**

![Child Mode Output](https://github.com/user-attachments/assets/6f15f8b2-5395-4671-b7d1-ae585ccfa917)

---
