import pandas as pd
import numpy as np
import pickle

from sklearn.preprocessing import LabelEncoder

from keras.models import Model
from keras.layers import (
    Input, Embedding, LSTM, Dense, Dropout,
    GlobalAveragePooling1D
)
from keras.preprocessing.text import Tokenizer
from keras.preprocessing.sequence import pad_sequences


df = pd.read_csv("tn_model2_model3_500_rows.csv")
df = df.drop_duplicates()
print("Dataset shape:", df.shape)


label_encoders = {}

TARGET_COLUMNS = [
    "category",
    "doctor_type",
    "health_camp",
    "govt_scheme",
    "funding_support"
]

for col in TARGET_COLUMNS:
    le = LabelEncoder()
    df[col] = le.fit_transform(df[col])
    label_encoders[col] = le



MAX_WORDS = 5000
MAX_LEN = 6

tokenizer = Tokenizer(num_words=MAX_WORDS, oov_token="<OOV>")
tokenizer.fit_on_texts(df["disease_name"])

X_seq = tokenizer.texts_to_sequences(df["disease_name"])
X_pad = pad_sequences(X_seq, maxlen=MAX_LEN)



y_outputs = {
    "category": df["category"].values,
    "doctor": df["doctor_type"].values,
    "camp": df["health_camp"].values,
    "scheme": df["govt_scheme"].values,
    "funding": df["funding_support"].values
}



input_layer = Input(shape=(MAX_LEN,), name="disease_input")

x = Embedding(MAX_WORDS, 128)(input_layer)
x = LSTM(64, return_sequences=True)(x)
x = GlobalAveragePooling1D()(x)
x = Dense(64, activation="relu")(x)
x = Dropout(0.3)(x)

outputs = [
    Dense(len(label_encoders["category"].classes_), activation="softmax", name="category")(x),
    Dense(len(label_encoders["doctor_type"].classes_), activation="softmax", name="doctor")(x),
    Dense(len(label_encoders["health_camp"].classes_), activation="softmax", name="camp")(x),
    Dense(len(label_encoders["govt_scheme"].classes_), activation="softmax", name="scheme")(x),
    Dense(len(label_encoders["funding_support"].classes_), activation="softmax", name="funding")(x)
]

model = Model(inputs=input_layer, outputs=outputs)

model.compile(
    optimizer="adam",
    loss="sparse_categorical_crossentropy",
    metrics=["accuracy"]
)

model.summary()



model.fit(
    X_pad,
    y_outputs,
    epochs=20,
    batch_size=32,
    validation_split=0.2
)



model.save("smart_health_suggestion_model.h5")
print("Model saved as smart_health_suggestion_model.h5")

with open("tokenizer.pkl", "wb") as f:
    pickle.dump(tokenizer, f)
print("Tokenizer saved")

with open("label_encoders.pkl", "wb") as f:
    pickle.dump(label_encoders, f)
print("Label encoders saved")



def smart_health_suggestion(disease_name):
    seq = tokenizer.texts_to_sequences([disease_name.lower()])
    padded = pad_sequences(seq, maxlen=MAX_LEN)

    preds = model.predict(padded, verbose=0)

    keys = ["category", "doctor", "camp", "scheme", "funding"]
    result = {}

    for i, key in enumerate(keys):
        label = np.argmax(preds[i])
        result[key] = label_encoders[key].inverse_transform([label])[0]

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
    print("\n--- TEST OUTPUT ---\n")
    print(smart_health_suggestion("diabetes"))
    print(smart_health_suggestion("tuberculosis"))
    print(smart_health_suggestion("vitamin d deficiency"))
