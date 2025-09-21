# Technology Stack

## Backend

- **Framework**: FastAPI (Python)
- **Database**: SQLAlchemy ORM
- **AI/ML**: Google Gemini AI, Vertex AI, spaCy, scikit-learn, transformers
- **Cloud Services**: Google Cloud Platform (Storage, Speech, Translation, Text-to-Speech)
- **Image Processing**: PIL, OpenCV-related libraries
- **Data Processing**: pandas, numpy, PyArrow
- **Authentication**: Authlib
- **Web Scraping**: BeautifulSoup, Selenium

## Frontend

- **Framework**: React 19 with Vite
- **Styling**: Tailwind CSS 4.x
- **UI Components**: Radix UI primitives
- **Forms**: React Hook Form with Zod validation
- **HTTP Client**: Axios
- **Routing**: React Router DOM
- **Speech**: React Speech Recognition

## Development Tools

- **Build System**: Vite (frontend), Poetry (backend dependency management)
- **Linting**: ESLint
- **Type Checking**: TypeScript support configured

## Common Commands

### Backend

```bash
# Install dependencies
pip install -r requirements.txt

# Run development server
uvicorn main:app --reload --host 0.0.0.0 --port 8080
```

### Frontend

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Lint code
npm run lint
```

## Environment Setup

- Backend runs on port 8080
- Frontend runs on port 5173 (Vite default)
- CORS configured for localhost:5173
- Requires Google Cloud credentials and API keys
