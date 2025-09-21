from langchain_core.prompts import PromptTemplate
from langchain_google_vertexai import VertexAI
from services.storage.storage import store_inventory_recommendations

model = VertexAI(
    model_name="gemini-2.5-pro",
    project="rich-jigsaw-469313-m2",  
    location="us-central1" 
)

async def get_recommended_inventory(
    art_forms: list[str],
    region: str,
    upcoming_holidays: list[dict],
    uid: int = 2837608701,
) -> dict:
    """
    Generates inventory recommendations using the Gemini Pro model.
    The recommendations are tailored specifically for the target region, considering
    regional cultural preferences, traditions, and market demands.
    """

    holiday_details = [f"{holiday.get('name', holiday.get('event', 'Unknown'))} ({holiday.get('type', 'Festival')}) - {holiday.get('date', 'Date unknown')}" for holiday in upcoming_holidays]
    
    prompt_template = """
    You are an expert in Indian art and crafts with deep knowledge of regional preferences and cultural traditions. Provide inventory recommendations for a local artisan.

    Here are the details:
    - Artisan's art forms: {art_forms}
    - Target region: {region} (This is where the artist wants to sell their products - consider regional cultural preferences, traditions, and market demands)
    - Upcoming Indian holidays: {upcoming_holidays}

    IMPORTANT: The target region is crucial for recommendations. Different regions in India have unique cultural preferences, traditional art forms, color schemes, and festival celebrations. Tailor your recommendations specifically for the {region} market.

    Based on the above information, recommend specific inventory items that would sell well for each holiday in the {region} region.
    For each recommendation, explain why these items make sense for that particular festival AND why they would appeal to customers in {region}.
    Consider regional preferences such as:
    - Traditional color schemes popular in {region}
    - Local art styles and motifs
    - Regional variations of festival celebrations
    - Cultural symbols and traditions specific to {region}
    - Market preferences and buying patterns in {region}

    The output should be a single, concise JSON object with the following structure:
    {{
        "recommendations": [
            {{
                "holiday": "Holiday Name",
                "date": "January 1, 2025, Wednesday",
                "items": ["item_name_1", "item_name_2", "item_name_3"],
                "reason": "Brief explanation of why these items are perfect for this festival AND why they appeal to {region} customers specifically"
            }},
            {{
                "holiday": "Another Holiday Name",
                "date": "February 14, 2025, Friday", 
                "items": ["item_name_4", "item_name_5", "item_name_6"],
                "reason": "Brief explanation of why these items are perfect for this festival AND why they appeal to {region} customers specifically"
            }}
        ]
    }}
    """

    prompt = PromptTemplate.from_template(prompt_template)
    chain = prompt | model
    

    result = await chain.ainvoke({
        "art_forms": ", ".join(art_forms),
        "region": region,
        "upcoming_holidays": ", ".join(holiday_details)
    })
    
    try:
        import json
        import re
        
        response_text = str(result)
        
        json_match = re.search(r'```(?:json)?\s*(\{.*?\})\s*```', response_text, re.DOTALL)
        if json_match:
            json_str = json_match.group(1)
        else:
            json_match = re.search(r'(\{.*\})', response_text, re.DOTALL)
            if json_match:
                json_str = json_match.group(1)
            else:
                json_str = response_text
        
        parsed_result = json.loads(json_str)
        
        # Store the recommendations in the database using the provided UID
        try:
            storage_result = store_inventory_recommendations(uid, parsed_result, art_forms)
            print(f"Successfully stored inventory recommendations: {storage_result}")
        except Exception as storage_error:
            print(f"Warning: Failed to store inventory recommendations: {storage_error}")
            # Continue execution even if storage fails
        
        # Return both the recommendations and metadata
        return {
            "uid": uid,
            "recommendations": parsed_result,
            "art_forms": art_forms,
            "region": region,
            "holidays": holiday_details
        }
        
    except Exception as e:
        print(f"Error parsing model response: {e}")
        print(f"Raw response: {result}")
            
        error_response = {
            "recommendations": [
                {
                    "holiday": "General", 
                    "date": "Unknown", 
                    "items": ["Could not generate recommendations."], 
                    "reason": "Error occurred while generating recommendations"
                }
            ]
        }
        
        return {
            "uid": uid,
            "recommendations": error_response,
            "art_forms": art_forms,
            "region": region,
            "holidays": holiday_details,
            "error": str(e)
        }