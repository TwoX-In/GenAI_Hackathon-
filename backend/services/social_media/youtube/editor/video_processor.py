import io
import os
import tempfile
import uuid
import logging
from typing import Optional
from pathlib import Path

from moviepy.editor import VideoFileClip, AudioFileClip, CompositeVideoClip
from moviepy.video.fx import loop

# Import database connection
from init.db import get_connection

# Import the audio generation client
import sys
import os
audio_gen_path = os.path.join(os.path.dirname(__file__), '../../../../audio-gen')
sys.path.insert(0, audio_gen_path)
from client import TextToSpeechClientWrapper

logger = logging.getLogger(__name__)

class VideoProcessor:
    """Service for processing videos with audio narration"""
    
    def __init__(self):
        self.tts_client = TextToSpeechClientWrapper()
        
    def get_video_blob(self, uid: int) -> Optional[bytes]:
        """Retrieve video blob from output_videos table"""
        try:
            with get_connection() as conn:
                cursor = conn.cursor()
                
                cursor.execute(
                    "SELECT data FROM output_videos WHERE id = ?",
                    (uid,)
                )
                result = cursor.fetchone()
                
                if result:
                    return result[0]
                return None
                
        except Exception as e:
            logger.error(f"Error retrieving video blob: {e}")
            return None
    
    def get_product_story(self, uid: int) -> Optional[str]:
        """Retrieve product story from story table"""
        try:
            with get_connection() as conn:
                cursor = conn.cursor()
                
                cursor.execute(
                    "SELECT story FROM story WHERE id = ?",
                    (uid,)
                )
                result = cursor.fetchone()
                
                if result:
                    return result[0]
                return None
                
        except Exception as e:
            logger.error(f"Error retrieving product story: {e}")
            return None
    
    def save_edited_video(self, uid: int, video_blob: bytes) -> bool:
        """Save processed video to edited_videos table"""
        try:
            with get_connection() as conn:
                cursor = conn.cursor()
                
                # Insert or replace the edited video
                cursor.execute(
                    "INSERT OR REPLACE INTO edited_videos (id, data) VALUES (?, ?)",
                    (uid, video_blob)
                )
                conn.commit()
                
                logger.info(f"Successfully saved edited video for uid: {uid}")
                return True
                
        except Exception as e:
            logger.error(f"Error saving edited video: {e}")
            return False
    
    def create_marketing_narration(self, story_text: str) -> bytes:
        """Generate marketing audio from product story with Indic rustic voice"""
        try:
            # Create a more authentic, culturally-aware marketing narrative
            marketing_text = f"""
            Namaste! Let me tell you about this beautiful artisan creation. 
            {story_text}
            This masterpiece carries the soul of our traditional craftspeople, passed down through generations. 
            Each piece tells a story of our rich cultural heritage and skilled hands that shaped it with love and devotion.
            Experience the authentic beauty of Indian craftsmanship!
            """
            
            # Import the gender enum for proper usage
            from google.cloud import texttospeech
            
            # Generate audio with Indian English voice and rustic settings
            audio_content = self.tts_client.synthesize_speech(
                text=marketing_text,
                language_code="en-IN",  # Indian English
                gender=texttospeech.SsmlVoiceGender.MALE,  # Male voice for rustic feel
                speaking_rate=0.85,  # Slower, more deliberate pace for storytelling
                pitch=-2.0,  # Lower pitch for more mature, rustic sound
                volume_gain_db=1.5,  # Moderate volume
                voice_name="en-IN-Standard-B"  # Male Indian English voice
            )
            
            return audio_content
            
        except Exception as e:
            logger.error(f"Error creating marketing narration with primary voice: {e}")
            
            # Try multiple fallback voices for robustness
            fallback_voices = [
                ("en-IN-Standard-C", "Male Indian English (Alternative)"),
                ("en-IN-Wavenet-B", "Male Indian English (Wavenet)"),
                ("en-IN-Standard-A", "Female Indian English"),
                ("en-US-Standard-D", "US English Male (Final fallback)")
            ]
            
            for voice_name, voice_description in fallback_voices:
                try:
                    logger.info(f"Trying fallback voice: {voice_description}")
                    audio_content = self.tts_client.synthesize_speech(
                        text=marketing_text,
                        language_code="en-IN" if "en-IN" in voice_name else "en-US",
                        speaking_rate=0.85,
                        pitch=-2.0 if "Male" in voice_description else -1.0,
                        volume_gain_db=1.5,
                        voice_name=voice_name
                    )
                    logger.info(f"Successfully generated audio with {voice_description}")
                    return audio_content
                except Exception as fallback_error:
                    logger.warning(f"Fallback voice {voice_description} failed: {fallback_error}")
                    continue
            
            # If all fallbacks fail, raise the original error
            logger.error("All voice options failed")
            raise
    
    def process_video_with_audio(self, uid: int) -> bool:
        """
        Main processing function that:
        1. Gets video blob from output_videos (first video for the uid)
        2. Removes existing audio
        3. Gets product story and generates marketing audio
        4. Extends video to match audio length
        5. Saves final video to edited_videos
        6. Cleans up temporary files
        """
        temp_files = []
        
        try:
            # Step 1: Get video blob
            logger.info(f"Processing video for uid: {uid}")
            video_blob = self.get_video_blob(uid)
            if not video_blob:
                logger.error(f"No video found for uid: {uid}")
                return False
            
            # Step 2: Get product story
            story_text = self.get_product_story(uid)
            if not story_text:
                logger.error(f"No product story found for uid: {uid}")
                return False
            
            # Create temporary directory for processing
            temp_dir = tempfile.mkdtemp()
            temp_files.append(temp_dir)
            
            # Step 3: Save video blob to temporary file
            temp_video_path = os.path.join(temp_dir, f"input_video_{uuid.uuid4().hex[:8]}.mp4")
            temp_files.append(temp_video_path)
            
            with open(temp_video_path, 'wb') as f:
                f.write(video_blob)
            
            # Step 4: Load video and remove audio
            logger.info("Loading video and removing existing audio")
            video_clip = VideoFileClip(temp_video_path)
            video_no_audio = video_clip.without_audio()
            original_duration = video_clip.duration
            
            # Step 5: Generate marketing audio
            logger.info("Generating marketing narration")
            audio_content = self.create_marketing_narration(story_text)
            #ok 
            # Save audio to temporary file
            temp_audio_path = os.path.join(temp_dir, f"narration_{uuid.uuid4().hex[:8]}.mp3")
            temp_files.append(temp_audio_path)
            
            with open(temp_audio_path, 'wb') as f:
                f.write(audio_content)
            
            # Load audio clip
            audio_clip = AudioFileClip(temp_audio_path)
            audio_duration = audio_clip.duration
            
            # Step 6: Extend video to match audio length if needed
            logger.info(f"Original video duration: {original_duration}s, Audio duration: {audio_duration}s")
            
            if audio_duration > original_duration:
                # Loop the video to match audio duration
                logger.info("Extending video to match audio length")
                loops_needed = int(audio_duration / original_duration) + 1
                extended_video = loop.loop(video_no_audio, n=loops_needed)
                final_video = extended_video.subclip(0, audio_duration)
            else:
                # Trim video to match audio duration
                final_video = video_no_audio.subclip(0, audio_duration)
            
            # Step 7: Combine video with new audio
            logger.info("Combining video with marketing narration")
            final_clip = final_video.set_audio(audio_clip)
            
            # Step 8: Export final video
            temp_output_path = os.path.join(temp_dir, f"final_video_{uuid.uuid4().hex[:8]}.mp4")
            temp_files.append(temp_output_path)
            
            final_clip.write_videofile(
                temp_output_path,
                codec='libx264',
                audio_codec='aac',
                temp_audiofile=os.path.join(temp_dir, f"temp_audio_{uuid.uuid4().hex[:8]}.m4a"),
                remove_temp=True,
                verbose=False,
                logger=None
            )
            
            # Step 9: Read final video as blob
            with open(temp_output_path, 'rb') as f:
                final_video_blob = f.read()
            
            # Step 10: Save to database
            success = self.save_edited_video(uid, final_video_blob)
            
            # Clean up clips
            video_clip.close()
            video_no_audio.close()
            audio_clip.close()
            final_video.close()
            final_clip.close()
            
            logger.info(f"Video processing completed successfully for uid: {uid}")
            return success
            
        except Exception as e:
            logger.error(f"Error processing video: {e}")
            return False
            
        finally:
            # Step 11: Clean up all temporary files
            self._cleanup_temp_files(temp_files)
    
    def _cleanup_temp_files(self, temp_files: list):
        """Clean up temporary files and directories"""
        for temp_path in temp_files:
            try:
                if os.path.isfile(temp_path):
                    os.remove(temp_path)
                    logger.debug(f"Removed temporary file: {temp_path}")
                elif os.path.isdir(temp_path):
                    import shutil
                    shutil.rmtree(temp_path)
                    logger.debug(f"Removed temporary directory: {temp_path}")
            except Exception as e:
                logger.warning(f"Failed to remove temporary file {temp_path}: {e}")


# Convenience function for easy usage
async def process_video_with_marketing_audio(uid: int) -> bool:
    """
    Process a video by adding marketing narration based on product story
    
    Args:
        uid: User/product ID
        
    Returns:
        bool: Success status
    """
    processor = VideoProcessor()
    return processor.process_video_with_audio(uid)