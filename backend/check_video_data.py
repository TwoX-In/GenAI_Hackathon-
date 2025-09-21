#!/usr/bin/env python3
"""
Utility script to check video and story data in the database
"""

import sys
import os
sys.path.append(os.path.join(os.path.dirname(__file__)))

from init.db import get_connection
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def check_database_contents():
    """Check what video and story data exists in the database"""
    
    try:
        with get_connection() as conn:
            cursor = conn.cursor()
        
        # Check output_videos table
        logger.info("Checking output_videos table...")
        cursor.execute("SELECT id, tag, LENGTH(data) as data_size FROM output_videos")
        videos = cursor.fetchall()
        
        if videos:
            logger.info(f"Found {len(videos)} videos:")
            for video in videos:
                logger.info(f"  ID: {video[0]}, Tag: {video[1]}, Size: {video[2]} bytes")
        else:
            logger.info("No videos found in output_videos table")
        
        # Check story table
        logger.info("\nChecking story table...")
        cursor.execute("SELECT id, LENGTH(story) as story_length, SUBSTR(story, 1, 100) as story_preview FROM story")
        stories = cursor.fetchall()
        
        if stories:
            logger.info(f"Found {len(stories)} stories:")
            for story in stories:
                logger.info(f"  ID: {story[0]}, Length: {story[1]} chars, Preview: {story[2]}...")
        else:
            logger.info("No stories found in story table")
        
        # Check edited_videos table
        logger.info("\nChecking edited_videos table...")
        cursor.execute("SELECT id, LENGTH(data) as data_size FROM edited_videos")
        edited_videos = cursor.fetchall()
        
        if edited_videos:
            logger.info(f"Found {len(edited_videos)} edited videos:")
            for video in edited_videos:
                logger.info(f"  ID: {video[0]}, Size: {video[1]} bytes")
        else:
            logger.info("No edited videos found")
        
            # Suggest test IDs
            if videos and stories:
                common_ids = set(v[0] for v in videos) & set(s[0] for s in stories)
                if common_ids:
                    logger.info(f"\nSuggested test IDs (have both video and story): {list(common_ids)}")
                else:
                    logger.info("\nNo IDs found with both video and story data")
        
    except Exception as e:
        logger.error(f"Error checking database: {e}")

if __name__ == "__main__":
    check_database_contents()