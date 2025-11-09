#!/usr/bin/env python3
"""
Replace splash screen logos in all drawable density folders with splash_center_icon.png
"""

import os
from PIL import Image

# Splash screen logo sizes for each density (based on current sizes)
SPLASH_SIZES = {
    'drawable-mdpi': 288,      # 1x
    'drawable-hdpi': 432,       # 1.5x
    'drawable-xhdpi': 576,     # 2x
    'drawable-xxhdpi': 864,    # 3x
    'drawable-xxxhdpi': 1152,  # 4x
}

def resize_splash_icon(input_path, output_path, size):
    """Resize splash icon to specified size, maintaining aspect ratio and centering on square canvas."""
    try:
        img = Image.open(input_path)
        # Convert to RGBA if needed
        if img.mode != 'RGBA':
            img = img.convert('RGBA')
        
        # Calculate aspect ratio
        original_width, original_height = img.size
        aspect_ratio = original_width / original_height
        
        # Determine new dimensions (maintain aspect ratio, fit within square)
        if aspect_ratio > 1:  # Wider than tall
            new_width = size
            new_height = int(size / aspect_ratio)
        else:  # Taller than wide or square
            new_height = size
            new_width = int(size * aspect_ratio)
        
        # Resize with high-quality resampling
        resized = img.resize((new_width, new_height), Image.Resampling.LANCZOS)
        
        # Create square canvas with transparent background
        canvas = Image.new('RGBA', (size, size), (0, 0, 0, 0))
        
        # Center the resized image on the canvas
        x_offset = (size - new_width) // 2
        y_offset = (size - new_height) // 2
        canvas.paste(resized, (x_offset, y_offset), resized)
        
        # Save as PNG
        canvas.save(output_path, format='PNG', optimize=True)
        print(f"✓ Generated {output_path} ({size}x{size})")
        return True
    except Exception as e:
        print(f"✗ Error generating {output_path}: {e}")
        return False

def main():
    # Paths
    splash_icon = 'assets/splash_center_icon.png'
    android_res = 'android/app/src/main/res'
    
    # Check if splash icon exists
    if not os.path.exists(splash_icon):
        print(f"Error: Splash icon not found at {splash_icon}")
        return
    
    print(f"Using splash icon: {splash_icon}")
    print("=" * 60)
    
    # Replace splash screen logos for all densities
    print("\n🖼️  Replacing splash screen logos...")
    for density, size in SPLASH_SIZES.items():
        output_dir = os.path.join(android_res, density)
        if not os.path.exists(output_dir):
            os.makedirs(output_dir, exist_ok=True)
        
        output_path = os.path.join(output_dir, 'splashscreen_logo.png')
        resize_splash_icon(splash_icon, output_path, size)
    
    print("\n" + "=" * 60)
    print("✅ Splash screen logo replacement complete!")
    print("\nReplaced logos in:")
    for density in SPLASH_SIZES.keys():
        print(f"  - {density}/splashscreen_logo.png")

if __name__ == '__main__':
    main()

