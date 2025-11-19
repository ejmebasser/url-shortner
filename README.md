URL Shortener – Full-Stack Application

A production-ready URL shortening service built with NestJS, Next.js 14 (App Router), Prisma, SQLite/Postgres, and Docker.
Includes full authentication, analytics, and a clean dashboard UI.

Features
URL Shortening

Create short URLs

Auto-generate slugs using nanoid

Redirect service using backend route handlers

Authentication

Register and login

JWT-based authentication

HTTP-only cookie session handling

Persistent user context in the frontend

Analytics Dashboard

Track click counts

Track unique visitors

View per-link performance statistics

Tech Stack

Frontend:

Next.js 14 (App Router)

React

Tailwind CSS

TypeScript

Backend:

NestJS

Prisma ORM

SQLite (development) or Postgres (production)

JWT authentication

Class-validator DTOs

DevOps:

Docker and Docker Compose

Multi-container setup

Hot reload support

GitHub repository integration

Project Structure
url-shortner/
│
├── backend/            # NestJS API
│   ├── src/
│   ├── prisma/
│   └── Dockerfile
│
├── frontend/           # Next.js application
│   ├── app/
│   ├── public/
│   └── Dockerfile
│
└── docker-compose.yml  # optional, full-stack container configuration

Backend Setup (NestJS)

Install dependencies:

cd backend
npm install


Copy environment variables:

cp .env.example .env


If using Postgres, run Prisma migrations:

npx prisma migrate dev


Start the backend:

npm run start:dev


Backend default URL:
http://localhost:3001

Frontend Setup (Next.js)

Install dependencies:

cd frontend
npm install


Start the frontend:

npm run dev


Frontend default URL:
http://localhost:3000

Docker Setup (Optional)

To run both frontend and backend with Docker:

docker compose up --build

Environment Variables
Backend (.env)
DATABASE_URL="file:./dev.db"         or "postgresql://..."
JWT_SECRET="your_jwt_secret_here"
PORT=3001

Frontend (.env.local)
NEXT_PUBLIC_API_URL=http://localhost:3001

API Endpoints
Authentication

POST /auth/register – register a new user
POST /auth/login – login and receive JWT

URL Management

POST /urls – create short URL
GET /urls – list URLs for authenticated user
GET /:slug – redirect to destination URL

Analytics

GET /analytics/:slug – get link analytics data

Deployment Options

Backend deployment options:

AWS ECS

Azure App Service

Render

Railway

Fly.io

Frontend deployment options:

Vercel (recommended)

Netlify

Azure Static Web Apps

Future Improvements

Custom domains for short links

URL expiration options

QR code generation

Rate limiting

Admin analytics panel
