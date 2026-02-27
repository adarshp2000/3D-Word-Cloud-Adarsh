from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import requests
from bs4 import BeautifulSoup
from sklearn.feature_extraction.text import TfidfVectorizer

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class URLRequest(BaseModel):
    url: str

@app.post("/analyze")
def analyze_article(request: URLRequest):
    try:
        response = requests.get(request.url)
        soup = BeautifulSoup(response.text, "html.parser")

        paragraphs = soup.find_all("p")
        text = " ".join([p.get_text() for p in paragraphs])

        vectorizer = TfidfVectorizer(stop_words="english", max_features=30)
        X = vectorizer.fit_transform([text])
        scores = X.toarray()[0]
        words = vectorizer.get_feature_names_out()

        results = [
            {"word": word, "weight": float(score)}
            for word, score in zip(words, scores)
        ]

        return {"words": results}

    except Exception as e:
        return {"error": str(e)}