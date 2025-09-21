from uuid import uuid4
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Optional
from services.inventory.inventory_service import get_recommended_inventory
from services.metadata.holidays import get_next_indian_holidays
from services.inventory.design_ideas_service import generate_design_image
from services.storage.storage import get_inventory, get_product_origin, get_product_style



router = APIRouter(
    prefix="/inventory"
)

# class InventoryRequest(BaseModel):
#     art_forms: list[str]
#     region: str
#     uid: int

@router.post("/recommendation")
async def recommend_inventory(uid: int = uuid4().int & ((1 << 32) - 1)):
    """
    Recommends inventory for local Indian artisans based on their art forms,
    target region (where they want to sell), and upcoming holidays. 
    Returns holiday-specific recommendations tailored for the target region's
    cultural preferences and market demands.
    
    The recommendations are automatically stored in the database.
    """
    try:
        holidays = get_next_indian_holidays(10)
        print(f"Fetched {len(holidays)} upcoming holidays")
        
        # Get product style, handle case where no style is found
        product_style_data = get_product_style(uid)
        if not product_style_data:
            raise HTTPException(
                status_code=404, 
                detail=f"No product style found for uid {uid}. Please ensure the product exists in the database."
            )
        
        art_forms = product_style_data["style"]
        region = "Uttar Pradesh"
        

        recommendation_result = await get_recommended_inventory(
            art_forms,
            region,
            holidays,
            uid
        )
        
        return {
            "success": True,
            "uid": recommendation_result["uid"],
            "recommendations": recommendation_result["recommendations"],
            "metadata": {
                "art_forms": recommendation_result["art_forms"],
                "region": recommendation_result["region"],
                "holidays": recommendation_result["holidays"]
            }
        }
        
    except Exception as e:
        print(f"Error in recommend_inventory: {e}")
        raise HTTPException(
            status_code=500,
            detail=f"Failed to generate inventory recommendations: {str(e)}"
        )


class DesignIdeaRequest(BaseModel):
    art_forms: List[str]
    region: str
    holiday: str
    items: List[str]
    reason: str
    style_hint: str | None = None


@router.post("/design-ideas")
async def design_ideas(payload: DesignIdeaRequest):
    """
    Generates a design concept image for a given recommendation using Google's Imagen model.
    """
    result = generate_design_image(
        art_forms=payload.art_forms,
        region=payload.region,
        holiday=payload.holiday,
        items=payload.items,
        reason=payload.reason,
        style_hint=payload.style_hint,
    )
    if not result.get("image_data_url"):
        # Surface a 502 so frontend can show a useful message
        raise HTTPException(status_code=502, detail={
            "message": "Image generation did not return an image.",
            "diagnostics": {k: result.get(k) for k in ("model", "details")}
        })
    return result


@router.get("/stored/{uid}")
async def get_stored_inventory(uid: int):
    """
    Retrieves stored inventory recommendations for a given UID.
    Returns the recommendations that were previously generated and stored in the database.
    """
    try:
        inventory_data = get_inventory(uid)
        
        if not inventory_data:
            raise HTTPException(
                status_code=404,
                detail=f"No inventory recommendations found for UID {uid}"
            )
        
        # Reconstruct the recommendations format from the stored data
        holidays = inventory_data.get('holidays', [])
        items = inventory_data.get('items', [])
        reasons = inventory_data.get('reasons', [])
        art_forms = inventory_data.get('art_forms', '')
        
        # Create recommendations in the expected format
        recommendations_list = []
        for i, holiday in enumerate(holidays):
            # Get items and reason for this holiday (simplified - all items for all holidays)
            recommendations_list.append({
                "holiday": holiday,
                "items": items,  # For now, all items are associated with all holidays
                "reason": reasons[i] if i < len(reasons) else "",
                "art_forms": art_forms
            })
        
        return {
            "success": True,
            "uid": uid,
            "recommendations": {
                "recommendations": recommendations_list
            },
            "total_items": len(items)
        }
        
    except HTTPException:
        raise
    except Exception as e:
        print(f"Error retrieving stored inventory: {e}")
        raise HTTPException(
            status_code=500,
            detail=f"Failed to retrieve inventory recommendations: {str(e)}"
        )