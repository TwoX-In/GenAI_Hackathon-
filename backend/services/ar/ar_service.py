import base64
import json
from typing import List, Dict, Any
from services.storage.storage import get_output_images


class ARService:
    """
    3D Experience Service for creating immersive 3D experiences from output images.
    """
    
    def __init__(self):
        self.experiences = {}
    
    def create_3d_experience(self, uid: int) -> Dict[str, Any]:
        """
        Create a 3D experience from output images for a given UID.
        
        Args:
            uid (int): Unique identifier for the product
            
        Returns:
            Dict containing 3D experience data
        """
        try:
            # Get output images for the UID
            output_images = get_output_images(uid)
            
            if not output_images:
                raise ValueError(f"No output images found for UID: {uid}")
            
            # Process images for 3D experience
            experience_images = []
            for img_data in output_images:
                experience_image = {
                    "tag": img_data["tag"],
                    "image": img_data["image"],
                    "3d_metadata": self._generate_3d_metadata(img_data)
                }
                experience_images.append(experience_image)
            
            # Create 3D experience configuration
            experience = {
                "uid": uid,
                "images": experience_images,
                "3d_config": self._create_3d_config(experience_images),
                "interaction_settings": self._get_interaction_settings(),
                "viewer_settings": self._get_viewer_settings()
            }
            
            # Store the 3D experience
            self.experiences[uid] = experience
            
            return {
                "status": "success",
                "message": f"3D experience created for UID: {uid}",
                "experience": experience
            }
            
        except Exception as e:
            return {
                "status": "error",
                "message": f"Failed to create 3D experience: {str(e)}",
                "experience": None
            }
    
    def get_3d_experience(self, uid: int) -> Dict[str, Any]:
        """
        Get existing 3D experience for a UID.
        
        Args:
            uid (int): Unique identifier for the product
            
        Returns:
            Dict containing 3D experience data
        """
        if uid in self.experiences:
            return {
                "status": "success",
                "experience": self.experiences[uid]
            }
        else:
            return {
                "status": "error",
                "message": f"No 3D experience found for UID: {uid}"
            }
    
    def _generate_3d_metadata(self, img_data: Dict) -> Dict[str, Any]:
        """
        Generate 3D-specific metadata for an image.
        
        Args:
            img_data: Image data containing tag and base64 image
            
        Returns:
            Dict containing 3D metadata
        """
        return {
            "position": {"x": 0, "y": 0, "z": 0},
            "rotation": {"x": 0, "y": 0, "z": 0},
            "scale": {"x": 1.0, "y": 1.0, "z": 1.0},
            "material": {
                "opacity": 1.0,
                "transparent": False,
                "side": "double"
            },
            "animation": {
                "auto_rotate": True,
                "rotation_speed": 0.01,
                "hover_scale": 1.1,
                "click_animation": True
            },
            "lighting": {
                "receive_shadow": True,
                "cast_shadow": True,
                "emissive": False
            }
        }
    
    def _create_3d_config(self, experience_images: List[Dict]) -> Dict[str, Any]:
        """
        Create 3D configuration for the experience.
        
        Args:
            experience_images: List of 3D image data
            
        Returns:
            Dict containing 3D configuration
        """
        return {
            "camera": {
                "position": {"x": 0, "y": 0, "z": 5},
                "target": {"x": 0, "y": 0, "z": 0},
                "fov": 75,
                "near": 0.1,
                "far": 1000
            },
            "lighting": {
                "ambient_light": {"color": "#ffffff", "intensity": 0.4},
                "directional_light": {"color": "#ffffff", "intensity": 1.0, "position": {"x": 10, "y": 10, "z": 5}},
                "point_light": {"color": "#ffffff", "intensity": 0.5, "position": {"x": -10, "y": -10, "z": 5}}
            },
            "rendering": {
                "shadows": True,
                "anti_aliasing": True,
                "background_color": "#f0f0f0",
                "fog": {"enabled": False}
            },
            "controls": {
                "enable_rotation": True,
                "enable_zoom": True,
                "enable_pan": True,
                "auto_rotate": True,
                "auto_rotate_speed": 2.0
            }
        }
    
    def _get_viewer_settings(self) -> Dict[str, Any]:
        """
        Get viewer settings for 3D experience.
        
        Returns:
            Dict containing viewer settings
        """
        return {
            "initial_camera_position": {"x": 0, "y": 0, "z": 5},
            "camera_limits": {
                "min_distance": 1.0,
                "max_distance": 20.0,
                "max_polar_angle": 1.5
            },
            "interaction": {
                "mouse_sensitivity": 1.0,
                "touch_sensitivity": 1.0,
                "keyboard_enabled": True
            }
        }
    
    
    def _get_interaction_settings(self) -> Dict[str, Any]:
        """
        Get interaction settings for 3D experience.
        
        Returns:
            Dict containing interaction settings
        """
        return {
            "mouse_controls": True,
            "keyboard_controls": True,
            "touch_controls": True,
            "wheel_zoom": True,
            "double_click_reset": True
        }
    
    
    def update_3d_experience(self, uid: int, updates: Dict[str, Any]) -> Dict[str, Any]:
        """
        Update an existing 3D experience.
        
        Args:
            uid (int): Unique identifier for the product
            updates (Dict): Updates to apply to the 3D experience
            
        Returns:
            Dict containing update result
        """
        if uid not in self.experiences:
            return {
                "status": "error",
                "message": f"No 3D experience found for UID: {uid}"
            }
        
        try:
            # Update the 3D experience
            self.experiences[uid].update(updates)
            
            return {
                "status": "success",
                "message": f"3D experience updated for UID: {uid}",
                "experience": self.experiences[uid]
            }
        except Exception as e:
            return {
                "status": "error",
                "message": f"Failed to update 3D experience: {str(e)}"
            }
    
    def delete_3d_experience(self, uid: int) -> Dict[str, Any]:
        """
        Delete a 3D experience.
        
        Args:
            uid (int): Unique identifier for the product
            
        Returns:
            Dict containing deletion result
        """
        if uid in self.experiences:
            del self.experiences[uid]
            return {
                "status": "success",
                "message": f"3D experience deleted for UID: {uid}"
            }
        else:
            return {
                "status": "error",
                "message": f"No 3D experience found for UID: {uid}"
            }


# Global AR service instance
ar_service = ARService()
