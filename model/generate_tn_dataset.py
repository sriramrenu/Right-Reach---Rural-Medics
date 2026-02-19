import pandas as pd
import random


DISEASE_TEMPLATES = [
    ("diabetes", "non_communicable", "Endocrinologist", "NCD Screening Camp", "Govt PHC",
     "CMCHIS", "Private Insurance", "Government Coverage"),

    ("hypertension", "non_communicable", "General Physician", "Heart Health Camp", "Govt Hospital Pharmacy",
     "CMCHIS", "Private Insurance", "Government Coverage"),

    ("tuberculosis", "communicable", "General Physician", "TB Control Camp", "Govt TB Center",
     "National TB Elimination Programme", "None", "Government Aid"),

    ("dengue", "communicable", "General Physician", "Vector Borne Disease Camp", "Govt PHC",
     "National Health Mission", "None", "Government Aid"),

    ("vitamin d deficiency", "nutritional", "General Physician", "Nutrition Camp", "PHC / Camp Supply",
     "Poshan Abhiyaan", "None", "Government Aid"),

    ("iron deficiency anemia", "nutritional", "General Physician", "Anemia Screening Camp", "PHC / Camp Supply",
     "Anaemia Mukt Bharat", "None", "Government Aid"),

    ("depression", "mental_health", "Psychiatrist", "Mental Wellness Camp", "Govt Hospital Pharmacy",
     "National Mental Health Programme", "Private Therapy", "NGO Support"),

    ("pregnancy", "maternal_child", "Gynecologist", "Maternal Care Camp", "Govt Maternity Hospital",
     "Dr Muthulakshmi Reddy Scheme", "None", "Government Aid"),

    ("autism", "disability_rehab", "Rehabilitation Specialist", "Disability Support Camp", "Govt Rehab Center",
     "Disability Welfare Scheme", "None", "Government Aid"),

    ("arthritis", "geriatric", "Orthopedic Specialist", "Elder Care Camp", "Govt Hospital Pharmacy",
     "Senior Citizen Health Scheme", "None", "Government Aid"),

    ("asthma", "respiratory", "Pulmonologist", "Respiratory Health Camp", "Govt Hospital Pharmacy",
     "CMCHIS", "Private Insurance", "Government Coverage"),

    ("gastritis", "digestive", "General Physician", "General Health Camp", "Nearby Pharmacy",
     "CMCHIS", "Private Insurance", "Self / Govt"),

    ("eczema", "skin", "Dermatologist", "Skin Care Camp", "Nearby Pharmacy",
     "CMCHIS", "Private Insurance", "Self / Govt"),
]

#
rows = []

for _ in range(500):
    disease, category, doctor, camp, medicine, govt, private, funding = random.choice(DISEASE_TEMPLATES)

    rows.append({
        "disease_name": disease,
        "category": category,
        "doctor_type": doctor,
        "health_camp": camp,
        "medicine_source": medicine,
        "govt_scheme": govt,
        "private_scheme": private,
        "funding_support": funding,
        "kiosk_support": random.choice(["Yes", "Yes", "Yes", "Optional"]),
        "offline_appointment": random.choice(["Yes", "Yes", "Optional"]),
        "state": "Tamil Nadu"
    })


df = pd.DataFrame(rows)
df.to_csv("tn_model2_model3_500_rows.csv", index=False)

print("Dataset created:", df.shape)
print(df.head())
