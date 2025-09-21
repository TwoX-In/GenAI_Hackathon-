import json
import pandas as pd
df =  pd.read_json("tune_eval_data_brand_voice.jsonl", lines=True)

gemini_formatted_data = []

df.to_json("tune_eval_data_brand_voice.jsonl", orient="records", lines=True)

for _, row in df.iterrows():
        gemini_formatted_data.append({
        "contents": [
            {
                "role": "user",
                "parts": [
                    {
                        "text": row["input_text"]
                    }
                ]
            },
            {
                "role": "model",
                "parts": [
                    {
                        "text": row["output_text"]
                    }
                ]
            }
        ]
    })
        
with open("eval_data.jsonl", "w", encoding="utf-8") as f:
    for record in gemini_formatted_data:
        f.write(json.dumps(record, ensure_ascii=False) + "\n")

print("Successfully converted data to output_gemini.jsonl!")
