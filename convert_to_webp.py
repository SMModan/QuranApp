#!/usr/bin/env python3
"""
Convert generated PNG icons to WebP format for better compression.
"""

import os
from PIL import Image

def convert_png_to_webp(png_path, webp_path):
    """Convert PNG to WebP format."""
    try:
        img = Image.open(png_path)
        # Convert to RGBA if needed
        if img.mode != 'RGBA':
            img = img.convert('RGBA')
        
        # Save as WebP with high quality
        img.save(webp_path, 'WEBP', quality=95, method=6)
        print(f"✓ Converted {png_path} -> {webp_path}")
        
        # Remove PNG file
        os.remove(png_path)
        return True
    except Exception as e:
        print(f"✗ Error converting {png_path}: {e}")
        return False

def main():
    android_res = 'android/app/src/main/res'
    densities = ['mipmap-mdpi', 'mipmap-hdpi', 'mipmap-xhdpi', 'mipmap-xxhdpi', 'mipmap-xxxhdpi']
    
    print("🔄 Converting PNG icons to WebP format...")
    print("=" * 60)
    
    # Convert launcher icons
    print("\n📱 Converting launcher icons...")
    for density in densities:
        png_path = os.path.join(android_res, density, 'ic_launcher.png')
        webp_path = os.path.join(android_res, density, 'ic_launcher.webp')
        if os.path.exists(png_path):
            convert_png_to_webp(png_path, webp_path)
    
    # Convert foreground icons
    print("\n🎨 Converting foreground icons...")
    for density in densities:
        png_path = os.path.join(android_res, density, 'ic_launcher_foreground.png')
        webp_path = os.path.join(android_res, density, 'ic_launcher_foreground.webp')
        if os.path.exists(png_path):
            convert_png_to_webp(png_path, webp_path)
    
    # Note: Background icons can stay as PNG or be converted
    # Android typically uses drawable for backgrounds, but we'll keep them as PNG
    # since they're simple solid colors
    
    print("\n" + "=" * 60)
    print("✅ Conversion complete!")

if __name__ == '__main__':
    main()

