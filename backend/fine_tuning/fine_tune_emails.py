import time
import vertexai
from vertexai.tuning import sft

# -------------------------------
# CONFIG
# -------------------------------
PROJECT_ID = "artisan-image-gen"
REGION = "us-central1"
BUCKET_NAME = "artisans-text-gen"

BUCKET_URI = f"gs://{BUCKET_NAME}"
training_data_filename = "text/eval_data.jsonl"
evaluation_data_filename = "text/output.jsonl"

TRAINING_DATA_URI = f"{BUCKET_URI}/{training_data_filename}"
EVALUATION_DATA_URI = f"{BUCKET_URI}/{evaluation_data_filename}"

BASE_MODEL = "publishers/google/models/gemini-2.5-flash"  # or gemini-1.5-pro
DISPLAY_NAME = "brand-email-finetune"

OUTPUT_URI = f"{BUCKET_URI}/fine-tuning/output"
# -------------------------------
# INIT VERTEX
# -------------------------------
vertexai.init(project=PROJECT_ID, location=REGION)

# -------------------------------
# CREATE AND RUN JOB
# -------------------------------
sft_tuning_job=sft.train(
    source_model=BASE_MODEL,
    train_dataset=TRAINING_DATA_URI,
    validation_dataset=EVALUATION_DATA_URI,
    epochs=3,
    # learning_rate_multiplier=3e-5,
    tuned_model_display_name=DISPLAY_NAME,
    # labels={"output_uri": OUTPUT_URI},
)
while not sft_tuning_job.has_ended:
    time.sleep(60)
    sft_tuning_job.refresh()

print(sft_tuning_job.tuned_model_name)
print(sft_tuning_job.tuned_model_endpoint_name)
print(sft_tuning_job.experiment)
print("✅ Fine-tuning started. Check Vertex AI console for job progress.")