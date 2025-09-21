#!/usr/bin/env python3
"""
Script to check what data is in the database.
"""

import sqlite3
from init.db import get_connection

def check_database():
    """Check what data exists in the database"""
    
    with get_connection() as conn:
        # Check results table
        cursor = conn.execute("SELECT COUNT(*) FROM results")
        results_count = cursor.fetchone()[0]
        print(f"Results table: {results_count} records")
        
        if results_count > 0:
            cursor = conn.execute("SELECT id FROM results ORDER BY id")
            result_ids = [row[0] for row in cursor.fetchall()]
            print(f"Result IDs: {result_ids}")
        
        # Check other tables
        tables = [
            'product_title', 'product_artist', 'product_style', 'product_origin',
            'product_predicted_artist', 'product_medium', 'product_themes', 
            'product_colors', 'pricing', 'output_image', 'input_image'
        ]
        
        for table in tables:
            try:
                cursor = conn.execute(f"SELECT COUNT(*) FROM {table}")
                count = cursor.fetchone()[0]
                print(f"{table}: {count} records")
            except sqlite3.Error as e:
                print(f"{table}: Error - {e}")

if __name__ == "__main__":
    check_database()