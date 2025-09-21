# Email Generation and Preview Functionality

## Overview
This implementation adds email generation and preview functionality to the AI Tools page, allowing users to generate and preview HTML marketing emails based on product UIDs.

## Features

### Backend
- **New Endpoint**: `GET /social_media/get-email/{uid}`
  - Retrieves generated email HTML for a given UID
  - Returns structured response with success status, UID, and email HTML
  - Handles errors gracefully with appropriate HTTP status codes

### Frontend
- **New AI Tools Tab**: "Email Marketing" tab added to the AI Tools page
- **Email Preview Component**: Interactive email preview with multiple viewing modes
- **UID-based Query**: Users can enter a product UID to generate and preview emails

## How to Use

### 1. Access the AI Tools Page
Navigate to `/ai-tools` in your application.

### 2. Select Email Marketing Tab
Click on the "Email Marketing" tab (orange colored with mail icon).

### 3. Enter Product UID
- Enter a valid product UID in the input field
- The UID should correspond to an existing product in your system

### 4. Generate Email
- Click the "GENERATE EMAIL MARKETING" button
- The system will fetch the email HTML for the specified UID

### 5. Preview Email
The email preview component provides several features:

#### View Modes
- **Preview Mode**: Shows the rendered HTML email as it would appear to recipients
- **Code Mode**: Displays the raw HTML code for technical review

#### Actions Available
- **Open in New Tab**: Opens the email in a new browser tab for full-screen viewing
- **Download HTML**: Downloads the email as an HTML file
- **Copy HTML**: Copies the HTML code to clipboard

## Technical Details

### Backend Implementation
```python
@router.get("/get-email/{uid}")
def get_email(uid: int):
    """Retrieve generated email HTML by UID"""
    try:
        email_html = email.generate_emails(uid)
        return {
            "success": True,
            "uid": uid,
            "email_html": email_html
        }
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to retrieve email for UID {uid}: {str(e)}"
        )
```

### Frontend Components
- **EmailPreview.jsx**: Main preview component with view modes and actions
- **AI Tools Integration**: Seamlessly integrated into existing AI tools page
- **Responsive Design**: Works on both desktop and mobile devices

### Email Styling
The generated emails use a neobrutalism design theme with:
- Bold typography and high contrast colors
- Box shadows and borders for visual impact
- Responsive layout for various screen sizes
- Product images and metadata integration

## Error Handling
- Invalid UIDs return appropriate error messages
- Network errors are handled gracefully
- Loading states provide user feedback
- Error messages are displayed in the UI

## Future Enhancements
- Email template customization options
- Batch email generation for multiple products
- Email analytics and tracking
- Integration with email marketing services
- A/B testing for different email versions
