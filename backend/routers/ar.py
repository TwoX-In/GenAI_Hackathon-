from fastapi import APIRouter, HTTPException
from uuid import uuid4
from services.ar.ar_service import ar_service
from typing import Dict, Any

router = APIRouter(tags=["ar"], prefix="/ar")


@router.post("/experience/{uid}")
async def create_3d_experience_endpoint(uid: int):
    """
    Create a 3D experience from output images for a given UID.
    
    Args:
        uid (int): Unique identifier for the product
        
    Returns:
        Dict containing 3D experience data
    """
    try:
        result = ar_service.create_3d_experience(uid)
        
        if result["status"] == "error":
            raise HTTPException(status_code=404, detail=result["message"])
        
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to create 3D experience: {str(e)}")


@router.get("/experience/{uid}")
async def get_3d_experience_endpoint(uid: int):
    """
    Get existing 3D experience for a UID.
    
    Args:
        uid (int): Unique identifier for the product
        
    Returns:
        Dict containing 3D experience data
    """
    try:
        result = ar_service.get_3d_experience(uid)
        
        if result["status"] == "error":
            raise HTTPException(status_code=404, detail=result["message"])
        
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to get 3D experience: {str(e)}")


@router.put("/experience/{uid}")
async def update_3d_experience_endpoint(uid: int, updates: Dict[str, Any]):
    """
    Update an existing 3D experience.
    
    Args:
        uid (int): Unique identifier for the product
        updates (Dict): Updates to apply to the 3D experience
        
    Returns:
        Dict containing update result
    """
    try:
        result = ar_service.update_3d_experience(uid, updates)
        
        if result["status"] == "error":
            raise HTTPException(status_code=404, detail=result["message"])
        
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to update 3D experience: {str(e)}")


@router.delete("/experience/{uid}")
async def delete_3d_experience_endpoint(uid: int):
    """
    Delete a 3D experience.
    
    Args:
        uid (int): Unique identifier for the product
        
    Returns:
        Dict containing deletion result
    """
    try:
        result = ar_service.delete_3d_experience(uid)
        
        if result["status"] == "error":
            raise HTTPException(status_code=404, detail=result["message"])
        
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to delete 3D experience: {str(e)}")


@router.get("/experiences")
async def list_3d_experiences_endpoint():
    """
    List all available 3D experiences.
    
    Returns:
        Dict containing list of 3D experiences
    """
    try:
        experiences = list(ar_service.experiences.keys())
        return {
            "status": "success",
            "count": len(experiences),
            "experiences": experiences
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to list 3D experiences: {str(e)}")


@router.get("/experience/{uid}/config")
async def get_3d_config_endpoint(uid: int):
    """
    Get 3D configuration for a specific experience.
    
    Args:
        uid (int): Unique identifier for the product
        
    Returns:
        Dict containing 3D configuration
    """
    try:
        result = ar_service.get_3d_experience(uid)
        
        if result["status"] == "error":
            raise HTTPException(status_code=404, detail=result["message"])
        
        experience = result["experience"]
        return {
            "status": "success",
            "3d_config": experience.get("3d_config", {}),
            "interaction_settings": experience.get("interaction_settings", {}),
            "viewer_settings": experience.get("viewer_settings", {})
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to get 3D config: {str(e)}")


@router.get("/experience/{uid}/images")
async def get_3d_images_endpoint(uid: int):
    """
    Get 3D images for a specific experience.
    
    Args:
        uid (int): Unique identifier for the product
        
    Returns:
        Dict containing 3D images data
    """
    try:
        result = ar_service.get_3d_experience(uid)
        
        if result["status"] == "error":
            raise HTTPException(status_code=404, detail=result["message"])
        
        experience = result["experience"]
        return {
            "status": "success",
            "images": experience.get("images", []),
            "image_count": len(experience.get("images", []))
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to get 3D images: {str(e)}")
