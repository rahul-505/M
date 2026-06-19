import os
import feedparser
import google.generativeai as genai
from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

# Initialize FastAPI app
app = FastAPI(title="MedMind AI Backend")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
#Load environment variables from .env file
load_dotenv(dotenv_path=".env.local")


# --- GEMINI AI SETUP ---
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY") # Paste your key here!
genai.configure(api_key=GEMINI_API_KEY)
model = genai.GenerativeModel('gemini-2.5-flash')

# --- DATA MODELS ---
class ChatRequest(BaseModel):
    message: str

class MedRequest(BaseModel):
    medicine_name: str

@app.get("/")
def read_root():
    return {"status": "MedMind API is running!"}

# --- 1. AI SYMPTOM CHECKER ---
@app.post("/api/chat")
async def ai_symptom_checker(request: ChatRequest):
    prompt = f"""
    You are MedMind AI, an empathetic medical routing assistant.
    The patient reports these symptoms: "{request.message}"
    
    1. Acknowledge the symptoms empathetically.
    2. Recommend the specific medical specialist they should see.
    3. Keep your response under 80 words.
    4. MUST end with: "⚠️ This is not a diagnosis — please see a doctor for proper evaluation."
    """
    try:
        response = model.generate_content(prompt)
        return {"reply": response.text}
    except Exception as e:
        return {"reply": f"AI Engine Offline. Error: {str(e)}"}

# --- 2. AI MEDICINE INFO ---
@app.post("/api/medicine")
async def ai_medicine_info(request: MedRequest):
    prompt = f"""
    You are MedMind AI, a pharmacist assistant.
    The user is asking about the medicine: "{request.medicine_name}"
    
    Provide: 1. What it treats. 2. Typical dosage. 3. Key side effects.
    Keep it under 100 words. End with: "[IMPORTANT] Always follow your doctor's instructions."
    """
    try:
        response = model.generate_content(prompt)
        return {"reply": response.text}
    except Exception as e:
        return {"reply": f"AI Engine Offline. Error: {str(e)}"}

# --- 3. LIVE MEDICAL NEWS ---
@app.get("/api/news")
async def get_medical_news():
    try:
        # Fetch real, live health news from a public RSS feed (e.g., Medical News Today)
        feed_url = 'https://rss.medicalnewstoday.com/featurednews.xml'
        feed = feedparser.parse(feed_url)
        
        news_items = []
        # Grab the top 5 most recent articles
        for entry in feed.entries[:5]:
            news_items.append({
                "title": entry.title,
                "link": entry.link,
                "published": entry.published if hasattr(entry, 'published') else "Recent"
            })
            
        return {"news": news_items}
    except Exception as e:
        return {"news": [{"title": "Failed to load live news", "link": "#", "published": "Error"}]}