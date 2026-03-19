from fastapi import FastAPI
from pydantic import BaseModel

app = FastAPI()

class Data(BaseModel):
    rainfall: float
    wind: float

@app.post("/predict")
def predict(data: Data):

    if data.rainfall > 50 or data.wind > 70:
        severity = "High"
    elif data.rainfall > 20:
        severity = "Medium"
    else:
        severity = "Low"

    return {"severity": severity}