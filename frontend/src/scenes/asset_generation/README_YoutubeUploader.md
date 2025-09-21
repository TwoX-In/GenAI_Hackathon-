# YouTube Uploader Component

A brutalist-styled React component for uploading artisan videos to YouTube with automatic status checking and progress tracking.

## Features

- **Smart Status Detection**: Automatically checks if video is already uploaded
- **Progress Visualization**: Shows upload steps with animated progress indicators
- **Brutalist Design**: Matches the website's bold, geometric design theme
- **Error Handling**: Graceful error handling with user-friendly messages
- **URL Management**: Copy and share functionality for uploaded videos

## Usage

```jsx
import { YoutubeUploader } from "./YoutubeUploader";

// In your component
<YoutubeUploader uid={productId} />
```

## Component States

### 1. Checking Status
- Shows loading animation while checking if video exists on YouTube
- Calls `/social_media/youtube_status/{uid}` endpoint

### 2. Already Uploaded
- Displays YouTube URL with copy and share buttons
- Shows "Watch on YouTube" link
- Green color scheme indicates success

### 3. Ready to Upload
- Shows upload button with feature highlights
- Red YouTube-themed color scheme
- Lists benefits (thumbnail generation, metadata optimization, etc.)

### 4. Uploading
- Animated progress through 6 upload steps:
  1. Preparing video for upload
  2. Generating metadata and keywords
  3. Creating custom thumbnail
  4. Uploading to YouTube
  5. Publishing video
  6. Upload complete
- Orange color scheme with progress animations

### 5. Error State
- Red error message display
- Retry functionality available

## API Endpoints

### GET `/social_media/youtube_status/{uid}`
Returns upload status for a video:
```json
{
  "uploaded": true,
  "url": "https://www.youtube.com/watch?v=VIDEO_ID"
}
```

### POST `/social_media/upload_video`
Uploads video to YouTube:
```json
{
  "uid": 123
}
```
Returns YouTube URL string on success.

## Design System

The component follows the website's brutalist design principles:

- **Bold borders**: 4px black borders on all elements
- **Drop shadows**: Offset shadows (8px_8px_0px_0px_rgba(0,0,0,1))
- **Bright colors**: Yellow, green, red, orange, purple accents
- **Heavy typography**: Font-black, uppercase text
- **Interactive feedback**: Button press animations (translate + shadow removal)

## Dependencies

- React hooks (useState, useEffect)
- Request utility for API calls
- Navigator API for clipboard and sharing

## Integration

The component is integrated into the asset generation page (`asset_gen.jsx`) within the "Output Videos" tab, appearing below the video player when videos are available.