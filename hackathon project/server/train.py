import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestRegressor
from sklearn.model_selection import train_test_split
import joblib
import os

def generate_synthetic_data(n_samples=2000):
    np.random.seed(42)
    
    # Features
    total_funding = np.random.uniform(50000, 10000000, n_samples)
    team_size = np.random.randint(1, 100, n_samples)
    market_size = np.random.uniform(1000000, 1000000000, n_samples)
    monthly_burn = np.random.uniform(5000, 500000, n_samples)
    monthly_revenue = np.random.uniform(0, 1000000, n_samples)
    growth_rate = np.random.uniform(-0.1, 1.0, n_samples)
    
    # Targets (with some noise and logic)
    # Valuation: strongly tied to revenue multiple and market size
    valuation = (monthly_revenue * 12 * np.random.uniform(5, 15)) + (market_size * 0.05) + (total_funding * 1.5)
    valuation = valuation * (1 + growth_rate) + np.random.normal(0, 100000, n_samples)
    valuation = np.maximum(valuation, 100000) # Minimum valuation
    
    # Burnout Risk: Ratio of burn to (funding + revenue)
    burnout_risk = monthly_burn / (total_funding / 12 + monthly_revenue + 1)
    burnout_risk = np.clip(burnout_risk, 0, 1)
    
    # Breakeven Months: (Burn - Revenue) / growth logic
    # If revenue > burn, breakeven is 0
    breakeven_months = np.where(monthly_revenue >= monthly_burn, 0, 
                               (monthly_burn - monthly_revenue) / (monthly_revenue * (growth_rate + 0.1) + 100))
    breakeven_months = np.clip(breakeven_months, 0, 60) # Cap at 5 years
    
    df = pd.DataFrame({
        'total_funding': total_funding,
        'team_size': team_size,
        'market_size': market_size,
        'monthly_burn': monthly_burn,
        'monthly_revenue': monthly_revenue,
        'growth_rate': growth_rate,
        'valuation': valuation,
        'burnout_risk': burnout_risk,
        'breakeven_months': breakeven_months
    })
    
    return df

def train():
    print("Generating data...")
    df = generate_synthetic_data()
    
    X = df[['total_funding', 'team_size', 'market_size', 'monthly_burn', 'monthly_revenue', 'growth_rate']]
    y_val = df['valuation']
    y_burn = df['burnout_risk']
    y_break = df['breakeven_months']
    
    print("Training valuation model...")
    model_val = RandomForestRegressor(n_estimators=100, random_state=42)
    model_val.fit(X, y_val)
    
    print("Training burnout model...")
    model_burn = RandomForestRegressor(n_estimators=100, random_state=42)
    model_burn.fit(X, y_burn)
    
    print("Training breakeven model...")
    model_break = RandomForestRegressor(n_estimators=100, random_state=42)
    model_break.fit(X, y_break)
    
    # Save models
    if not os.path.exists('models'):
        os.makedirs('models')
        
    joblib.dump(model_val, 'models/valuation_model.pkl')
    joblib.dump(model_burn, 'models/burnout_model.pkl')
    joblib.dump(model_break, 'models/breakeven_model.pkl')
    
    print("Models saved successfully in 'models/' directory.")

if __name__ == "__main__":
    train()
