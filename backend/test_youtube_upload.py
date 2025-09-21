#!/usr/bin/env python3
"""
Simple test script to verify the YouTube upload API endpoints work.
Run this after starting the FastAPI server.
"""

import requests
import json

def test_youtube_status_api():
    """Test the YouTube status check endpoint"""
    base_url = "http://localhost:8000"
    test_uid = 123
    
    try:
        # Test the YouTube status endpoint
        response = requests.get(f"{base_url}/social_media/youtube_status/{test_uid}")
        
        if response.status_code == 200:
            data = response.json()
            print("✅ YouTube status API endpoint working!")
            print(f"Uploaded: {data.get('uploaded')}")
            print(f"URL: {data.get('url')}")
            return data
        else:
            print(f"❌ API returned status code: {response.status_code}")
            print(f"Response: {response.text}")
            return None
            
    except requests.exceptions.ConnectionError:
        print("❌ Could not connect to server. Make sure FastAPI is running on localhost:8000")
        return None
    except Exception as e:
        print(f"❌ Error testing YouTube status API: {e}")
        return None

def test_youtube_upload_api():
    """Test the YouTube upload endpoint (be careful - this actually uploads!)"""
    base_url = "http://localhost:8000"
    test_uid = 123
    
    try:
        print("⚠️  WARNING: This will attempt to upload a video to YouTube!")
        print("Make sure you have:")
        print("1. A video in the database for uid=123")
        print("2. YouTube API credentials configured")
        print("3. You want to actually upload to YouTube")
        
        confirm = input("Continue? (y/N): ")
        if confirm.lower() != 'y':
            print("Upload test cancelled.")
            return None
        
        # Test the upload endpoint
        response = requests.post(f"{base_url}/social_media/upload_video", json={"uid": test_uid})
        
        if response.status_code == 200:
            result = response.text if response.headers.get('content-type') == 'text/plain' else response.json()
            print("✅ YouTube upload API endpoint working!")
            print(f"Result: {result}")
            return result
        else:
            print(f"❌ API returned status code: {response.status_code}")
            print(f"Response: {response.text}")
            return None
            
    except requests.exceptions.ConnectionError:
        print("❌ Could not connect to server. Make sure FastAPI is running on localhost:8000")
        return None
    except Exception as e:
        print(f"❌ Error testing YouTube upload API: {e}")
        return None

if __name__ == "__main__":
    print("🧪 Testing YouTube API endpoints...\n")
    
    # Test status endpoint first
    print("1. Testing YouTube status check...")
    status_result = test_youtube_status_api()
    
    print("\n" + "="*50 + "\n")
    
    # Only test upload if status check worked and video isn't already uploaded
    if status_result is not None:
        if not status_result.get('uploaded'):
            print("2. Testing YouTube upload...")
            test_youtube_upload_api()
        else:
            print("2. Video already uploaded, skipping upload test")
            print(f"   Existing URL: {status_result.get('url')}")
    else:
        print("2. Skipping upload test due to status check failure")
    
    print("\n🏁 Test complete!")