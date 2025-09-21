from dotenv import load_dotenv

import os
from google.cloud import texttospeech
from typing import Optional
load_dotenv()

class TextToSpeechClientWrapper:
    def __init__(self):
        # Try multiple possible paths for the credentials file
        possible_paths = [os.getenv("GCP_SA_KEY")]
        
        credentials_path = None
        for path in possible_paths:
            if os.path.exists(path):
                credentials_path = path
                break
        
        if credentials_path:
            self.client = texttospeech.TextToSpeechClient.from_service_account_json(credentials_path)
        else:
            # Fallback to default credentials
            self.client = texttospeech.TextToSpeechClient()

    def synthesize_speech(self, text: str, language_code: str = "en-IN", 
                    gender: texttospeech.SsmlVoiceGender = texttospeech.SsmlVoiceGender.MALE, 
                    audio_encoding: texttospeech.AudioEncoding = texttospeech.AudioEncoding.MP3, 
                    speaking_rate: Optional[float] = 1.0, 
                    pitch: Optional[float] = 0.0, 
                    volume_gain_db: Optional[float] = None,
                    voice_name: Optional[str] = None) -> bytes:
        input_text = texttospeech.SynthesisInput(text=text)
        
        # Use Indian English voices for more authentic, rustic sound
        if voice_name:
            selected_voice_name = voice_name
        else:
            # Default to Indian English male voice for rustic artisan feel
            # Available Indian English voices:
            # en-IN-Standard-A (Female), en-IN-Standard-B (Male), 
            # en-IN-Standard-C (Male), en-IN-Standard-D (Female)
            # en-IN-Wavenet-A (Female), en-IN-Wavenet-B (Male), 
            # en-IN-Wavenet-C (Male), en-IN-Wavenet-D (Female)
            selected_voice_name = "en-IN-Standard-B"  # Male Indian English voice
        
        voice = texttospeech.VoiceSelectionParams(
            language_code=language_code, 
            name=selected_voice_name,
            ssml_gender=gender
        )
        audio_config = texttospeech.AudioConfig(audio_encoding=audio_encoding)

        if speaking_rate is not None:
            audio_config.speaking_rate = speaking_rate
        if pitch is not None:
            audio_config.pitch = pitch
        if volume_gain_db is not None:
            audio_config.volume_gain_db = volume_gain_db



        response = self.client.synthesize_speech(
            input=input_text, voice=voice, audio_config=audio_config
        )

        return response.audio_content
    def save_to_file(self, audio_content: bytes, filename: str):
        with open(filename, "wb") as out:
            out.write(audio_content)



if __name__ == "__main__":
    tts = TextToSpeechClientWrapper()
    audio = tts.synthesize_speech("Hello world, this is a client class with types!")

    # Save output
    tts.save_to_file(audio, "output.mp3")
    print("Audio saved as output.mp3")




