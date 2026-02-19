import numpy as np
import pickle
from keras.models import load_model
from keras.preprocessing.sequence import pad_sequences


model = load_model("smart_health_suggestion_model.h5")

with open("tokenizer.pkl", "rb") as f:
    tokenizer = pickle.load(f)

with open("label_encoders.pkl", "rb") as f:
    label_encoders = pickle.load(f)

MAX_LEN = 6


def smart_health_suggestion_loaded(disease_name):
    seq = tokenizer.texts_to_sequences([disease_name.lower()])
    padded = pad_sequences(seq, maxlen=MAX_LEN)

    preds = model.predict(padded, verbose=0)

    
    output_key_map = {
        "category": "category",
        "doctor": "doctor_type",
        "camp": "health_camp",
        "scheme": "govt_scheme",
        "funding": "funding_support"
    }

    result = {}

    for i, (out_key, enc_key) in enumerate(output_key_map.items()):
        label_index = np.argmax(preds[i])
        result[out_key] = label_encoders[enc_key].inverse_transform([label_index])[0]

    return {
        "disease": disease_name,
        "category": result["category"],
        "recommended_doctor": result["doctor"],
        "health_camp": result["camp"],
        "government_scheme": result["scheme"],
        "funding_support": result["funding"],
        "note": "AI-assisted guidance. Not a medical diagnosis."
    }


if __name__ == "__main__":
    test_inputs = [
        "diabetes",
        "tuberculosis",
        "vitamin d deficiency",
        "depression",
        "pregnancy",
        "arthritis"
    ]

    print("\n========== MODEL TEST RESULTS ==========\n")

    for disease in test_inputs:
        output = smart_health_suggestion_loaded(disease)
        print("INPUT:", disease)
        for k, v in output.items():
            print(f"{k}: {v}")
        print("-" * 50)
