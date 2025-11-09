#!/usr/bin/env python3
"""
Generate Android app icons for all mipmap densities from master icon.
"""

import os
from PIL import Image
import shutil

# Android icon sizes in pixels for each density
ICON_SIZES = {
    'mipmap-mdpi': 48,      # 1x
    'mipmap-hdpi': 72,      # 1.5x
    'mipmap-xhdpi': 96,    # 2x
    'mipmap-xxhdpi': 144,   # 3x
    'mipmap-xxxhdpi': 192,  # 4x
}

# Adaptive icon sizes (foreground should be smaller than background)
ADAPTIVE_FOREGROUND_SIZES = {
    'mipmap-mdpi': 108,     # 1x
    'mipmap-hdpi': 162,     # 1.5x
    'mipmap-xhdpi': 216,   # 2x
    'mipmap-xxhdpi': 324,  # 3x
    'mipmap-xxxhdpi': 432, # 4x
}

ADAPTIVE_BACKGROUND_SIZES = {
    'mipmap-mdpi': 108,
    'mipmap-hdpi': 162,
    'mipmap-xhdpi': 216,
    'mipmap-xxhdpi': 324,
    'mipmap-xxxhdpi': 432,
}

def create_directory(path):
    """Create directory if it doesn't exist."""
    os.makedirs(path, exist_ok=True)

def resize_image(input_path, output_path, size, format='PNG'):
    """Resize image to specified size."""
    try:
        img = Image.open(input_path)
        # Convert to RGBA if needed
        if img.mode != 'RGBA':
            img = img.convert('RGBA')
        
        # Resize with high-quality resampling
        resized = img.resize((size, size), Image.Resampling.LANCZOS)
        
        # Save as PNG
        resized.save(output_path, format=format, optimize=True)
        print(f"✓ Generated {output_path} ({size}x{size})")
        return True
    except Exception as e:
        print(f"✗ Error generating {output_path}: {e}")
        return False

def create_adaptive_icon_xml():
    """Create adaptive icon XML for mipmap-anydpi-v26."""
    xml_content = '''<?xml version="1.0" encoding="utf-8"?>
<adaptive-icon xmlns:android="http://schemas.android.com/apk/res/android">
    <background android:drawable="@color/ic_launcher_background"/>
    <foreground android:drawable="@mipmap/ic_launcher_foreground"/>
</adaptive-icon>
'''
    return xml_content

def create_adaptive_icon_background_xml():
    """Create adaptive icon background color XML."""
    xml_content = '''<?xml version="1.0" encoding="utf-8"?>
<resources>
    <color name="ic_launcher_background">#1a237e</color>
</resources>
'''
    return xml_content

def main():
    # Paths
    master_icon = 'assets/master_app_icon.png'
    android_res = 'android/app/src/main/res'
    
    # Check if master icon exists
    if not os.path.exists(master_icon):
        print(f"Error: Master icon not found at {master_icon}")
        print("Trying alternative path...")
        master_icon = 'assets/Master_App_icon.png'
        if not os.path.exists(master_icon):
            print(f"Error: Master icon not found at {master_icon}")
            return
    
    print(f"Using master icon: {master_icon}")
    print("=" * 60)
    
    # Generate standard launcher icons
    print("\n📱 Generating standard launcher icons...")
    for density, size in ICON_SIZES.items():
        output_dir = os.path.join(android_res, density)
        create_directory(output_dir)
        output_path = os.path.join(output_dir, 'ic_launcher.png')
        resize_image(master_icon, output_path, size)
    
    # Generate adaptive icon foregrounds
    print("\n🎨 Generating adaptive icon foregrounds...")
    for density, size in ADAPTIVE_FOREGROUND_SIZES.items():
        output_dir = os.path.join(android_res, density)
        create_directory(output_dir)
        output_path = os.path.join(output_dir, 'ic_launcher_foreground.png')
        resize_image(master_icon, output_path, size)
    
    # Generate adaptive icon backgrounds (solid color)
    print("\n🎨 Generating adaptive icon backgrounds...")
    for density, size in ADAPTIVE_BACKGROUND_SIZES.items():
        output_dir = os.path.join(android_res, density)
        create_directory(output_dir)
        # Create a solid color background image
        bg = Image.new('RGBA', (size, size), (26, 35, 126, 255))  # #1a237e
        output_path = os.path.join(output_dir, 'ic_launcher_background.png')
        bg.save(output_path, 'PNG', optimize=True)
        print(f"✓ Generated {output_path} ({size}x{size})")
    
    # Create adaptive icon XML
    print("\n📄 Creating adaptive icon XML...")
    anydpi_dir = os.path.join(android_res, 'mipmap-anydpi-v26')
    create_directory(anydpi_dir)
    
    # Write ic_launcher.xml
    xml_path = os.path.join(anydpi_dir, 'ic_launcher.xml')
    with open(xml_path, 'w', encoding='utf-8') as f:
        f.write(create_adaptive_icon_xml())
    print(f"✓ Generated {xml_path}")
    
    # Update colors.xml with background color if needed
    colors_xml_path = os.path.join(android_res, 'values', 'colors.xml')
    if os.path.exists(colors_xml_path):
        with open(colors_xml_path, 'r', encoding='utf-8') as f:
            content = f.read()
        if 'ic_launcher_background' not in content:
            # Add the color if it doesn't exist
            content = content.replace(
                '</resources>',
                '    <color name="ic_launcher_background">#1a237e</color>\n</resources>'
            )
            with open(colors_xml_path, 'w', encoding='utf-8') as f:
                f.write(content)
            print(f"✓ Updated {colors_xml_path}")
    else:
        # Create colors.xml if it doesn't exist
        colors_dir = os.path.join(android_res, 'values')
        create_directory(colors_dir)
        with open(colors_xml_path, 'w', encoding='utf-8') as f:
            f.write(create_adaptive_icon_background_xml())
        print(f"✓ Created {colors_xml_path}")
    
    print("\n" + "=" * 60)
    print("✅ Icon generation complete!")
    print("\nGenerated icons:")
    print("  - Standard launcher icons (ic_launcher.png)")
    print("  - Adaptive icon foregrounds (ic_launcher_foreground.png)")
    print("  - Adaptive icon backgrounds (ic_launcher_background.png)")
    print("  - Adaptive icon XML (ic_launcher.xml)")

if __name__ == '__main__':
    main()

