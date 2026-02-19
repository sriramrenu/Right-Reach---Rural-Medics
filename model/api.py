"""
Smart Health Suggestion API
Flask microservice wrapping the Keras LSTM model.
Runs on port 5001.

Start with:  python api.py
"""

import os
import sys
import numpy as np
import pickle
from flask import Flask, request, jsonify
from flask_cors import CORS

# Suppress TensorFlow verbose logging
os.environ["TF_CPP_MIN_LOG_LEVEL"] = "3"

from keras.models import load_model
from keras.preprocessing.sequence import pad_sequences

# ── paths ──────────────────────────────────────────────────────────────────
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_PATH   = os.path.join(BASE_DIR, "smart_health_suggestion_model.h5")
TOKEN_PATH   = os.path.join(BASE_DIR, "tokenizer.pkl")
ENCODER_PATH = os.path.join(BASE_DIR, "label_encoders.pkl")
MAX_LEN = 6

# ── load artefacts at startup ──────────────────────────────────────────────
print("Loading model & artefacts …", flush=True)
model         = load_model(MODEL_PATH)
with open(TOKEN_PATH,   "rb") as f: tokenizer      = pickle.load(f)
with open(ENCODER_PATH, "rb") as f: label_encoders = pickle.load(f)
print("Ready!", flush=True)

OUTPUT_KEY_MAP = {
    "category": "category",
    "doctor":   "doctor_type",
    "camp":     "health_camp",
    "scheme":   "govt_scheme",
    "funding":  "funding_support",
}

# ── Flask app ──────────────────────────────────────────────────────────────
app = Flask(__name__)
CORS(app)


def predict(disease_name: str) -> dict:
    seq    = tokenizer.texts_to_sequences([disease_name.lower()])
    padded = pad_sequences(seq, maxlen=MAX_LEN)
    preds  = model.predict(padded, verbose=0)

    result = {}
    for i, (out_key, enc_key) in enumerate(OUTPUT_KEY_MAP.items()):
        idx            = int(np.argmax(preds[i]))
        result[out_key] = label_encoders[enc_key].inverse_transform([idx])[0]

    return {
        "disease":             disease_name,
        "category":            result["category"],
        "recommended_doctor":  result["doctor"],
        "health_camp":         result["camp"],
        "government_scheme":   result["scheme"],
        "funding_support":     result["funding"],
        "note":                "AI-assisted guidance. Not a medical diagnosis.",
    }


@app.route("/health", methods=["GET"])
def health():
    return jsonify({"status": "ok"})


@app.route("/predict", methods=["POST"])
def predict_route():
    data = request.get_json(force=True)
    disease = (data.get("disease") or "").strip()
    if not disease:
        return jsonify({"error": "Please provide a disease name."}), 400
    try:
        result = predict(disease)
        return jsonify(result)
    except Exception as exc:
        return jsonify({"error": str(exc)}), 500


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5001, debug=False)
