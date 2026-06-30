# P Study AI
# app.py 

import os
import json
from datetime import datetime

import fitz
from dotenv import load_dotenv
from groq import Groq

from fastapi import FastAPI, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse, JSONResponse

#Load Environment Variables

load_dotenv()

# Groq Client

client = Groq(
    api_key=os.getenv("GROQ_API_KEY")
)

# FastAPI App

app = FastAPI(
    title="P Study AI",
    version="1.0"
)

#CORS Configuration

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

# Project Folders

UPLOAD_FOLDER = "uploads"
HISTORY_FOLDER = "history"

current_file_name = "No File"

os.makedirs(UPLOAD_FOLDER, exist_ok=True)
os.makedirs(HISTORY_FOLDER, exist_ok=True)

HISTORY_FILE = os.path.join(HISTORY_FOLDER, "history.json")

if not os.path.exists(HISTORY_FILE):
    with open(HISTORY_FILE, "w") as file:
        json.dump([], file)

# Serve Frontend Files

@app.get("/")
def home():
    return FileResponse("index.html")


@app.get("/style.css")
def style():
    return FileResponse(
        "style.css",
        media_type="text/css"
    )


@app.get("/script.js")
def script():
    return FileResponse(
        "script.js",
        media_type="application/javascript"
    )

# Read PDF

def read_pdf(file_path):
    """Extract text from an uploaded PDF."""

    document = fitz.open(file_path)
    text = ""

    for page in document:
        text += page.get_text()

    document.close()

    return text

# Upload PDF

@app.post("/upload")
async def upload_pdf(file: UploadFile = File(...)):

    global current_file_name

    save_path = os.path.join(
        UPLOAD_FOLDER,
        file.filename
    )

    with open(save_path, "wb") as uploaded_file:
        uploaded_file.write(await file.read())

    current_file_name = file.filename

    pdf_text = read_pdf(save_path)

    return {
        "filename": file.filename,
        "text": pdf_text
    }

# Save Chat History

def save_history(title, prompt, response, file_name):

    with open(HISTORY_FILE, "r") as file:
        data = json.load(file)

    data.insert(
        0,
        {
            "time": datetime.now().strftime("%d-%m-%Y %H:%M"),
            "file": file_name,
            "title": title,
            "prompt": prompt,
            "response": response
        }
    )

    with open(HISTORY_FILE, "w") as file:
        json.dump(data, file, indent=4)

# Chat with AI

@app.post("/chat")
async def chat(message: str = Form(...)):

    prompt = f"""
You are an AI Study Assistant.

Answer clearly in simple language.

Student Question:

{message}
"""

    completion = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[
            {
                "role": "user",
                "content": prompt
            }
        ],
        temperature=0.3
    )

    reply = completion.choices[0].message.content

    save_history(
        "Ask AI",
        message,
        reply,
        current_file_name
    )

    return {
        "reply": reply
    }

# Generate Summary

@app.post("/summary")
async def summary(text: str = Form(...)):

    prompt = f"""
Summarize these engineering notes.

Requirements:
- Easy English
- Bullet Points
- Important Formulas
- Important Definitions

Notes:

{text}
"""

    completion = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[
            {
                "role": "user",
                "content": prompt
            }
        ],
        temperature=0.2
    )

    summary_text = completion.choices[0].message.content

    save_history(
        "Summary",
        text,
        summary_text,
        current_file_name
    )

    return {
        "summary": summary_text
    }

# Generate MCQs

@app.post("/mcq")
async def mcq(text: str = Form(...)):

    prompt = f"""
Create 10 Multiple Choice Questions.

Give the correct answer after every question.

Notes:

{text}
"""

    completion = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[
            {
                "role": "user",
                "content": prompt
            }
        ],
        temperature=0.4
    )

    mcq_text = completion.choices[0].message.content

    save_history(
        "MCQs",
        text,
        mcq_text,
        current_file_name
    )

    return {
        "mcqs": mcq_text
    }

# Explain Topic

@app.post("/explain")
async def explain(question: str = Form(...)):

    prompt = f"""
Explain this topic.

Explain it like I am a B.Tech student.

Use simple English.

Topic:

{question}
"""

    completion = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[
            {
                "role": "user",
                "content": prompt
            }
        ],
        temperature=0.3
    )

    answer = completion.choices[0].message.content

    save_history(
        "Explain",
        question,
        answer,
        current_file_name
    )

    return {
        "answer": answer
    }

# Viva Questions

@app.post("/viva")
async def viva(text: str = Form(...)):

    prompt = f"""
Generate 10 viva questions with short answers.

Notes:

{text}
"""

    completion = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[
            {
                "role": "user",
                "content": prompt
            }
        ],
        temperature=0.4
    )

    viva = completion.choices[0].message.content

    save_history(
        "Viva",
        text,
        viva,
        current_file_name
    )

    return {
        "viva": viva
    }

# Flashcards

@app.post("/flashcards")
async def flashcards(text: str = Form(...)):

    prompt = f"""
Create revision flashcards.

Format:

Question:
Answer:

Notes:

{text}
"""

    completion = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[
            {
                "role": "user",
                "content": prompt
            }
        ],
        temperature=0.3
    )

    flashcards = completion.choices[0].message.content

    save_history(
        "Flashcards",
        text,
        flashcards,
        current_file_name
    )

    return {
        "flashcards": flashcards
    }

# Study Planner

@app.post("/planner")
async def planner(topic: str = Form(...)):

    prompt = f"""
Create a 7-day study plan.

Subject:

{topic}

Include:
- Daily Topics
- Revision
- Practice Questions
"""

    completion = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[
            {
                "role": "user",
                "content": prompt
            }
        ],
        temperature=0.3
    )

    plan = completion.choices[0].message.content

    save_history(
        "Study Planner",
        topic,
        plan,
        current_file_name
    )

    return {
        "plan": plan
    }

#Get History

@app.get("/history")
def history():

    with open(HISTORY_FILE, "r") as file:
        return json.load(file)

#Clear History

@app.post("/clear-history")
def clear_history():

    with open(HISTORY_FILE, "w") as file:
        json.dump([], file)

    return {
        "message": "History Cleared"
    }

#Health Check

@app.get("/health")
def health():

    return {
        "status": "running",
        "app": "P Study AI"
    }

#Global Error Handler

@app.exception_handler(Exception)
async def global_exception_handler(request, exc):

    return JSONResponse(
        status_code=500,
        content={
            "error": "Something went wrong.",
            "details": str(exc)
        }
    )

#Run Server

if __name__ == "__main__":

    import uvicorn

    uvicorn.run(
        "app:app",
        host="127.0.0.1",
        port=8000,
        reload=True
    )