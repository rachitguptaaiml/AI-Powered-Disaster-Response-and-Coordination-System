from fastapi import FastAPI
import random

app = FastAPI()

@app.get("/predict")
def predict():
    severity = random.choice(["Low","Medium","High"])
    return {"severity":severity}