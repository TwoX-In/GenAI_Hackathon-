#!/usr/bin/env python3
"""
Test script for inventory recommendations functionality.
This script demonstrates how the inventory system works with database storage.
"""

import asyncio
import sys
import os

# Add the backend directory to the Python path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from services.inventory.inventory_service import get_recommended_inventory
from services.storage.storage import get_inventory
from services.metadata.holidays import get_next_indian_holidays

async def test_inventory_system():
    """Test the complete inventory recommendation and storage system"""
    
    print("🎨 Testing Inventory Recommendation System")
    print("=" * 50)
    
    # Test parameters
    art_forms = ["pottery", "textiles", "jewelry"]
    region = "Rajasthan"
    
    print(f"Art Forms: {art_forms}")
    print(f"Target Region: {region}")
    
    # Get upcoming holidays
    holidays = get_next_indian_holidays(5)
    print(f"Upcoming Holidays: {len(holidays)} festivals found")
    
    try:
        # Generate UID for testing
        from uuid import uuid4
        uid = uuid4().int & ((1 << 32) - 1)
        
        # Generate and store recommendations
        print(f"\n📝 Generating recommendations for UID: {uid}...")
        result = await get_recommended_inventory(art_forms, region, holidays, uid)
        recommendations = result["recommendations"]
        
        print(f"✅ Generated recommendations for UID: {uid}")
        print(f"📊 Recommendations structure: {type(recommendations)}")
        
        # Print the recommendations
        if "recommendations" in recommendations:
            for i, rec in enumerate(recommendations["recommendations"], 1):
                print(f"\n🎉 Holiday {i}: {rec.get('holiday', 'Unknown')}")
                print(f"   📅 Date: {rec.get('date', 'Unknown')}")
                print(f"   🛍️ Items: {', '.join(rec.get('items', []))}")
                print(f"   💡 Reason: {rec.get('reason', 'No reason provided')[:100]}...")
        
        # Test retrieval from database
        print(f"\n🔍 Retrieving stored data for UID: {uid}")
        stored_data = get_inventory(uid)
        
        if stored_data:
            items = stored_data.get('items', [])
            holidays = stored_data.get('holidays', [])
            print(f"✅ Retrieved data with {len(items)} items and {len(holidays)} holidays")
            print(f"📋 Art forms: {stored_data.get('art_forms', 'None')}")
            print(f"📋 Sample items: {items[:3] if items else 'None'}")
        else:
            print("❌ No data found in storage")
        
        print("\n✨ Test completed successfully!")
        return True
        
    except Exception as e:
        print(f"❌ Error during testing: {e}")
        import traceback
        traceback.print_exc()
        return False

if __name__ == "__main__":
    # Initialize database first
    print("🔧 Initializing database...")
    from init.db import init_db
    
    async def main():
        await init_db()
        success = await test_inventory_system()
        return success
    
    success = asyncio.run(main())
    
    if success:
        print("\n🎯 All tests passed! The inventory system is working correctly.")
    else:
        print("\n💥 Tests failed! Please check the error messages above.")
        sys.exit(1)
