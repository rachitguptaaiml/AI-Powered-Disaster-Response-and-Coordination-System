import random

def predict_disaster(rainfall, wind):

    if rainfall > 50 or wind > 70:
        return "High"

    if rainfall > 20:
        return "Medium"

    return "Low"