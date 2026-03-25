# WebSearch

> A real-time chat application with message streaming capabilities

[![Python](https://img.shields.io/badge/Python-3.7+-blue.svg)](https://www.python.org/downloads/)
[![Flask](https://img.shields.io/badge/Flask-Latest-green.svg)](https://flask.palletsprojects.com/)
[![React](https://img.shields.io/badge/React-18+-61dafb.svg)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-Latest-646cff.svg)](https://vitejs.dev/)

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Project Structure](#project-structure)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Backend Setup](#backend-setup)
  - [Frontend Setup](#frontend-setup)
- [Running the Application](#running-the-application)
- [Docker Deployment](#docker-deployment)
- [API Documentation](#api-documentation)
- [Component Architecture](#component-architecture)
- [Development](#development)
- [Contributing](#contributing)
- [License](#license)
- [Author](#author)

## Overview

WebSearch is a modern real-time chat application built with a Python Flask backend and React frontend. It features message streaming support for seamless, live communication experiences.

## ✨ Features

- 💬 **Real-time Chat Interface** - Instant messaging with low latency
- 🔄 **Message Streaming** - Live message updates via custom React hook
- 🎨 **Responsive Design** - Mobile-first, adaptive UI components
- 🐳 **Docker Support** - Containerized deployment ready
- ⚡ **Fast Development** - Hot module replacement with Vite
- 🧩 **Modular Components** - Clean, reusable React components
- 🔌 **RESTful API** - Well-structured backend endpoints

## 📁 Project Structure

```
WebSearch/
├── Back/                      # Python Flask Backend
│   ├── app.py                 # Main Flask application
│   ├── requirements.txt       # Python dependencies
│   ├── Dockerfile            # Docker configuration
│   └── __pycache__/          # Python bytecode cache
│
└── Front/                     # React Frontend
    ├── src/
    │   ├── App.jsx           # Root application component
    │   ├── main.jsx          # Application entry point
    │   ├── components/       # Reusable UI components
    │   │   ├── ChatComposer.jsx    # Message input component
    │   │   ├── ChatHeader.jsx      # Chat header component
    │   │   ├── MessageItem.jsx     # Individual message display
    │   │   └── MessageList.jsx     # Message container
    │   ├── hooks/            # Custom React hooks
    │   │   └── useChatStream.js    # Message streaming hook
    │   └── utils/            # Utility functions
    │       └── cn.js         # ClassName utilities
    ├── index.html            # HTML template
    └── package.json          # Node.js dependencies
```

## 🛠 Tech Stack

### Backend
| Technology | Purpose |
|-----------|---------|
| **Python 3.7+** | Backend runtime environment |
| **Flask** | Lightweight web framework |
| **Docker** | Containerization and deployment |

### Frontend
| Technology | Purpose |
|-----------|---------|
| **React 18+** | UI framework for building components |
| **Vite** | Next-generation build tool and dev server |
| **Modern JavaScript** | ES6+ features for clean code |

## 🚀 Getting Started

### Prerequisites

Ensure you have the following installed on your system:

- **Node.js** (v14.0.0 or higher) - [Download](https://nodejs.org/)
- **Python** (v3.7 or higher) - [Download](https://www.python.org/downloads/)
- **npm** or **yarn** - Package manager (comes with Node.js)
- **Docker** (optional) - [Download](https://www.docker.com/get-started)

Verify installations:
```bash
node --version
python --version
docker --version
```

### Backend Setup

1. **Navigate to the backend directory:**
   ```bash
   cd Back
   ```

2. **Create a virtual environment (recommended):**
   ```bash
   python -m venv venv
   
   # Activate virtual environment
   # On Windows:
   venv\Scripts\activate
   # On macOS/Linux:
   source venv/bin/activate
   ```

3. **Install Python dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

4. **Run the Flask application:**
   ```bash
   python app.py
   ```

   The backend server will start at `http://localhost:5000`

### Frontend Setup

1. **Navigate to the frontend directory:**
   ```bash
   cd Front
   ```

2. **Install Node.js dependencies:**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

   The frontend will start at `http://localhost:5173` (Vite default)

## 🎯 Running the Application

1. **Start the backend server:**
   ```bash
   cd Back
   python app.py
   ```

2. **In a new terminal, start the frontend:**
   ```bash
   cd Front
   npm run dev
   ```

3. **Access the application:**
   - Open your browser to `http://localhost:5173`
   - The frontend will automatically connect to the backend API

## 🐳 Docker Deployment

### Backend Container

Build and run the backend using Docker:

```bash
cd Back

# Build the Docker image
docker build -t websearch-backend .

# Run the container
docker run -p 5000:5000 websearch-backend
```

### Docker Compose (Full Stack)

Create a `docker-compose.yml` in the project root for running both services:

```yaml
version: '3.8'
services:
  backend:
    build: ./Back
    ports:
      - "5000:5000"
  
  frontend:
    build: ./Front
    ports:
      - "5173:5173"
    depends_on:
      - backend
```

Run with:
```bash
docker-compose up
```

## 📡 API Documentation

### Base URL
```
http://localhost:5000/api
```

### Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/health` | Health check endpoint |
| `POST` | `/messages` | Send a new message |
| `GET` | `/messages/stream` | Stream messages in real-time |

> **Note:** Update this section with your actual API endpoints from `app.py`

## 🧩 Component Architecture

### Frontend Components

#### `<ChatComposer />`
Message input component with send functionality
- Props: `onSendMessage`, `placeholder`
- Features: Input validation, keyboard shortcuts

#### `<ChatHeader />`
Header section displaying chat information
- Props: `title`, `subtitle`, `actions`
- Features: Responsive layout, action buttons

#### `<MessageList />`
Container for rendering message history
- Props: `messages`, `isLoading`
- Features: Auto-scroll, virtualization support

#### `<MessageItem />`
Individual message display component
- Props: `message`, `timestamp`, `author`
- Features: Markdown support, timestamp formatting

### Custom Hooks

#### `useChatStream(url)`
Manages real-time message streaming
```javascript
const { messages, sendMessage, isConnected } = useChatStream('/api/messages/stream');
```

### Environment Variables

Create `.env` files for environment-specific configuration:

## 👤 Author

**Hiba Chabbouh**

- GitHub: [@hibachabbouh](https://github.com/hibachabbouh)
- LinkedIn: [Hiba Chabbouh](https://www.linkedin.com/in/hiba-chabbouh/) 



