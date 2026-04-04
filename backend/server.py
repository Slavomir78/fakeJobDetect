import pickle
import os
import re
import numpy as np
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from database import connect_db, save_scan

# ── load models ─────────────────────────────────────────────────────────────
MODELS_DIR = os.path.join(os.path.dirname(__file__), "models")

def load_models():
    try:
        with open(os.path.join(MODELS_DIR, "tfidf.pkl"), "rb") as f:
            tfidf = pickle.load(f)
        with open(os.path.join(MODELS_DIR, "selector.pkl"), "rb") as f:
            selector = pickle.load(f)
        with open(os.path.join(MODELS_DIR, "model.pkl"), "rb") as f:
            model = pickle.load(f)
        print("✓ Models loaded")
        return tfidf, selector, model
    except FileNotFoundError:
        print("✗ Model files not found — run train.py first")
        return None, None, None

tfidf, selector, model = load_models()

# ── FastAPI setup ────────────────────────────────────────────────────────────
app = FastAPI(title="JobShield API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
async def startup():
    connect_db()

# ── request schema ───────────────────────────────────────────────────────────
class AnalysisRequest(BaseModel):
    jobDescription: str
    jobTitle:       str = ""
    company:        str = ""

# ── red flag keyword rules ───────────────────────────────────────────────────
RED_FLAG_RULES = [
    {
        "patterns": [r"no experience", r"no experience needed", r"anyone can apply"],
        "flag": "No Experience Required",
        "severity": "medium",
        "explanation": "Legitimate jobs usually require some qualifications."
    },
    {
        "patterns": [r"work from home", r"remote.*earn", r"earn from home"],
        "flag": "Vague Remote Work Promise",
        "severity": "low",
        "explanation": "Generic work-from-home claims without company details are common in scams."
    },
    {
        "patterns": [r"urgent.*hiring", r"immediate.*start", r"apply.*immediately", r"limited slots"],
        "flag": "Urgency Language",
        "severity": "medium",
        "explanation": "Pressure tactics like 'urgent hiring' are common in fake postings."
    },
    {
        "patterns": [r"send.*money", r"deposit.*check", r"wire transfer", r"money order", r"western union"],
        "flag": "Financial Request",
        "severity": "high",
        "explanation": "Legitimate employers never ask candidates to send or transfer money."
    },
    {
        "patterns": [r"guaranteed.*income", r"guaranteed.*salary", r"earn \$\d+.*day", r"earn \$\d+.*week"],
        "flag": "Guaranteed Income Claims",
        "severity": "high",
        "explanation": "No legitimate job guarantees fixed daily/weekly income upfront."
    },
    {
        "patterns": [r"ssn", r"social security", r"bank account.*number", r"credit card"],
        "flag": "Sensitive Info Request",
        "severity": "high",
        "explanation": "Asking for SSN or bank details before hiring is a major red flag."
    },
    {
        "patterns": [r"secret shopper", r"mystery shopper"],
        "flag": "Mystery Shopper Scam",
        "severity": "high",
        "explanation": "Mystery shopper jobs are almost always scams."
    },
    {
        "patterns": [r"\$\d{3,}.*hour", r"\$\d{4,}.*week"],
        "flag": "Unrealistic Salary",
        "severity": "high",
        "explanation": "Salary figures that are far above market rate indicate a scam."
    },
    {
        "patterns": [r"no interview", r"hired immediately", r"no background check"],
        "flag": "No Screening Process",
        "severity": "medium",
        "explanation": "Skipping interviews or background checks is unusual for legitimate employers."
    },
    {
        "patterns": [r"gmail\.com", r"yahoo\.com", r"hotmail\.com"],
        "flag": "Personal Email Domain",
        "severity": "medium",
        "explanation": "Legitimate companies use official business email domains."
    },
]

POSITIVE_RULES = [
    (r"background check required",        "Background check mentioned"),
    (r"equal opportunity employer",        "Equal opportunity employer"),
    (r"health insurance|dental|benefits",  "Benefits package mentioned"),
    (r"interview process|multiple rounds",  "Structured interview process"),
    (r"linkedin|glassdoor",                "References professional platforms"),
    (r"\.(com|org|net)\/careers",          "Official careers page linked"),
    (r"salary range|compensation range",   "Transparent salary range"),
]

# ── helpers ───────────────────────────────────────────────────────────────────
def detect_red_flags(text: str) -> list:
    flags = []
    text_lower = text.lower()
    for rule in RED_FLAG_RULES:
        for pattern in rule["patterns"]:
            if re.search(pattern, text_lower):
                flags.append({
                    "flag":        rule["flag"],
                    "severity":    rule["severity"],
                    "explanation": rule["explanation"],
                })
                break
    return flags

def detect_positive_signals(text: str) -> list:
    signals = []
    text_lower = text.lower()
    for pattern, label in POSITIVE_RULES:
        if re.search(pattern, text_lower):
            signals.append(label)
    return signals

def get_verdict(prob: float) -> str:
    if prob >= 0.65:
        return "LIKELY_FAKE"
    elif prob >= 0.35:
        return "SUSPICIOUS"
    return "LIKELY_LEGITIMATE"

def build_summary(verdict: str, score: int, job_title: str, company: str, red_flags: list) -> str:
    title_str   = f'"{job_title}"' if job_title else "this position"
    company_str = f" at {company}"  if company  else ""
    flag_count  = len(red_flags)
    high_flags  = [f for f in red_flags if f["severity"] == "high"]

    if verdict == "LIKELY_FAKE":
        base = f"Our model flagged {title_str}{company_str} with a {score}% fraud risk."
        if high_flags:
            base += f" {len(high_flags)} high-severity signal(s) were detected including {high_flags[0]['flag']}."
        base += " We strongly advise against applying or sharing personal information."
    elif verdict == "SUSPICIOUS":
        base = f"{title_str}{company_str} scored {score}% risk — showing some suspicious patterns."
        if flag_count:
            base += f" {flag_count} concern(s) were found. Verify the company independently before proceeding."
        else:
            base += " Exercise caution and research the employer before applying."
    else:
        base = f"{title_str}{company_str} appears legitimate with only {score}% fraud risk."
        base += " No major fraud signals detected. It is generally safe to apply through official channels."
    return base

def build_recommendations(verdict: str, red_flags: list) -> list:
    recs = []
    if verdict == "LIKELY_FAKE":
        recs = [
            "Do not apply or share any personal information.",
            "Report this posting to the job board platform.",
            "Never send money or gift cards to a potential employer.",
            "Verify the company exists via official government or business registries.",
        ]
    elif verdict == "SUSPICIOUS":
        recs = [
            "Research the company on LinkedIn and Glassdoor before applying.",
            "Confirm the recruiter's identity via the company's official website.",
            "Avoid sharing sensitive documents until after a verified interview.",
            "Trust your instincts — if something feels off, it probably is.",
        ]
    else:
        recs = [
            "Apply through the company's official careers page if possible.",
            "Keep your resume and cover letter professional.",
            "Prepare for a standard interview process.",
        ]
    high_flags = [f for f in red_flags if f["severity"] == "high"]
    if any(f["flag"] == "Financial Request" for f in high_flags):
        recs.insert(0, "⚠ Never transfer money or deposit cheques for an employer.")
    if any(f["flag"] == "Sensitive Info Request" for f in high_flags):
        recs.insert(0, "⚠ Do not provide your SSN or bank details at this stage.")
    return recs

# ── main route ────────────────────────────────────────────────────────────────
@app.post("/analyze")
async def analyze(req: AnalysisRequest):
    if tfidf is None or selector is None or model is None:
        raise HTTPException(status_code=503, detail="Model not loaded. Run train.py first.")

    if len(req.jobDescription.strip()) < 20:
        raise HTTPException(status_code=400, detail="Job description too short.")

    # combine text same way as training
    combined = f"{req.jobTitle} {req.jobDescription}".lower().strip()

    # ML prediction
    vec      = tfidf.transform([combined])
    selected = selector.transform(vec)
    prob     = float(model.predict_proba(selected)[0][1])  # probability of fake

    risk_score  = int(round(prob * 100))
    verdict     = get_verdict(prob)
    confidence  = int(round(max(prob, 1 - prob) * 100))

    # rule-based analysis
    full_text       = f"{req.jobTitle} {req.company} {req.jobDescription}"
    red_flags       = detect_red_flags(full_text)
    positive_signals = detect_positive_signals(full_text)
    summary         = build_summary(verdict, risk_score, req.jobTitle, req.company, red_flags)
    recommendations = build_recommendations(verdict, red_flags)

    result = {
        "riskScore":       risk_score,
        "verdict":         verdict,
        "confidence":      confidence,
        "redFlags":        red_flags,
        "positiveSignals": positive_signals,
        "summary":         summary,
        "recommendations": recommendations,
    }

    # save to MongoDB
    save_scan(
        {"jobTitle": req.jobTitle, "company": req.company, "jobDescription": req.jobDescription},
        result
    )

    return result

@app.get("/health")
async def health():
    return {"status": "ok", "model_loaded": tfidf is not None}
