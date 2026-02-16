#!/usr/bin/env python3
"""
Create Google Play Store Feature Graphic (1024x500px PNG)
"""

from PIL import Image, ImageDraw, ImageFont
import os

def create_feature_graphic():
    # Dimensions
    width = 1024
    height = 500
    
    # Create image with deep blue background
    bg_color = (25, 40, 65)  # Deep blue
    img = Image.new('RGB', (width, height), bg_color)
    draw = ImageDraw.Draw(img)
    
    # Draw geometric pattern background (subtle)
    pattern_color = (35, 55, 85)  # Slightly lighter blue
    for i in range(0, width, 40):
        for j in range(0, height, 40):
            if (i + j) % 80 == 0:
                draw.ellipse([i-5, j-5, i+5, j+5], fill=pattern_color, outline=None)
    
    # Draw open book at bottom center
    book_color = (135, 206, 250)  # Light blue
    book_y = height - 120
    book_width = 300
    book_height = 80
    book_x = (width - book_width) // 2
    
    # Book pages
    draw.rectangle([book_x, book_y, book_x + book_width, book_y + book_height], 
                   fill=book_color, outline=(200, 220, 240), width=2)
    
    # Book center line
    draw.line([width // 2, book_y, width // 2, book_y + book_height], 
              fill=(100, 150, 200), width=2)
    
    # Draw mosque silhouette on top of book
    gold_color = (255, 215, 0)  # Gold
    mosque_base_y = book_y - 20
    mosque_center_x = width // 2
    
    # Main dome
    dome_width = 120
    dome_height = 80
    dome_x = mosque_center_x - dome_width // 2
    dome_y = mosque_base_y - dome_height
    
    # Draw dome (semi-circle)
    draw.ellipse([dome_x, dome_y, dome_x + dome_width, dome_y + dome_height * 2], 
                fill=gold_color, outline=None)
    
    # Draw minarets
    minaret_width = 20
    minaret_height = 100
    minaret_top = mosque_base_y - minaret_height
    
    # Left minaret
    left_minaret_x = mosque_center_x - dome_width // 2 - 40
    draw.rectangle([left_minaret_x, minaret_top, left_minaret_x + minaret_width, mosque_base_y], 
                   fill=gold_color, outline=None)
    # Left minaret top
    draw.polygon([(left_minaret_x - 5, minaret_top), 
                  (left_minaret_x + minaret_width // 2, minaret_top - 15),
                  (left_minaret_x + minaret_width + 5, minaret_top)],
                 fill=gold_color, outline=None)
    
    # Right minaret
    right_minaret_x = mosque_center_x + dome_width // 2 + 20
    draw.rectangle([right_minaret_x, minaret_top, right_minaret_x + minaret_width, mosque_base_y], 
                   fill=gold_color, outline=None)
    # Right minaret top
    draw.polygon([(right_minaret_x - 5, minaret_top), 
                  (right_minaret_x + minaret_width // 2, minaret_top - 15),
                  (right_minaret_x + minaret_width + 5, minaret_top)],
                 fill=gold_color, outline=None)
    
    # Crescent moon and star above dome
    crescent_x = mosque_center_x
    crescent_y = minaret_top - 40
    
    # Crescent moon (simplified)
    draw.ellipse([crescent_x - 15, crescent_y - 8, crescent_x + 15, crescent_y + 8], 
                fill=(255, 255, 255), outline=None)
    draw.ellipse([crescent_x - 10, crescent_y - 8, crescent_x + 10, crescent_y + 8], 
                fill=gold_color, outline=None)
    
    # Star (5-pointed, simplified)
    star_size = 8
    star_points = []
    for i in range(10):
        angle = (i * 36 - 90) * 3.14159 / 180
        r = star_size if i % 2 == 0 else star_size // 2
        x = crescent_x + 25 + r * 0.707
        y = crescent_y + r * 0.707
        star_points.append((x, y))
    if len(star_points) >= 3:
        draw.polygon(star_points[:5], fill=gold_color, outline=None)
    
    # App name in English
    try:
        # Try to use a system font
        font_large = ImageFont.truetype("arial.ttf", 48) if os.name == 'nt' else ImageFont.truetype("/System/Library/Fonts/Helvetica.ttc", 48)
        font_medium = ImageFont.truetype("arial.ttf", 32) if os.name == 'nt' else ImageFont.truetype("/System/Library/Fonts/Helvetica.ttc", 32)
    except:
        # Fallback to default font
        font_large = ImageFont.load_default()
        font_medium = ImageFont.load_default()
    
    # English app name
    app_name = "Quran Kareem"
    subtitle = "(4-Page Layout)"
    
    # Get text dimensions
    bbox = draw.textbbox((0, 0), app_name, font=font_large)
    text_width = bbox[2] - bbox[0]
    text_height = bbox[3] - bbox[1]
    
    # Draw app name (centered, top area)
    text_x = (width - text_width) // 2
    text_y = 60
    
    # Draw text with shadow for better visibility
    shadow_offset = 2
    draw.text((text_x + shadow_offset, text_y + shadow_offset), app_name, 
              fill=(0, 0, 0), font=font_large)
    draw.text((text_x, text_y), app_name, fill=gold_color, font=font_large)
    
    # Draw subtitle
    bbox_sub = draw.textbbox((0, 0), subtitle, font=font_medium)
    sub_width = bbox_sub[2] - bbox_sub[0]
    sub_x = (width - sub_width) // 2
    sub_y = text_y + text_height + 10
    
    draw.text((sub_x + shadow_offset, sub_y + shadow_offset), subtitle, 
              fill=(0, 0, 0), font=font_medium)
    draw.text((sub_x, sub_y), subtitle, fill=(255, 255, 255), font=font_medium)
    
    # Load and add logo in center
    logo_paths = ['assets/icon.png', 'assets/master_app_icon.png', 'assets/splash_center_icon.png']
    logo = None
    logo_path_used = None
    
    for logo_path in logo_paths:
        if os.path.exists(logo_path):
            try:
                logo = Image.open(logo_path)
                logo_path_used = logo_path
                break
            except Exception as e:
                print(f"Could not open {logo_path}: {e}")
                continue
    
    if logo:
        # Convert to RGBA if needed
        if logo.mode != 'RGBA':
            logo = logo.convert('RGBA')
        
        # Calculate logo size (about 200-250px wide for center)
        logo_max_size = 250
        logo_ratio = logo.width / logo.height
        if logo.width > logo.height:
            logo_width = logo_max_size
            logo_height = int(logo_max_size / logo_ratio)
        else:
            logo_height = logo_max_size
            logo_width = int(logo_max_size * logo_ratio)
        
        # Resize logo
        logo = logo.resize((logo_width, logo_height), Image.Resampling.LANCZOS)
        
        # Position logo in center (vertically centered between text and book)
        logo_x = (width - logo_width) // 2
        logo_y = sub_y + text_height + 30  # Below subtitle, above book/mosque
        
        # Create a temporary image with transparency for blending
        logo_img = Image.new('RGBA', (width, height), (0, 0, 0, 0))
        logo_img.paste(logo, (logo_x, logo_y), logo)
        
        # Composite the logo onto the main image
        img = Image.alpha_composite(img.convert('RGBA'), logo_img).convert('RGB')
        draw = ImageDraw.Draw(img)
        
        print("Logo added from: " + logo_path_used)
    else:
        print("Warning: Logo not found. Tried: " + ", ".join(logo_paths))
    
    # Feature highlights (right side)
    features = [
        "4-Page Layout",
        "Bookmarks",
        "Easy Navigation"
    ]
    
    feature_y = 180
    feature_x = width - 280
    
    for i, feature in enumerate(features):
        try:
            font_small = ImageFont.truetype("arial.ttf", 24) if os.name == 'nt' else ImageFont.truetype("/System/Library/Fonts/Helvetica.ttc", 24)
        except:
            font_small = ImageFont.load_default()
        
        draw.text((feature_x + shadow_offset, feature_y + i * 35 + shadow_offset), 
                  feature, fill=(0, 0, 0), font=font_small)
        draw.text((feature_x, feature_y + i * 35), feature, 
                  fill=(255, 255, 255), font=font_small)
    
    # Save as PNG
    output_path = "feature-graphic.png"
    img.save(output_path, "PNG", optimize=True)
    print("Feature graphic created: " + output_path)
    print("  Size: " + str(width) + "x" + str(height) + " pixels")
    print("  Format: PNG")
    
    return output_path

if __name__ == "__main__":
    try:
        create_feature_graphic()
    except Exception as e:
        print(f"Error creating feature graphic: {e}")
        print("Make sure Pillow is installed: pip install Pillow")

