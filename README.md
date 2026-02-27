# 3D Word Cloud (TF-IDF + React + FastAPI)

This project is a full-stack NLP application that analyzes an online article and visualizes its most important keywords in an interactive 3D space.

The idea is simple:  
Take real-world text → extract meaningful signals → visualize them in an intuitive way.

Instead of a flat word cloud, this project renders the keywords along a rotating double helix structure using React Three Fiber, creating a more dynamic and immersive experience.

---

## What This Project Does

1. Accepts a URL input from the user
2. Backend fetches and parses the article text
3. Applies TF-IDF to rank the most important words
4. Returns the top weighted keywords
5. Frontend renders them in a 3D double helix layout
6. Words are scaled based on normalized TF-IDF weight

The result is a responsive, interactive visualization where users can:
- Drag to rotate
- Scroll to zoom
- Watch the helix auto-rotate
- Explore keyword prominence visually

---

## Why TF-IDF?

TF-IDF (Term Frequency – Inverse Document Frequency) helps identify words that are important within a document but not overly common across general language.

This allows the visualization to highlight meaningful terms rather than filler words.

---

## Tech Stack

### Backend
- Python
- FastAPI
- Scikit-learn (TF-IDF)
- BeautifulSoup (article parsing)

### Frontend
- React (with Vite)
- @react-three/fiber
- @react-three/drei
- TypeScript

---

## Architecture Overview

Frontend:
- Handles user input
- Sends URL to backend API
- Receives ranked keywords
- Maps them onto a parametric double helix curve

Backend:
- Fetches article content
- Cleans and processes text
- Applies TF-IDF
- Returns top 40 weighted keywords as JSON

The frontend then normalizes the weights and adjusts:
- Font size
- Position
- Strand color

to create a clean visual separation between the two helix strands.

---

## How the Double Helix Layout Works

Words are positioned using cosine and sine functions:

- X = r * cos(t)
- Z = r * sin(t)
- Y increases linearly to create vertical spread

Every alternate word is offset by π radians to form two intertwined strands.

This creates a DNA-like spiral structure that improves readability and visual balance compared to a spherical layout.

---

## How to Run Locally

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd 3D-Word-Cloud-Adarsh
