from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import joblib
import numpy as np
import os

app = FastAPI(title="PitchRank ML Service")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load models
MODELS_DIR = 'models'
model_val = None
model_burn = None
model_break = None

def load_models():
    global model_val, model_burn, model_break
    try:
        model_val = joblib.load(os.path.join(MODELS_DIR, 'valuation_model.pkl'))
        model_burn = joblib.load(os.path.join(MODELS_DIR, 'burnout_model.pkl'))
        model_break = joblib.load(os.path.join(MODELS_DIR, 'breakeven_model.pkl'))
        return True
    except Exception as e:
        print(f"Error loading models: {e}")
        return False

class StartupData(BaseModel):
    total_funding: float
    team_size: int
    market_size: float
    monthly_burn: float
    monthly_revenue: float
    growth_rate: float

@app.on_event("startup")
async def startup_event():
    if not load_models():
        print("Models not found. Please run train.py first.")

@app.post("/predict")
async def predict(data: StartupData):
    if model_val is None:
        raise HTTPException(status_code=503, detail="Models not loaded")
    
    features = np.array([[
        data.total_funding,
        data.team_size,
        data.market_size,
        data.monthly_burn,
        data.monthly_revenue,
        data.growth_rate
    ]])
    
    val_pred = model_val.predict(features)[0]
    burn_pred = model_burn.predict(features)[0]
    break_pred = model_break.predict(features)[0]
    
    # Generate Suggestions
    suggestions = []
    if burn_pred > 0.7:
        suggestions.append("High burnout risk detected. Consider reducing non-essential expenses or seeking immediate bridge funding.")
    elif burn_pred > 0.4:
        suggestions.append("Moderate burnout risk. Monitor runway closely.")
    
    if data.growth_rate < 0.05 and data.monthly_revenue < data.monthly_burn:
        suggestions.append("Stagnant growth with net loss. Recommend pivoting marketing strategy or optimizing product-market fit.")
        
    if break_pred > 24:
        suggestions.append("Breakeven is more than 2 years away. Focus on increasing average revenue per user (ARPU) or streamlining operations.")
    elif break_pred == 0:
        suggestions.append("Already profitable! Focus on aggressive scaling and market dominance.")
    else:
        suggestions.append(f"On track to breakeven in approximately {int(break_pred)} months. Keep optimizing unit economics.")

    return {
        "valuation": round(val_pred, 2),
        "burnout_estimate": round(burn_pred, 2),
        "breakeven_months": round(break_pred, 1),
        "suggestions": suggestions
    }

@app.get("/health")
async def health():
    return {"status": "ok", "models_loaded": model_val is not None}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
