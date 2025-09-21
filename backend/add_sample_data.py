#!/usr/bin/env python3
"""
Script to add sample product data for testing the products API.
"""

import sqlite3
import base64
from pathlib import Path
from init.db import get_connection

def create_sample_image():
    """Create a simple base64 encoded sample image (1x1 pixel PNG)"""
    # This is a 1x1 transparent PNG in base64
    sample_png = b'\x89PNG\r\n\x1a\n\x00\x00\x00\rIHDR\x00\x00\x00\x01\x00\x00\x00\x01\x08\x06\x00\x00\x00\x1f\x15\xc4\x89\x00\x00\x00\nIDATx\x9cc\x00\x01\x00\x00\x05\x00\x01\r\n-\xdb\x00\x00\x00\x00IEND\xaeB`\x82'
    return sample_png

def add_sample_products():
    """Add sample products to the database"""
    
    sample_products = [
        {
            "id": 1,
            "title": "Traditional Zardozi Embroidery",
            "artist": "Rajesh Kumar",
            "style": "Mughal",
            "origin": "Lucknow, Uttar Pradesh",
            "predicted_artist": "Traditional Craftsman",
            "medium": "Silk and Gold Thread",
            "themes": "Floral, Paisley",
            "colors": "Gold, Red, Green",
            "price": 15000
        },
        {
            "id": 2,
            "title": "Handwoven Pashmina Shawl",
            "artist": "Meera Devi",
            "style": "Kashmiri",
            "origin": "Kashmir",
            "predicted_artist": "Master Weaver",
            "medium": "Pashmina Wool",
            "themes": "Geometric, Traditional",
            "colors": "Cream, Brown, Blue",
            "price": 25000
        },
        {
            "id": 3,
            "title": "Madhubani Folk Painting",
            "artist": "Sunita Jha",
            "style": "Mithila",
            "origin": "Bihar",
            "predicted_artist": "Folk Artist",
            "medium": "Natural Pigments on Paper",
            "themes": "Nature, Mythology",
            "colors": "Red, Yellow, Black, Green",
            "price": 8000
        }
    ]
    
    sample_image = create_sample_image()
    
    with get_connection() as conn:
        for product in sample_products:
            try:
                # Insert into results table first (this is the main table that links everything)
                conn.execute("INSERT OR REPLACE INTO results (id, user_id) VALUES (?, ?)", 
                           (product["id"], 1))
                
                # Insert product details
                conn.execute("INSERT OR REPLACE INTO product_title (id, title) VALUES (?, ?)",
                           (product["id"], product["title"]))
                
                conn.execute("INSERT OR REPLACE INTO product_artist (id, artist) VALUES (?, ?)",
                           (product["id"], product["artist"]))
                
                conn.execute("INSERT OR REPLACE INTO product_style (id, style) VALUES (?, ?)",
                           (product["id"], product["style"]))
                
                conn.execute("INSERT OR REPLACE INTO product_origin (id, origin) VALUES (?, ?)",
                           (product["id"], product["origin"]))
                
                conn.execute("INSERT OR REPLACE INTO product_predicted_artist (id, predicted_artist) VALUES (?, ?)",
                           (product["id"], product["predicted_artist"]))
                
                conn.execute("INSERT OR REPLACE INTO product_medium (id, medium) VALUES (?, ?)",
                           (product["id"], product["medium"]))
                
                conn.execute("INSERT OR REPLACE INTO product_themes (id, themes) VALUES (?, ?)",
                           (product["id"], product["themes"]))
                
                conn.execute("INSERT OR REPLACE INTO product_colors (id, colors) VALUES (?, ?)",
                           (product["id"], product["colors"]))
                
                conn.execute("INSERT OR REPLACE INTO pricing (id, price) VALUES (?, ?)",
                           (product["id"], product["price"]))
                
                # Add sample output image
                conn.execute("INSERT OR REPLACE INTO output_image (id, tag, data) VALUES (?, ?, ?)",
                           (product["id"], 1, sample_image))
                
                print(f"✅ Added sample product: {product['title']}")
                
            except sqlite3.Error as e:
                print(f"❌ Error adding product {product['id']}: {e}")
        
        conn.commit()
        print(f"\n✅ Successfully added {len(sample_products)} sample products!")

if __name__ == "__main__":
    add_sample_products()