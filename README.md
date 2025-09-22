# Artisan Assistant

A comprehensive full-stack platform designed to assist artisans with digital tools for image classification, inventory management, social media automation, audio processing, and augmented reality features.

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Architecture](#architecture)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Running the Application](#running-the-application)
- [API Documentation](#api-documentation)
- [Chrome Extension](#chrome-extension)
- [Docker Deployment](#docker-deployment)
- [Project Structure](#project-structure)
- [Contributing](#contributing)
- [License](#license)

## 🎯 Overview

Artisan Assistant is a comprehensive platform that empowers artisans and craftspeople with modern digital tools. The platform combines AI-powered image classification, inventory management, social media automation, audio processing, and augmented reality features to help artisans digitize and scale their businesses.

### Data Flow Diagram

![Data Flow Diagram](./dfd.svg)

## ✨ Features

### Core Features
- **Image Classification**: AI-powered classification of artisan products and crafts
- **Inventory Management**: Comprehensive inventory tracking and management system
- **Audio Processing**: Speech-to-text transcription and analysis using Google Cloud services
- **Social Media Automation**: Automated content creation and posting for various platforms
- **Augmented Reality**: AR features for product visualization and interaction
- **Translation Services**: Multi-language support for global artisan communities
- **Text Highlighting**: Advanced text processing and highlighting capabilities

### Platform Components
- **Web Application**: Modern React-based frontend with responsive design
- **REST API**: FastAPI-based backend with comprehensive endpoints
- **Chrome Extension**: Browser extension for enhanced functionality
- **Mobile Support**: Responsive design for mobile and tablet devices
- **Instructions Page**: Friendly, step-by-step guide for asset creation with quirky, helpful tone

## 🏗️ Architecture

The project follows a microservices architecture with the following components:

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Backend       │    │   Chrome        │
│   (React/Vite)  │◄──►│   (FastAPI)     │◄──►│   Extension     │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                                │
                                ▼
                       ┌─────────────────┐
                       │   Google Cloud  │
                       │   Services      │
                       │   - Speech API  │
                       │   - Storage     │
                       │   - Vertex AI   │
                       └─────────────────┘
```

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v16 or higher)
- **Python** (v3.9 or higher)
- **Docker** (optional, for containerized deployment)
- **Google Cloud Account** (for AI services)
- **Git**

## 🎨 Quick Start Guide

### How to Create Your First Asset

Ready to turn your creative vision into reality? Here's how to get started with asset creation:

1. **Click the "Create Asset" Button** 🎯
   - Head to the main page and hit that beautiful "Create Asset" button
   - Make sure you're logged in first to save your amazing creations!

2. **Fill in Your Details** 📝
   - Upload your reference image (we recommend using photos from [memeraki.com](https://memeraki.com) for testing - it works like a charm!)
   - Describe what you want to create and your preferences
   - The more details, the better the result!

3. **Wait for the Magic** ⏰
   - Asset generation typically takes 5-10 minutes
   - Grab a coffee, stretch your legs, or work on another project while you wait
   - We'll notify you when it's ready!

4. **Enjoy Your Creation!** 🎉
   - Download, share, or use your custom asset in projects
   - We're pretty proud of what our AI can create!

> 💡 **Pro Tip**: For the best results, use high-quality reference images and be specific in your descriptions. Good art takes time, so patience is key!

## 🚀 Installation

### 1. Clone the Repository

```bash
git clone <repository-url>
cd Artisan_Assistant
```

### 2. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt
```

### 3. Frontend Setup

```bash
# Navigate to frontend directory
cd ../frontend

# Install dependencies
npm install
```

### 4. Chrome Extension Setup

```bash
# Navigate to chrome extension directory
cd ../artisan-chrome-extension

# Install dependencies
npm install

# Build the extension
npm run build
```

## ⚙️ Configuration

### 1. Google Cloud Setup

1. Create a Google Cloud project
2. Enable the following APIs:
   - Speech-to-Text API
   - Cloud Storage API
   - Vertex AI API

3. Create a service account and download the credentials JSON file
4. Place the credentials file in the `credentials/` directory

### 2. Environment Variables

Create a `.env` file in the backend directory:

```env
# Google Cloud Configuration
GOOGLE_APPLICATION_CREDENTIALS=path/to/your/credentials.json
GOOGLE_CLOUD_PROJECT=your-project-id
GCS_BUCKET_NAME=your-bucket-name

# Database Configuration
DATABASE_URL=sqlite:///./app.db

# API Configuration
API_HOST=0.0.0.0
API_PORT=8000
```

### 3. Frontend Configuration

Create a `.env` file in the frontend directory:

```env
VITE_API_BASE_URL=http://localhost:8000
VITE_GOOGLE_CLOUD_PROJECT=your-project-id
```

## 🏃‍♂️ Running the Application

### Development Mode

#### 1. Start the Backend

```bash
cd backend
source venv/bin/activate  # On Windows: venv\Scripts\activate
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

#### 2. Start the Frontend

```bash
cd frontend
npm run dev
```

#### 3. Load Chrome Extension (Optional)

1. Open Chrome and go to `chrome://extensions/`
2. Enable "Developer mode"
3. Click "Load unpacked" and select the `artisan-chrome-extension` directory

### Production Mode

#### Using Docker

```bash
# Build and run with Docker Compose
docker-compose up --build
```

## 📚 API Documentation

Once the backend is running, you can access the interactive API documentation at:

- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

### Key API Endpoints

- `POST /artisan/analyze_audio` - Analyze audio files for artisan information
- `POST /artisan/transcribe` - Transcribe audio to text
- `GET /inventory/` - Get inventory items
- `POST /inventory/` - Add new inventory item
- `POST /social_media/` - Create social media content
- `GET /ar/` - AR-related endpoints

## 🔧 Chrome Extension

The Chrome extension provides additional functionality for artisans:

### Features
- Quick access to artisan tools
- Browser-based audio recording
- Direct integration with the main platform

### Installation
1. Build the extension: `npm run build`
2. Load unpacked extension in Chrome
3. Pin the extension to your toolbar for easy access

## 🐳 Docker Deployment

### Using Docker Compose

```bash
# Build and start all services
docker-compose up --build

# Run in detached mode
docker-compose up -d --build

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

### Individual Docker Builds

```bash
# Build backend
cd backend
docker build -t artisan-backend .

# Build frontend
cd frontend
docker build -t artisan-frontend .

# Run backend
docker run -p 8000:8000 artisan-backend

# Run frontend
docker run -p 3000:3000 artisan-frontend
```

## 📁 Project Structure

```
Artisan_Assistant/
├── backend/                    # FastAPI backend
│   ├── routers/               # API route handlers
│   │   ├── audio_service.py   # Audio processing endpoints
│   │   ├── artisan.py         # Core artisan endpoints
│   │   ├── inventory.py       # Inventory management
│   │   ├── social_media.py    # Social media automation
│   │   ├── ar.py              # Augmented reality features
│   │   └── ...
│   ├── services/              # Business logic services
│   │   ├── artisan_agent/     # AI agent services
│   │   ├── inventory/         # Inventory services
│   │   ├── social_media/      # Social media services
│   │   └── ...
│   ├── init/                  # Database initialization
│   ├── utils/                 # Utility functions
│   ├── main.py                # FastAPI application entry point
│   └── requirements.txt       # Python dependencies
├── frontend/                   # React frontend
│   ├── src/
│   │   ├── components/        # React components
│   │   ├── scenes/            # Page components
│   │   ├── config/            # Configuration files
│   │   └── ...
│   ├── public/                # Static assets
│   ├── package.json           # Node.js dependencies
│   └── vite.config.js         # Vite configuration
├── artisan-chrome-extension/   # Chrome extension
│   ├── src/                   # Extension source code
│   ├── public/                # Extension assets
│   ├── manifest.json          # Extension manifest
│   └── package.json           # Extension dependencies
├── credentials/                # Google Cloud credentials
├── scripts/                    # Utility scripts
├── docker-compose.yaml         # Docker Compose configuration
└── README.md                   # This file
```

## 🔧 Development

### Adding New Features

1. **Backend**: Add new routes in `backend/routers/`
2. **Frontend**: Add new components in `frontend/src/components/`
3. **Services**: Add business logic in `backend/services/`

### Testing

```bash
# Backend tests
cd backend
python -m pytest

# Frontend tests
cd frontend
npm test
```

### Code Style

- **Backend**: Follow PEP 8 guidelines
- **Frontend**: Use Prettier and ESLint
- **Commits**: Use conventional commit messages

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines

- Write clear, documented code
- Add tests for new features
- Update documentation as needed
- Follow the existing code style
- Ensure all tests pass before submitting

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

If you encounter any issues or have questions:

1. Check the [Issues](https://github.com/your-repo/issues) page
2. Create a new issue with detailed information
3. Contact the development team

## 🙏 Acknowledgments

- Google Cloud Platform for AI services
- FastAPI for the excellent Python web framework
- React and Vite for the modern frontend stack
- The artisan community for inspiration and feedback

---

**Made with ❤️ for the artisan community**
