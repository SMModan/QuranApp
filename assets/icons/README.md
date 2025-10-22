# Icons Folder

This folder contains all the icons used in the Quran App.

## Icon Types

Based on the home screen design, the following icons are needed:

### Navigation Icons
- **Hamburger Menu Icon**: Three horizontal lines for the side menu toggle
- **Arrow Icon**: Right-pointing arrow for navigation actions

### Content Icons
- **Book Icon**: For Resume/Biography section
- **Bookmark Icon**: For Bookmarks section  
- **Star Icon**: For Favourites section
- **Document Icon**: For Index sections (Surah, Juz/Para, Go to Page)

### App Icons
- **Quran Book Icon**: Main app icon with Arabic calligraphy
- **Circular Emblem**: Islamic calligraphy symbol for book covers

## Color Scheme

### Primary Colors
- **Dark Blue**: `#1a237e` (Header background, borders, text)
- **Light Blue**: `#e0f2f7` (Main background)
- **White**: `#FFFFFF` (Text on dark backgrounds, card backgrounds)
- **Golden**: `#FFD700` (Star icon, highlights)

### Secondary Colors
- **Light Gray**: `#cccccc` (Document icons)
- **Medium Gray**: `#666666` (Secondary text)
- **Light Gray**: `#999999` (Description text)

## Icon Specifications

### Dimensions
- **Header Icons**: 24x24px (1x), 48x48px (2x), 72x72px (3x)
- **Card Icons**: 50x50px base size, responsive scaling
- **App Icons**: 1024x1024px (for app store)

### Format
- **PNG**: For raster icons with transparency
- **SVG**: For scalable vector icons (preferred)

## Usage in Components

Icons are used in:
- `CommonHeader.js`: Hamburger menu icon
- `HomeScreen.js`: Card icons for each section
- `SideMenu.js`: Menu item icons
- App icon and splash screen assets

## Adding New Icons

1. Add icon files to this folder
2. Update component imports if needed
3. Follow the naming convention: `icon-name@1x.png`, `icon-name@2x.png`, `icon-name@3x.png`
4. Update this README with new icon information

