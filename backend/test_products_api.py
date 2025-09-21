#!/usr/bin/env python3
"""
Simple test script to verify the products API endpoint works.
Run this after starting the FastAPI server.
"""

import requests
import json

def test_products_api():
    base_url = "http://localhost:8000"
    
    try:
        # Test the products endpoint
        response = requests.get(f"{base_url}/storage/products")
        
        if response.status_code == 200:
            data = response.json()
            print("✅ Products API endpoint working!")
            print(f"Status: {data.get('status')}")
            print(f"Count: {data.get('count')}")
            print(f"Products: {len(data.get('products', []))}")
            
            if data.get('products'):
                print("\nFirst product:")
                print(json.dumps(data['products'][0], indent=2))
        else:
            print(f"❌ API returned status code: {response.status_code}")
            print(f"Response: {response.text}")
            
    except requests.exceptions.ConnectionError:
        print("❌ Could not connect to API. Make sure the FastAPI server is running on localhost:8000")
    except Exception as e:
        print(f"❌ Error: {e}")

if __name__ == "__main__":
    test_products_api()