import pandas as pd 
import sqlite3 
import pickle 
import numpy as np 
import os
import kagglehub
from sklearn.feature_extraction.text import TfidfVectorizer, CountVectorizer 
from sklearn.decomposition import TruncatedSVD
from sklearn.feature_selection import SelectKBest, chi2 
from sklearn.linear_model import LogisticRegression 
import spacy 
from gensim.models import Word2Vec 


os.environ["KAGGLEHUB_CACHE"] = "D:\infosys\kagglehub"

print("Downloading dataset from Kaggle...")


path = kagglehub.dataset_download("shivamb/real-or-fake-fake-jobposting-prediction")
csv_path = os.path.join(path, "fake_job_postings.csv")

# Step 1: LOAD FROM KAGGLE ---

print("Downloading dataset from Kaggle...")
path = kagglehub.dataset_download("shivamb/real-or-fake-fake-jobposting-prediction")

#  Step 1: Load dataset 

df = pd.read_csv(csv_path)

df["description"] = df["description"].fillna("").str.lower() 
y = df["fraudulent"] 
print("Data loaded successfully!")


# # Locate the CSV file inside the downloaded folder
# csv_path = os.path.join(path, "fake_job_postings.csv")
# df = pd.read_csv(csv_path)



# Step 2: TF-IDF Representation 
tfidf = TfidfVectorizer(max_features=5000, stop_words="english") 
X_tfidf = tfidf.fit_transform(df["description"]) 
print("TF-IDF shape:", X_tfidf.shape) 


# Step 3: N-grams 
ngram_vectorizer = CountVectorizer(ngram_range=(2,3), max_features=100) 
X_ngram = ngram_vectorizer.fit_transform(df["description"]) 
print("N-gram shape:", X_ngram.shape) 


# Step 4: Word Embeddings (Word2Vec) 
tokens = df["description"].apply(lambda x: x.split()).tolist() 
w2v_model = Word2Vec(tokens, vector_size=50, window=5, min_count=2) 
print("Word2Vec trained") 


# Step 5: Sentence Embeddings (FIXED ORDER) 
# Load the model BEFORE calling .pipe
nlp = spacy.load("en_core_web_sm") 
print("Generating sentence embeddings... (this will take a few minutes)")

descriptions = df["description"].tolist()
vectors = [doc.vector for doc in nlp.pipe(descriptions, batch_size=100, disable=["parser", "ner"])]

df["sentence_vector"] = vectors
print("Sentence embeddings generated!")



# Step 6: Dimensionality Reduction (SVD) , Have to change for low RAM device
svd = TruncatedSVD(n_components=100) 
X_pca = svd.fit_transform(X_tfidf) 
print("SVD (PCA) reduced shape:", X_pca.shape)


# Step 7: Feature Selection (Chi-Square) 
selector = SelectKBest(chi2, k=100) 
X_selected = selector.fit_transform(X_tfidf, y) 
print("Selected features shape:", X_selected.shape) 


# Step 8: Sparse Matrix Handling 
print("Sparse matrix non-zero entries:", X_tfidf.nnz) 
# Step 9: Train simple model 
lr = LogisticRegression(max_iter=1000) 
lr.fit(X_selected, y) 
print("Model trained") 


# Step 10: Database Integration (SQLite) 
conn = sqlite3.connect("jobs.db") 
cursor = conn.cursor() 
cursor.execute(""" 
CREATE TABLE IF NOT EXISTS jobs ( 
id INTEGER PRIMARY KEY, 
title TEXT, 
description TEXT, 
fraudulent INTEGER 
) 
""") 
cursor.execute(""" 
CREATE TABLE IF NOT EXISTS predictions ( 
id INTEGER PRIMARY KEY, 
    title TEXT, 
    description TEXT, 
    predicted_label INTEGER 
) 
""") 
conn.commit() 
print("Tables created") 


 
# Step 11: Insert sample postings 
for i, row in df.head(5).iterrows(): 
    cursor.execute("INSERT INTO jobs (title, description, fraudulent) VALUES (?, ?, ?)",  
                   (row["title"], row["description"], row["fraudulent"])) 
conn.commit() 
print("Sample jobs inserted") 


 
# Step 12: Save predictions into database 
sample_texts = ["urgent hiring apply now", "genuine recruitment drive"] 
sample_vecs = tfidf.transform(sample_texts) 
sample_selected = selector.transform(sample_vecs) 
preds = lr.predict(sample_selected) 
 
for i, text in enumerate(sample_texts): 
    cursor.execute('INSERT INTO predictions (title, description, predicted_label) VALUES (?, ?, ?)',  (f"Sample {i+1}", text, int(preds[i]))) 
conn.commit() 
print("Predictions saved") 


# Step 13: Query fraudulent predictions 
cursor.execute("SELECT * FROM predictions WHERE predicted_label = 1") 
print("Fraudulent predictions:", cursor.fetchall()) 


# Step 14: Close connection 
conn.close() 
print("Database connection closed")