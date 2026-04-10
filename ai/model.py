import math

# 🔹 Normalize function (scale values between 0 and 1)
def normalize(value, min_val, max_val):
    if max_val - min_val == 0:
        return 0
    return (value - min_val) / (max_val - min_val)


# 🔹 Sigmoid function (ML probability simulation)
def sigmoid(x):
    return 1 / (1 + math.exp(-x))


# 🔹 Main ML-like risk calculation
def calculate_risk(data):

    # Extract values
    rainfall = data.get("rainfall", 0)
    wind = data.get("wind", 0)
    temperature = data.get("temperature", 0)
    population = data.get("population", 0)
    river_level = data.get("river_level", 0)

    # 🔹 Normalize inputs (based on assumed real-world ranges)
    rain_n = normalize(rainfall, 0, 300)
    wind_n = normalize(wind, 0, 150)
    temp_n = normalize(temperature, 0, 50)
    pop_n = normalize(population, 0, 2000)
    river_n = normalize(river_level, 0, 10)

    # 🔹 Feature weights (importance of each factor)
    w_rain = 0.30
    w_wind = 0.25
    w_temp = 0.10
    w_pop = 0.15
    w_river = 0.20

    # 🔹 Weighted sum (like linear regression)
    linear_score = (
        rain_n * w_rain +
        wind_n * w_wind +
        temp_n * w_temp +
        pop_n * w_pop +
        river_n * w_river
    )

    # 🔹 Convert to probability (sigmoid)
    probability = sigmoid(linear_score * 5)  # scaled for better spread

    # 🔹 Convert to percentage score
    risk_score = round(probability * 100, 2)

    # 🔹 Classification
    if risk_score > 75:
        severity = "HIGH 🚨"
    elif risk_score > 45:
        severity = "MEDIUM ⚠"
    else:
        severity = "LOW ✅"

    return {
        "risk_score": risk_score,
        "severity": severity,
        "probability": round(probability, 3)
    }
