# Artisan Image Analyzer Chrome Extension

A Chrome extension that uses AI to analyze artwork and images on hover, providing detailed information about style, artist, medium, origin, price, themes, and colors.

## Features

- **Hover Analysis**: Automatically analyze any image by hovering over it for 1 second
- **AI-Powered**: Uses your localhost:8080/classifier/trial_classify API endpoint
- **Retro Design**: Beautiful retro-style popup with Tailwind CSS
- **Detailed Results**: Shows style, artist, medium, origin, price, themes, and colors
- **Copy Results**: Easy copy-to-clipboard functionality
- **Test Mode**: Built-in test interface in the extension popup

## Installation

1. **Build the Extension**:
   ```bash
   npm install
   npm run build
   ```

2. **Load in Chrome**:
   - Open Chrome and go to `chrome://extensions/`
   - Enable "Developer mode" (toggle in top right)
   - Click "Load unpacked"
   - Select the `build` folder from this project

3. **Start Your API Server**:
   - Make sure your API server is running on `localhost:8080`
   - The endpoint `/classifier/trial_classify` should accept POST requests with image files

## Usage

### Hover Analysis
1. Navigate to any webpage with images
2. Hover over any image for 1 second
3. A popup will appear showing the AI analysis results
4. Click the "COPY RESULTS" button to copy the JSON data

### Test Mode
1. Click the extension icon in Chrome toolbar
2. Upload a test image using the file input
3. Click "TEST ANALYZE" to analyze the image
4. View results and copy them if needed

## API Response Format

The extension expects your API to return JSON in this format:

```json
{
  "style": "Impressionist",
  "artist": "Claude Monet",
  "themes": "Nature, Light, Water",
  "color": "Blue, Green, Yellow",
  "medium": "Oil on Canvas",
  "origin": "France, 1872",
  "price": "25000000",
  "status": "success"
}
```

## Technical Details

### Files Structure
- `public/manifest.json` - Chrome extension manifest
- `public/content.js` - Content script that runs on all pages
- `src/main.js` - Popup interface code
- `src/style.css` - Additional styling
- `build/` - Production build files

### Permissions
- `activeTab` - Access to the current tab for image analysis
- `storage` - Store extension settings
- `http://localhost:8080/*` - Access to your API server
- `<all_urls>` - Access to analyze images on any website

### Content Script Features
- Detects image hover events with 1-second delay
- Handles CORS issues when possible
- Converts images to blobs for API calls
- Shows loading states and error handling
- Responsive popup positioning

## Troubleshooting

### Common Issues

1. **API Not Responding**:
   - Ensure your API server is running on localhost:8080
   - Check that the `/classifier/trial_classify` endpoint exists
   - Verify CORS settings allow requests from chrome-extension://

2. **Images Not Analyzing**:
   - Some images may have CORS restrictions
   - Very small images (< 50px) are ignored
   - Try the test mode in the popup first

3. **Extension Not Loading**:
   - Make sure you selected the `build` folder, not the root folder
   - Check Chrome's developer console for errors
   - Reload the extension after making changes

## Development

To modify the extension:

1. Make changes to source files
2. Run `npm run build`
3. Go to `chrome://extensions/` and click the reload button on your extension
4. Test the changes

## Design

The extension uses a retro brutalist design with:
- Bold black borders and shadows
- Bright colors (purple, pink, blue, green)
- Tilted elements and animations
- Chunky buttons with hover effects
- Tailwind CSS for styling
