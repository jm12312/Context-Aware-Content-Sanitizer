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
> Alright, just got out of that new superhero movie, and I gotta vent. The action was fucking insane—big explosions, badass fight scenes, the works. Like, my jaw dropped at some of the stunts. But the story? Total shit. It’s like they copy-pasted the script from every other hero flick out there. So predictable I was rolling my eyes half the time. Still, I’ll give props to the villain. That dude’s backstory was dark and actually had me hooked for a minute. Kept things from being a complete snooze.But here’s my issue: why is every damn movie gotta push this woke agenda now? It’s annoying as hell. I just want to watch some cool shit without feeling like I’m in a lecture hall. Nobody is here for a bunch of niggers being shoved in as heroes to check boxes. Can we just get back to making fun movies? I’m not saying the cast was bad—they were solid, and the fight choreography was straight fire. But the preachy vibes ruin it. Movie’s like a 6/10 at best because of that.On another note, I’m already hyped for that sci-fi flick coming next month. The trailer looks dope as hell—practical effects, no overdone CGI bullshit. That’s the kind of thing I can get behind. Hopefully, it doesn’t pull the same weak story crap as this one. Fingers crossed it’s a banger.Oh, and don’t get me started on how soft everyone’s gotten. People lose their minds if you say anything real these days. Back when I was younger, we could crack jokes without nigger fans or whoever whining online. Now it’s like you can’t open your mouth without someone crying. The internet’s a fucking mess, man. Anyway, that’s my take. Just needed to get this off my chest after that movie.

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
