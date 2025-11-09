#!/usr/bin/env python3
"""
Quran Safa Image Optimizer
Optimizes JPEG images to reduce file size while maintaining quality for text readability.
Target: Reduce from ~500MB to ~40MB total (12.5x reduction)
"""

import os
import sys
from PIL import Image
from PIL import ImageFile
import argparse
from pathlib import Path

# Allow loading truncated images
ImageFile.LOAD_TRUNCATED_IMAGES = True

def get_folder_size(folder_path):
    """Calculate total size of all files in folder."""
    total_size = 0
    for dirpath, dirnames, filenames in os.walk(folder_path):
        for filename in filenames:
            filepath = os.path.join(dirpath, filename)
            if os.path.isfile(filepath):
                total_size += os.path.getsize(filepath)
    return total_size

def format_size(size_bytes):
    """Format bytes to human readable format."""
    for unit in ['B', 'KB', 'MB', 'GB']:
        if size_bytes < 1024.0:
            return f"{size_bytes:.2f} {unit}"
        size_bytes /= 1024.0
    return f"{size_bytes:.2f} TB"

def optimize_image(input_path, output_path, target_size_kb=None, max_width=None, quality=85, optimize=True):
    """
    Optimize a single image.
    
    Args:
        input_path: Path to input image
        output_path: Path to output image
        target_size_kb: Target file size in KB (optional)
        max_width: Maximum width in pixels (maintains aspect ratio)
        quality: JPEG quality (1-100, higher = better quality)
        optimize: Use PIL optimize flag
    
    Returns:
        tuple: (original_size, optimized_size, success)
    """
    try:
        # Open image
        with Image.open(input_path) as img:
            original_size = os.path.getsize(input_path)
            original_width, original_height = img.size
            
            # Convert to RGB if necessary (remove alpha channel)
            if img.mode in ('RGBA', 'LA', 'P'):
                # Create white background for transparent images
                rgb_img = Image.new('RGB', img.size, (255, 255, 255))
                if img.mode == 'P':
                    img = img.convert('RGBA')
                rgb_img.paste(img, mask=img.split()[-1] if img.mode in ('RGBA', 'LA') else None)
                img = rgb_img
            elif img.mode != 'RGB':
                img = img.convert('RGB')
            
            # Resize if max_width is specified and image is larger
            if max_width and original_width > max_width:
                aspect_ratio = original_height / original_width
                new_height = int(max_width * aspect_ratio)
                # Use high-quality resampling for text/images
                img = img.resize((max_width, new_height), Image.Resampling.LANCZOS)
                print(f"  Resized: {original_width}x{original_height} -> {max_width}x{new_height}")
            
            # If target size is specified, adjust quality to meet it
            if target_size_kb:
                # Binary search for optimal quality
                min_quality = 50
                max_quality = 95
                best_quality = quality
                best_size = float('inf')
                
                for attempt in range(10):  # Max 10 attempts
                    # Save to temporary location to check size
                    temp_path = output_path + '.tmp'
                    img.save(temp_path, 'JPEG', quality=quality, optimize=optimize, progressive=True)
                    temp_size = os.path.getsize(temp_path)
                    temp_size_kb = temp_size / 1024
                    
                    if abs(temp_size_kb - target_size_kb) < abs(best_size - target_size_kb):
                        best_quality = quality
                        best_size = temp_size_kb
                    
                    if temp_size_kb <= target_size_kb * 1.05:  # Within 5% of target
                        quality = best_quality
                        os.remove(temp_path)
                        break
                    elif temp_size_kb > target_size_kb:
                        max_quality = quality
                        quality = (min_quality + quality) // 2
                    else:
                        min_quality = quality
                        quality = (quality + max_quality) // 2
                    
                    if os.path.exists(temp_path):
                        os.remove(temp_path)
                
                if best_quality != quality:
                    quality = best_quality
            
            # Save optimized image
            # Use progressive JPEG for better compression and web compatibility
            save_kwargs = {
                'format': 'JPEG',
                'quality': quality,
                'optimize': optimize,
                'progressive': True,
            }
            
            # On Windows, save to temp file first then replace to avoid file lock issues
            if str(output_path) == str(input_path):
                temp_output = str(output_path) + '.opt.tmp'
                img.save(temp_output, **save_kwargs)
                # Close the original image before replacing
                img.close()
                if os.path.exists(output_path):
                    os.remove(output_path)
                os.rename(temp_output, output_path)
            else:
                img.save(output_path, **save_kwargs)
            
            optimized_size = os.path.getsize(output_path)
            
            reduction = ((original_size - optimized_size) / original_size) * 100
            
            return (original_size, optimized_size, True)
            
    except Exception as e:
        print(f"  Error optimizing {input_path}: {str(e)}")
        return (0, 0, False)

def main():
    parser = argparse.ArgumentParser(description='Optimize Quran Safa images')
    parser.add_argument('--input', '-i', default='assets/quran_safa',
                        help='Input folder path (default: assets/quran_safa)')
    parser.add_argument('--output', '-o', default=None,
                        help='Output folder path (default: same as input, creates backup)')
    parser.add_argument('--target-size', '-t', type=float, default=40.0,
                        help='Target total folder size in MB (default: 40)')
    parser.add_argument('--max-width', '-w', type=int, default=2000,
                        help='Maximum image width in pixels (default: 2000, maintains aspect ratio)')
    parser.add_argument('--quality', '-q', type=int, default=80,
                        help='JPEG quality 1-100 (default: 80, higher = better quality)')
    parser.add_argument('--backup', '-b', action='store_true',
                        help='Create backup of original images')
    parser.add_argument('--no-backup', action='store_true',
                        help='Skip backup (overwrites originals)')
    
    args = parser.parse_args()
    
    input_folder = Path(args.input)
    if not input_folder.exists():
        print(f"Error: Input folder '{input_folder}' does not exist!")
        sys.exit(1)
    
    # Determine output folder
    if args.output:
        output_folder = Path(args.output)
        output_folder.mkdir(parents=True, exist_ok=True)
        create_backup = False
    else:
        output_folder = input_folder
        create_backup = args.backup and not args.no_backup
    
    # Get all JPEG files
    image_files = sorted([f for f in input_folder.glob('*.jpg')] + 
                         [f for f in input_folder.glob('*.jpeg')])
    
    if not image_files:
        print(f"No JPEG images found in '{input_folder}'")
        sys.exit(1)
    
    print(f"Found {len(image_files)} images to optimize")
    print(f"Input folder: {input_folder}")
    print(f"Output folder: {output_folder}")
    
    # Calculate current folder size
    current_size = get_folder_size(input_folder)
    current_size_mb = current_size / (1024 * 1024)
    target_size_bytes = args.target_size * 1024 * 1024
    target_size_per_image = target_size_bytes / len(image_files)
    target_size_per_image_kb = target_size_per_image / 1024
    
    print(f"\nCurrent folder size: {format_size(current_size)} ({current_size_mb:.2f} MB)")
    print(f"Target folder size: {format_size(target_size_bytes)} ({args.target_size:.2f} MB)")
    print(f"Target per image: {format_size(target_size_per_image)} ({target_size_per_image_kb:.2f} KB)")
    print(f"Max width: {args.max_width}px")
    print(f"Initial quality: {args.quality}")
    print()
    
    # Create backup if requested
    if create_backup:
        backup_folder = input_folder.parent / f"{input_folder.name}_backup"
        print(f"Creating backup to: {backup_folder}")
        backup_folder.mkdir(exist_ok=True)
        for img_file in image_files:
            backup_path = backup_folder / img_file.name
            if not backup_path.exists():
                import shutil
                shutil.copy2(img_file, backup_path)
        print("Backup created!\n")
    
    # Optimize images
    total_original = 0
    total_optimized = 0
    successful = 0
    failed = 0
    
    for i, img_file in enumerate(image_files, 1):
        print(f"[{i}/{len(image_files)}] Processing {img_file.name}...", end=' ')
        
        if output_folder == input_folder:
            output_path = img_file
        else:
            output_path = output_folder / img_file.name
        
        original_size, optimized_size, success = optimize_image(
            str(img_file),
            str(output_path),
            target_size_kb=target_size_per_image_kb,
            max_width=args.max_width,
            quality=args.quality,
            optimize=True
        )
        
        if success:
            total_original += original_size
            total_optimized += optimized_size
            successful += 1
            reduction = ((original_size - optimized_size) / original_size) * 100
            print(f"OK {format_size(original_size)} -> {format_size(optimized_size)} ({reduction:.1f}% reduction)")
        else:
            failed += 1
            print(f"FAILED")
    
    # Final statistics
    print("\n" + "="*60)
    print("OPTIMIZATION COMPLETE")
    print("="*60)
    print(f"Successfully optimized: {successful}/{len(image_files)}")
    if failed > 0:
        print(f"Failed: {failed}")
    print()
    print(f"Original total size: {format_size(total_original)} ({total_original / (1024*1024):.2f} MB)")
    print(f"Optimized total size: {format_size(total_optimized)} ({total_optimized / (1024*1024):.2f} MB)")
    
    if total_original > 0:
        total_reduction = ((total_original - total_optimized) / total_original) * 100
        print(f"Total reduction: {total_reduction:.1f}%")
        print(f"Space saved: {format_size(total_original - total_optimized)}")
    
    # Check if target was met
    if total_optimized <= target_size_bytes * 1.1:  # Within 10% of target
        print(f"\n[SUCCESS] Target size achieved! ({format_size(total_optimized)} <= {format_size(target_size_bytes)})")
    else:
        print(f"\n[WARNING] Target size not fully met. Consider:")
        print(f"  - Reducing max-width (currently {args.max_width}px)")
        print(f"  - Reducing quality (currently {args.quality})")
        print(f"  - Increasing target size")

if __name__ == '__main__':
    main()

