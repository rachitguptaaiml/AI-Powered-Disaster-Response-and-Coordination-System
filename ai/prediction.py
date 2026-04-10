from fastapi import FastAPI
from pydantic import BaseModel
import random

app = FastAPI()

class Input(BaseModel):
    rainfall: float
    wind: float
    temperature: float
    population: float
    river_level: float

@app.post("/predict")
def predict(data: Input):

    score = 0

    if data.rainfall > 200:
        score += 30
    elif data.rainfall > 100:
        score += 20
    else:
        score += 10

    if data.wind > 80:
        score += 25
    elif data.wind > 40:
        score += 15
    else:
        score += 5

    if data.temperature > 40:
        score += 20
    elif data.temperature > 30:
        score += 10

    if data.population > 1000:
        score += 15
    elif data.population > 500:
        score += 10

    if data.river_level > 8:
        score += 25
    elif data.river_level > 5:
        score += 15

    score += random.randint(0,10)

    if score > 80:
        severity="HIGH 🚨"
    elif score > 50:
        severity="MEDIUM ⚠"
    else:
        severity="LOW ✅"

    return {
        "severity": severity,
        "risk_score": score
    }
