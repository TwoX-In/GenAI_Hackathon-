# Project Structure

## Root Directory Layout
```
├── backend/           # FastAPI Python backend
├── frontend/          # React + Vite frontend
├── credentials/       # Service account keys and API credentials
├── scripts/          # Data processing and utility scripts
└── .kiro/            # Kiro AI assistant configuration
```

## Backend Structure (`backend/`)
```
backend/
├── main.py                    # FastAPI app entry point with CORS and router setup
├── requirements.txt           # Python dependencies
├── pyvenv.cfg                # Virtual environment configuration
├── service_key.json          # Google Cloud service account key
├── routers/                  # API route handlers
│   ├── artisan.py           # Content generation endpoints
│   ├── image.py             # Image upload and processing
│   ├── classifier.py        # ML classification endpoints
│   ├── inventory.py         # Product management
│   ├── metadata.py          # Metadata operations
│   ├── storage.py           # Cloud storage operations
│   └── text_highlighter.py  # Text processing
├── services/                 # Business logic layer
│   ├── artisan_agent/       # AI content generation
│   ├── image_classification/ # ML image processing
│   ├── inventory/           # Product management logic
│   ├── metadata/            # Metadata handling
│   ├── social_media/        # Social media integrations
│   ├── storage/             # Cloud storage utilities
│   └── text_highlighter/    # Text analysis services
├── init/                    # Database initialization
├── utils/                   # Shared utilities
├── lib/                     # External libraries
├── image/                   # Image processing modules
├── audio-gen/               # Audio generation services
├── fine_tuning/             # ML model fine-tuning
└── bin/                     # Executable scripts
```

## Frontend Structure (`frontend/`)
```
frontend/
├── src/
│   ├── components/          # Reusable React components
│   ├── scenes/             # Page-level components
│   ├── lib/                # Utility functions
│   ├── config/             # Configuration files
│   ├── request/            # API client functions
│   ├── loader/             # Data loading utilities
│   └── assets/             # Static assets
├── public/                 # Public static files
├── package.json            # Node.js dependencies and scripts
├── vite.config.js          # Vite build configuration
├── tailwind.config.js      # Tailwind CSS configuration
├── components.json         # UI component configuration
└── tsconfig.json           # TypeScript configuration
```

## Architecture Patterns

### Backend Patterns
- **Router-Service Pattern**: Routes handle HTTP concerns, services contain business logic
- **Dependency Injection**: Services injected into routers
- **Async/Await**: All I/O operations use async patterns
- **Modular Services**: Each feature area has its own service module

### Frontend Patterns
- **Component-Scene Architecture**: Reusable components + page-level scenes
- **Custom Hooks**: Logic extraction into reusable hooks
- **Form Validation**: React Hook Form + Zod schema validation
- **API Layer**: Centralized request handling in `request/` directory

### File Naming Conventions
- **Backend**: Snake_case for Python files and modules
- **Frontend**: camelCase for JavaScript/TypeScript, PascalCase for React components
- **Configs**: Lowercase with extensions (e.g., `vite.config.js`)

### Import Patterns
- **Backend**: Relative imports within modules, absolute for cross-module
- **Frontend**: Absolute imports from `src/`, relative for local files