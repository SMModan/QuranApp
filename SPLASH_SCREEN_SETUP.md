# Splash Screen Setup Instructions

## Overview
Your Quran App Expo project is now configured with splash screen support for both Android and iOS devices.

## Image Requirements
You need to replace the placeholder files with your actual splash screen images:

### Files to Replace:
1. `assets/splash-screen-1.png` - Main splash screen image
2. `assets/splash-screen-2.png` - Alternative splash screen (optional)
3. `assets/splash-screen-3.png` - Alternative splash screen (optional)

### Image Specifications:
- **Format**: PNG
- **Orientation**: Portrait (vertical)
- **Recommended Size**: 1080x1920 pixels (9:16 aspect ratio)
- **Background Color**: Deep blue (#1a237e) to match the Islamic theme
- **Content**: Golden mosque silhouette, Arabic text "القرآن الكريم", geometric patterns

## Current Configuration
The `app.json` file has been configured with:
- Global splash screen settings
- iOS-specific splash screen settings
- Android-specific splash screen settings
- Deep blue background color (#1a237e) to match Islamic theme
- "contain" resize mode for proper scaling

## Testing
After adding your images:
1. Run `npx expo start`
2. Test on both Android and iOS devices
3. The splash screen should display during app startup

## Notes
- The splash screen will show while the app is loading
- Images should be optimized for mobile devices
- Consider creating different sizes for different screen densities if needed
