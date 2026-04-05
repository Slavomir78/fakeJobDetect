from pymongo import MongoClient
from datetime import datetime
import os
import ssl
import certifi
from dotenv import load_dotenv

load_dotenv()

MONGO_URI = os.getenv("MONGO_URI")
DB_NAME   = os.getenv("DB_NAME", "fakejob")

client = None
db     = None

def connect_db():
    global client, db
    try:
        ssl_context = ssl.create_default_context(cafile=certifi.where())
        ssl_context.check_hostname = False
        ssl_context.verify_mode = ssl.CERT_NONE

        client = MongoClient(
            MONGO_URI,
            serverSelectionTimeoutMS=5000,
            tlsCAFile=certifi.where(),
            tls=True,
            tlsAllowInvalidCertificates=True,
            tlsAllowInvalidHostnames=True,
        )
        client.server_info()
        db = client[DB_NAME]
        print("✓ MongoDB connected")
    except Exception as e:
        print(f"✗ MongoDB connection failed: {e}")
        db = None

def save_scan(job_data: dict, result: dict):
    if db is None:
        print("MongoDB not connected — skipping save")
        return None
    try:
        record = {
            "jobTitle":        job_data.get("jobTitle", ""),
            "company":         job_data.get("company", ""),
            "jobDescription":  job_data.get("jobDescription", ""),
            "riskScore":       result.get("riskScore"),
            "verdict":         result.get("verdict"),
            "confidence":      result.get("confidence"),
            "redFlags":        result.get("redFlags", []),
            "positiveSignals": result.get("positiveSignals", []),
            "summary":         result.get("summary", ""),
            "recommendations": result.get("recommendations", []),
            "scannedAt":       datetime.utcnow(),
        }
        inserted = db.scans.insert_one(record)
        print(f"✓ Scan saved: {inserted.inserted_id}")
        return str(inserted.inserted_id)
    except Exception as e:
        print(f"✗ Failed to save scan: {e}")
        return None

def get_all_scans():
    if db is None:
        return []
    try:
        scans = list(db.scans.find({}, {"_id": 0}).sort("scannedAt", -1))
        return scans
    except Exception as e:
        print(f"✗ Failed to fetch scans: {e}")
        return []