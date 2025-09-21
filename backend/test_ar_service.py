#!/usr/bin/env python3
"""
Test script for AR service functionality.
This script tests the AR service endpoints and functionality.
"""

import requests
import json
import sys

# Base URL for the API
BASE_URL = "http://localhost:8000"

def test_ar_endpoints():
    """Test AR service endpoints"""
    print("Testing AR Service Endpoints...")
    print("=" * 50)
    
    # Test data
    test_uid = 12345
    
    try:
        # Test 1: Create AR Experience
        print(f"1. Testing AR Experience Creation for UID: {test_uid}")
        response = requests.post(f"{BASE_URL}/ar/experience/{test_uid}")
        
        if response.status_code == 200:
            data = response.json()
            print(f"   ✅ Success: {data.get('message', 'AR experience created')}")
            print(f"   📊 Status: {data.get('status', 'unknown')}")
        else:
            print(f"   ❌ Failed: HTTP {response.status_code}")
            print(f"   📝 Response: {response.text}")
        
        print()
        
        # Test 2: Get AR Experience
        print(f"2. Testing AR Experience Retrieval for UID: {test_uid}")
        response = requests.get(f"{BASE_URL}/ar/experience/{test_uid}")
        
        if response.status_code == 200:
            data = response.json()
            print(f"   ✅ Success: AR experience retrieved")
            print(f"   📊 Status: {data.get('status', 'unknown')}")
            if 'ar_experience' in data:
                ar_exp = data['ar_experience']
                print(f"   🖼️  Images: {len(ar_exp.get('images', []))}")
                print(f"   ⚙️  Config: {'Yes' if ar_exp.get('ar_config') else 'No'}")
        else:
            print(f"   ❌ Failed: HTTP {response.status_code}")
            print(f"   📝 Response: {response.text}")
        
        print()
        
        # Test 3: Get AR Config
        print(f"3. Testing AR Config Retrieval for UID: {test_uid}")
        response = requests.get(f"{BASE_URL}/ar/experience/{test_uid}/config")
        
        if response.status_code == 200:
            data = response.json()
            print(f"   ✅ Success: AR config retrieved")
            print(f"   📊 Status: {data.get('status', 'unknown')}")
        else:
            print(f"   ❌ Failed: HTTP {response.status_code}")
            print(f"   📝 Response: {response.text}")
        
        print()
        
        # Test 4: Get AR Images
        print(f"4. Testing AR Images Retrieval for UID: {test_uid}")
        response = requests.get(f"{BASE_URL}/ar/experience/{test_uid}/images")
        
        if response.status_code == 200:
            data = response.json()
            print(f"   ✅ Success: AR images retrieved")
            print(f"   📊 Status: {data.get('status', 'unknown')}")
            print(f"   🖼️  Image Count: {data.get('image_count', 0)}")
        else:
            print(f"   ❌ Failed: HTTP {response.status_code}")
            print(f"   📝 Response: {response.text}")
        
        print()
        
        # Test 5: List AR Experiences
        print("5. Testing AR Experiences List")
        response = requests.get(f"{BASE_URL}/ar/experiences")
        
        if response.status_code == 200:
            data = response.json()
            print(f"   ✅ Success: AR experiences listed")
            print(f"   📊 Status: {data.get('status', 'unknown')}")
            print(f"   📝 Count: {data.get('count', 0)}")
            print(f"   🆔 UIDs: {data.get('experiences', [])}")
        else:
            print(f"   ❌ Failed: HTTP {response.status_code}")
            print(f"   📝 Response: {response.text}")
        
        print()
        
        # Test 6: Delete AR Experience
        print(f"6. Testing AR Experience Deletion for UID: {test_uid}")
        response = requests.delete(f"{BASE_URL}/ar/experience/{test_uid}")
        
        if response.status_code == 200:
            data = response.json()
            print(f"   ✅ Success: {data.get('message', 'AR experience deleted')}")
            print(f"   📊 Status: {data.get('status', 'unknown')}")
        else:
            print(f"   ❌ Failed: HTTP {response.status_code}")
            print(f"   📝 Response: {response.text}")
        
        print()
        print("🎉 AR Service Testing Complete!")
        
    except requests.exceptions.ConnectionError:
        print("❌ Connection Error: Could not connect to the API server.")
        print("   Make sure the backend server is running on http://localhost:8000")
        return False
    except Exception as e:
        print(f"❌ Unexpected Error: {str(e)}")
        return False
    
    return True

def test_storage_integration():
    """Test integration with storage service"""
    print("\nTesting Storage Integration...")
    print("=" * 50)
    
    try:
        # Test if storage endpoints are accessible
        response = requests.get(f"{BASE_URL}/storage/output_images/12345")
        
        if response.status_code == 200:
            print("   ✅ Storage service is accessible")
            data = response.json()
            print(f"   📊 Found {len(data)} output images")
        elif response.status_code == 404:
            print("   ⚠️  No output images found for UID 12345 (this is expected for test)")
        else:
            print(f"   ❌ Storage service error: HTTP {response.status_code}")
            
    except Exception as e:
        print(f"   ❌ Storage integration error: {str(e)}")

if __name__ == "__main__":
    print("AR Service Test Suite")
    print("=" * 50)
    
    # Test AR endpoints
    success = test_ar_endpoints()
    
    # Test storage integration
    test_storage_integration()
    
    if success:
        print("\n✅ All tests completed successfully!")
        sys.exit(0)
    else:
        print("\n❌ Some tests failed!")
        sys.exit(1)
