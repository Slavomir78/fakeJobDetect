import pandas as pd
import pickle
import numpy as np
import os
import kagglehub
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.feature_selection import SelectKBest, chi2
from sklearn.linear_model import LogisticRegression
from sklearn.model_selection import train_test_split
from sklearn.metrics import classification_report

# ── paths ──────────────────────────────────────────────────────────────────
os.environ["KAGGLEHUB_CACHE"] = r"D:\infosys\kagglehub"
MODELS_DIR = os.path.join(os.path.dirname(__file__), "models")
os.makedirs(MODELS_DIR, exist_ok=True)

# ── Step 1: download dataset ────────────────────────────────────────────────
print("Downloading dataset from Kaggle...")
path = kagglehub.dataset_download("shivamb/real-or-fake-fake-jobposting-prediction")
csv_path = os.path.join(path, "fake_job_postings.csv")

# ── Step 2: load & preprocess ───────────────────────────────────────────────
print("Loading data...")
df = pd.read_csv(csv_path)
df["description"] = df["description"].fillna("").str.lower()
df["title"]       = df["title"].fillna("").str.lower()
df["company_profile"] = df["company_profile"].fillna("").str.lower()

# combine text columns for richer features
df["text"] = df["title"] + " " + df["company_profile"] + " " + df["description"]

X = df["text"]
y = df["fraudulent"]
print(f"Dataset size: {len(df)} rows | Fake: {y.sum()} | Real: {(y==0).sum()}")

# ── Step 3: train/test split ────────────────────────────────────────────────
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42, stratify=y
)

# ── Step 4: TF-IDF ─────────────────────────────────────────────────────────
print("Fitting TF-IDF...")
tfidf = TfidfVectorizer(max_features=5000, stop_words="english", ngram_range=(1, 2))
X_train_tfidf = tfidf.fit_transform(X_train)
X_test_tfidf  = tfidf.transform(X_test)

# ── Step 5: feature selection ───────────────────────────────────────────────
print("Selecting best features...")
selector = SelectKBest(chi2, k=500)
X_train_sel = selector.fit_transform(X_train_tfidf, y_train)
X_test_sel  = selector.transform(X_test_tfidf)

# ── Step 6: train model ─────────────────────────────────────────────────────
print("Training Logistic Regression...")
model = LogisticRegression(max_iter=1000, class_weight="balanced", C=1.0)
model.fit(X_train_sel, y_train)

# ── Step 7: evaluate ────────────────────────────────────────────────────────
y_pred = model.predict(X_test_sel)
print("\n── Model Evaluation ──")
print(classification_report(y_test, y_pred, target_names=["Real", "Fake"]))

# ── Step 8: save pkl files ──────────────────────────────────────────────────
print("Saving model files...")

with open(os.path.join(MODELS_DIR, "tfidf.pkl"), "wb") as f:
    pickle.dump(tfidf, f)

with open(os.path.join(MODELS_DIR, "selector.pkl"), "wb") as f:
    pickle.dump(selector, f)

with open(os.path.join(MODELS_DIR, "model.pkl"), "wb") as f:
    pickle.dump(model, f)

print("✓ tfidf.pkl saved")
print("✓ selector.pkl saved")
print("✓ model.pkl saved")
print("\nTraining complete! Now run server.py")
