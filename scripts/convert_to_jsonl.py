import json
import pandas as pd

# Load parquet file
df = pd.read_parquet("0000.parquet")

# Rename columns (optional, you can directly use 'description' and 'marketing_email')
df = df.rename(columns={
    "description": "input_text",
    "marketing_email": "output_text"
})

# Keep only required columns
df = df[["input_text", "output_text"]]

# Convert DataFrame to a list of records
data = df.to_dict(orient="records")

# Create a new list to hold the formatted data for Gemini
gemini_formatted_data = []

# Loop through each record and transform it
for record in data:
    gemini_formatted_data.append({
        "contents": [
            {
                "role": "user",
                "parts": [
                    {
                        "text": record["input_text"]
                    }
                ]
            },
            {
                "role": "model",
                "parts": [
                    {
                        "text": record["output_text"]
                    }
                ]
            }
        ]
    })

# Save the new list of records as a JSONL file
with open("output.jsonl", "w", encoding="utf-8") as f:
    for record in gemini_formatted_data:
        f.write(json.dumps(record, ensure_ascii=False) + "\n")

print("Successfully converted data to output_gemini.jsonl!")
