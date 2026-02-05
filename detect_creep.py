import pandas as pd
from sklearn.ensemble import IsolationForest

# 1. Load data
df = pd.read_csv('permissions.csv')
features = df.drop('user_id', axis=1)

# 2. Train AI
model = IsolationForest(contamination=0.1, random_state=42) 
model.fit(features)

# 3. Calculate Risk Score (0-100)
# We adjust the math so anomalies jump closer to 100
raw_scores = model.decision_function(features)
df['risk_score'] = [round((0.5 - s) * 100, 1) for s in raw_scores]

# 4. EXPLAINABILITY: Find the "Suspect" permissions
# We look for columns where the user has a '1' but the average is low
def get_reason(row):
    reasons = []
    for col in features.columns:
        if row[col] == 1 and features[col].mean() < 0.3:
            reasons.append(col)
    return ", ".join(reasons) if reasons else "Normal Usage"

df['reason'] = df.apply(get_reason, axis=1)
df['status'] = df['risk_score'].apply(lambda x: '⚠️ DANGER' if x > 65 else '✅ SAFE')

print("\n--- TEAM OBSIDIAN: SMART PRIVILEGE AUDIT ---")
print(df[['user_id', 'risk_score', 'status', 'reason']])
# Save the results to a JSON file for the Frontend/Backend to use
df.to_json('audit_results.json', orient='records', indent=4)
print("\n✅ Results saved to 'audit_results.json' for the team!")