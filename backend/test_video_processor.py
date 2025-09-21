#!/usr/bin/env python3
"""
Test script for video processor functionality
"""

import asyncio
import logging
import sys
import os

# Add the backend directory to the Python path
sys.path.append(os.path.join(os.path.dirname(__file__)))

from services.social_media.youtube.editor.video_processor import VideoProcessor, process_video_with_marketing_audio

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

async def test_video_processing():
    """Test the video processing functionality"""
    
    # Test with a sample UID (replace with actual UID from your database)
    test_uid = 123
    
    logger.info(f"Testing video processing for UID: {test_uid}")
    
    try:
        # Test the video processor
        processor = VideoProcessor()
        
        # Check if video exists
        video_blob = processor.get_video_blob(test_uid)
        if not video_blob:
            logger.error(f"No video found for UID: {test_uid}")
            return False
        
        logger.info(f"Found video blob of size: {len(video_blob)} bytes")
        
        # Check if story exists
        story = processor.get_product_story(test_uid)
        if not story:
            logger.error(f"No story found for UID: {test_uid}")
            return False
        
        logger.info(f"Found story: {story[:100]}...")
        
        # Process the video
        success = await process_video_with_marketing_audio(test_uid)
        
        if success:
            logger.info("Video processing completed successfully!")
            return True
        else:
            logger.error("Video processing failed!")
            return False
            
    except Exception as e:
        logger.error(f"Test failed with error: {e}")
        return False

if __name__ == "__main__":
    asyncio.run(test_video_processing())