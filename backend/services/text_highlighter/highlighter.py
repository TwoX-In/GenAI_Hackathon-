from fastapi import FastAPI
from pydantic import BaseModel
from typing import List, Dict, Any
import spacy
from keybert import KeyBERT

# Load spaCy model
nlp = spacy.load("en_core_web_sm")

# Initialize KeyBERT
kw_model = KeyBERT()




async def highlight_text(input: str) -> Dict[str, Any]:
    text = input
    doc = nlp(text)

    highlights = []

    # === Named Entity Recognition (NER) ===
    for ent in doc.ents:
        category = None
        if ent.label_ in ["GPE", "LOC"]:  # Geopolitical entity, location
            category = "location"
        elif ent.label_ in ["DATE", "TIME"]:
            category = "time"
        elif ent.label_ in ["ORG"]:
            category = "organization"
        elif ent.label_ in ["PERSON"]:
            category = "person"

        if category:
            highlights.append(
                {
                    "phrase": ent.text,
                    "category": category,
                    "start": ent.start_char,
                    "end": ent.end_char,
                    "tooltip": f"{ent.label_} entity detected",
                }
            )

    # === Keyword Extraction (KeyBERT) ===
    keywords = kw_model.extract_keywords(
        text, keyphrase_ngram_range=(1, 3), stop_words="english", top_n=5
    )
    key_terms = [kw[0] for kw in keywords]

    return {"highlights": highlights, "key_terms": key_terms}
