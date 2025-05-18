from flask import request, jsonify, Blueprint
import numpy as np
import torch
from transformers import DistilBertForSequenceClassification, DistilBertTokenizerFast
import re
# from nltk.corpus import stopwords 
# stop_words = set(stopwords.words('english'))
# stop_words.add("rt")
stop_words = ['a', 'about', 'above', 'after', 'again', 'against', 'ain', 'all', 'am',
 'an', 'and', 'any', 'are', 'aren', "aren't", 'as', 'at', 'be', 'because', 'been', 'before',
 'being', 'below', 'between', 'both', 'but', 'by', 'can', 'couldn', "couldn't", 'd', 'did', 'didn',
 "didn't", 'do', 'does', 'doesn', "doesn't", 'doing', 'don', "don't", 'down', 'during', 'each',
 'few', 'for', 'from', 'further', 'had', 'hadn', "hadn't", 'has', 'hasn', "hasn't", 'have',
 'haven', "haven't", 'having', 'he', 'her','here', 'hers', 'herself', 'him', 'himself', 'his',
 'how', 'i', 'if', 'in','into','is', 'isn', "isn't", 'it', "it's", 'its', 'itself', 'just',
 'll', 'm', 'ma', 'me', 'mightn', "mightn't", 'more', 'most', 'mustn', "mustn't", 'my', 'myself',
 'needn', "needn't", 'no', 'nor', 'not', 'now', 'o', 'of', 'off', 'on', 'once', 'only', 'or',
 'other', 'our', 'ours', 'ourselves', 'out', 'over', 'own', 're', 'rt', 's','same', 'shan',
 "shan't", 'she', "she's", 'should', "should've", 'shouldn', "shouldn't", 'so','some', 'such',
 't', 'than', 'that', "that'll", 'the', 'their', 'theirs', 'them', 'themselves', 'then', 'there',
 'these', 'they', 'this', 'those', 'through', 'to', 'too', 'under', 'until', 'up', 've', 'very',
 'was', 'wasn', "wasn't", 'we', 'were', 'weren', "weren't", 'what', 'when', 'where', 'which',
 'while', 'who', 'whom', 'why', 'will', 'with', 'won', "won't", 'wouldn', "wouldn't", 'y',
 'you', "you'd", "you'll", "you're", "you've", 'your', 'yours', 'yourself', 'yourselves']

model_name_1 = "jm12312/Hate-Speech-And-Offensive-Language" 
tokenizer_1 = DistilBertTokenizerFast.from_pretrained(model_name_1)
model_1 = DistilBertForSequenceClassification.from_pretrained(model_name_1)

blackhole_bp = Blueprint("blackhole_bp", __name__)
device = torch.device('cuda') if torch.cuda.is_available() else torch.device('cpu')

@blackhole_bp.route("/hate-n-offensive", methods=["POST"])
def get_offensive_words():
    data = request.get_json()
    text = data.get("text", "")
    if not text.strip():
        return jsonify({"error": "No text provided."}), 400
    
    # sentences = re.findall(r'[.?!]\s*', text)

    # Remove any empty strings (e.g., from trailing punctuation)
    sentences = [s.strip() for s in re.findall(r'[^.?!]*[.?!]', text)]
    r = []
    for sen in sentences:
        inputs = tokenizer_1(sen, return_tensors="pt", padding=True, truncation=True, max_length=512).to(device)
    
        # Set the model to evaluation mode
        model_1.eval()
        
        # Make predictions
        with torch.no_grad():
            outputs = model_1(**inputs)
            logits = outputs.logits
        
        # Get the predicted class (for classification)
        predicted_class = torch.argmax(logits, dim=-1).item()
        print(sen, predicted_class)
        r.append([sen, predicted_class])
    rplcd = []
    for lst in r:
        x, y = lst[0], lst[1]
        if y==1 or y==0:
            replaced_text = process_all(x)
            rplcd.append(replaced_text)
        else:
            rplcd.append([{'child': x, "teen": x, "adult": x}])
    print(rplcd)
    return jsonify(r, rplcd)

import torch.nn.functional as F
def predict_text(word, model, tokenizer):
    inputs = tokenizer(word, return_tensors="pt", padding=True, truncation=True, max_length=512).to(device)

    # Set the model to evaluation mode
    model.eval()
    
    # Make predictions
    with torch.no_grad():
        outputs = model_1(**inputs)
        logits = outputs.logits
    
    # Get the predicted class (for classification)
    predicted_class = torch.argmax(logits, dim=-1).item()
    probs = F.softmax(logits, dim=-1).squeeze().tolist()
    return {
        "predicted_class": predicted_class,
        "confidence": max(probs)
    }

def predict_harmfulness_and_spans(text, model, tokenizer):
    """
    Dynamically detects harmful content using your model.
    Returns:
    - label: "harmful" or "benign"
    - score: max confidence of any harmful word
    - spans: list of offensive words
    """
    words = text.split()
    spans = []
    max_conf = 0.0
    for word in words:
        result = predict_text(word, model, tokenizer)
        if (result["predicted_class"] == 1 or result['predicted_class']==0) and result["confidence"] > 0.5:
            if word.lower() not in stop_words:
                spans.append(word)
                max_conf = max(max_conf, result["confidence"])
    label = "harmful" if spans else "benign"
    return {"label": label, "score": max_conf, "spans": spans}

# --- Dynamic Censoring Functions ---
def censor_word(word):
    return "[censored]"

def mask_word(word):
    return word[0] + "*" * (len(word) - 1) if len(word) > 1 else "*"

def replace_spans(text, spans, mode="child"):
    """
    Rewrites the text based on mode:
    - child: full censor
    - teen: mask
    """
    for phrase in sorted(spans, key=len, reverse=True):
        pattern = re.compile(re.escape(phrase), re.IGNORECASE)
        if mode == "child":
            text = pattern.sub(censor_word(phrase), text)
        elif mode == "teen":
            text = pattern.sub(mask_word(phrase), text)
    return text

def adapt_text(text, profile, model, tokenizer):
    result = predict_harmfulness_and_spans(text, model, tokenizer)
    label, score, spans = result["label"], result["score"], result["spans"]

    if label == "harmful" and score > 0.5:
        if profile == "child":
            return replace_spans(text, spans, mode="child")
        elif profile == "teen":
            return replace_spans(text, spans, mode="teen")
        elif profile == "adult":
            return f"{text}"
    return text

# # --- Sample Paragraphs ---
# paragraphs = [
#     "The action was fucking insane—big explosions, badass fight scenes, the works.",
#     # "That bastard said he’d shoot anyone who touched his car. What an asshole!",
#     # "Go fuck yourself. Nobody wants your ideas here."
# ]

# --- Run for All Profiles ---
# @blackhole_bp.route("/all-modes", methods=["POST"])
def process_all(paragraphs):
    profiles = ["child", "teen", "adult"]
    msg = []
    # for idx, para in enumerate(paragraphs, 1):
    #     print(f"\n=== Paragraph {idx} ===")
    #     print("Original:\n", para)
    #     print("")
    for profile in profiles:
        output = adapt_text(paragraphs, profile, model_1, tokenizer_1)
        print(f"{profile.capitalize()} version:\n{output}\n")
        msg.append({profile: output})

    return msg