# fake_Job_Detection
To push the source codes.

# Fake Job Detection System 🚨

An AI-powered web application that detects fraudulent job postings using machine learning.

## 🔍 Overview

This project analyzes job descriptions and identifies potential fake or scam job listings.
It combines a **FastAPI backend** with a **React frontend** to deliver real-time predictions.

---

## ⚙️ Tech Stack

### Backend

* FastAPI
* Python
* Scikit-learn
* NLP (TF-IDF, model inference)

### Frontend

* React (Vite)
* Tailwind CSS

---

## 📁 Project Structure

```
Fake_Job/
├── backend/
│   ├── server.py
│   ├── train.py
│   ├── database.py
│   └── models/
│
├── frontend/
│   ├── src/
│   ├── public/
│   └── package.json
│
├── .gitignore
├── README.md
```

---

## 🚀 Features

* Detects fake job postings using ML model
* User-friendly UI for input and results
* Risk analysis and red flag indicators
* Backend API for predictions

---

## 🧠 How It Works

1. User inputs job details
2. Data is processed using NLP techniques
3. Pre-trained model predicts authenticity
4. Results are displayed with risk insights

---

## ⚡ Setup Instructions

### 1️⃣ Clone the repository

```
git clone https://github.com/Slavomir78/fake_Job_Detection.git
cd fake_Job_Detection
```

---

### 2️⃣ Backend Setup

```
cd backend
python -m venv .venv
.\.venv\Scripts\Activate
pip install -r requirements.txt
uvicorn server:app --reload
```

---

### 3️⃣ Frontend Setup

```
cd frontend
npm install
npm run dev
```

---

## 🔐 Environment Variables

Create a `.env` file in backend and frontend if needed.

Example:

```
API_KEY=your_api_key_here
```

---

## 📌 Future Improvements

* Improve model accuracy
* Add user authentication
* Deploy using Docker
* Real-time job scraping

---

## 📄 License

This project is licensed under the MIT License.

---

## 👨‍💻 Author

Md Hamid Hussain

---
