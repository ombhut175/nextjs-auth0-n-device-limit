# Missing SEO Assets

The following assets are referenced in the SEO configuration but don't exist yet. Until these are created, you may see 404 errors in the browser console (which won't affect functionality but should be addressed).

## Required Assets

### 1. Open Graph Image
**File**: `/public/og-image.png`
**Dimensions**: 1200 x 630 pixels
**Purpose**: Social media preview image (Facebook, Twitter, LinkedIn)
**Format**: PNG or JPG
**Recommended**: High-quality image with your brand/logo and tagline

### 2. Organization Logo
**File**: `/public/logo.png`
**Dimensions**: 512 x 512 pixels (square)
**Purpose**: Organization schema for search engines
**Format**: PNG with transparent background
**Recommended**: Your brand logo

### 3. Apple Touch Icon
**File**: `/public/apple-touch-icon.png`
**Dimensions**: 180 x 180 pixels
**Purpose**: iOS home screen icon
**Format**: PNG
**Recommended**: Your app icon or logo

### 4. Favicon (Already exists)
**File**: `/public/favicon.ico`
**Status**: ✅ Should already exist from Next.js template

## Quick Fix Options

### Option 1: Create Placeholder Images
Create simple placeholder images with your brand colors and text.

### Option 2: Use Existing SVG Assets
You can temporarily use the existing SVG files by updating `src/lib/seo/config.ts`:

```typescript
export const siteConfig = {
  // ... other config
  ogImage: '/next.svg', // Temporary - use existing asset
  // ...
  organization: {
    // ...
    logo: '/next.svg', // Temporary - use existing asset
  },
};
```

### Option 3: Remove References Temporarily
Comment out the icon references in `src/lib/seo/config.ts` until assets are ready:

```typescript
icons: {
  icon: '/favicon.ico',
  shortcut: '/favicon.ico',
  // apple: '/apple-touch-icon.png', // Uncomment when asset is ready
},
```

## Creating Assets

### Using Design Tools
- **Figma**: Create artboards with exact dimensions
- **Canva**: Use social media templates
- **Photoshop**: Export at 2x resolution for retina displays

### Using Online Generators
- **Favicon Generator**: https://realfavicongenerator.net/
- **OG Image Generator**: https://www.opengraph.xyz/
- **Social Media Image Sizes**: https://sproutsocial.com/insights/social-media-image-sizes-guide/

### Quick Command Line (ImageMagick)
```bash
# Create placeholder og-image
convert -size 1200x630 xc:#000000 -fill white -pointsize 72 -gravity center -annotate +0+0 "NGuard" public/og-image.png

# Create placeholder logo
convert -size 512x512 xc:#000000 -fill white -pointsize 48 -gravity center -annotate +0+0 "NG" public/logo.png

# Create placeholder apple-touch-icon
convert -size 180x180 xc:#000000 -fill white -pointsize 36 -gravity center -annotate +0+0 "NG" public/apple-touch-icon.png
```

## Impact of Missing Assets

### Current Impact
- ❌ 404 errors in browser console
- ❌ Broken images in social media previews
- ❌ Missing iOS home screen icon
- ✅ SEO metadata still works correctly
- ✅ Search engines can still crawl and index
- ✅ No functional issues with the application

### After Adding Assets
- ✅ Clean browser console
- ✅ Professional social media previews
- ✅ Proper iOS home screen icon
- ✅ Complete SEO implementation

## Priority

**Low Priority**: The application works perfectly without these assets. They only affect visual presentation in social media shares and iOS home screens.

**Recommended Timeline**: Create these assets before production launch or when sharing links on social media.
