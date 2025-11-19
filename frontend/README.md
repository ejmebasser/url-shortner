# URL Shortener

A full-stack URL shortening service with user authentication, analytics, and visit tracking.

## Features

-  URL shortening with auto-generated or custom slugs
-  User authentication (register/login with JWT)
-  Visit tracking and analytics
-  Copy to clipboard functionality
-  Rate limiting protection
-  SQLite database (easy setup, no external database needed)
-  Responsive dashboard

## Tech Stack

### Backend
- NestJS
- TypeScript
- Prisma ORM
- SQLite
- JWT Authentication
- Bcrypt

### Frontend
- Next.js 15
- React
- TypeScript
- Simple CSS styling

## Getting Started

### Prerequisites
- Node.js 18+ installed
- npm or yarn

### Installation

1. Clone the repository
```bash
git clone <your-repo-url>
cd url-shortener
```

2. Install backend dependencies
```bash
cd backend
npm install
```

3. Set up the database
```bash
npm run prisma:generate
npm run prisma:migrate
```

4. Install frontend dependencies
```bash
cd ../frontend
npm install
```

### Running the Application

#### Option 1: Run Manually (Recommended for Development)

**Terminal 1 - Backend:**
```bash
cd backend
npm run start:dev
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

Then visit `http://localhost:3000`

#### Option 2: Run with Docker
```bash
docker-compose up --build
```

Then visit `http://localhost:3000`

## Usage

1. **Register/Login**: Create an account or login at `http://localhost:3000/auth`
2. **Shorten URLs**: Enter a long URL and optionally customize the slug
3. **View Your URLs**: See all your shortened URLs with visit counts
4. **Copy Links**: Click "Copy" to copy the shortened URL to clipboard
5. **Track Visits**: Every click on your shortened URL is tracked
6. **Delete URLs**: Remove URLs you no longer need

## API Endpoints

### Authentication
- `POST /auth/register` - Register new user
- `POST /auth/login` - Login user
- `GET /auth/me` - Get current user (protected)

### URLs
- `POST /urls` - Create shortened URL (protected)
- `GET /urls` - Get user's URLs (protected)
- `GET /urls/all` - Get all URLs
- `PATCH /urls/:id` - Update URL slug (protected)
- `DELETE /urls/:id` - Delete URL (protected)
- `GET /:slug` - Redirect to original URL

### Analytics
- `GET /analytics/dashboard` - Get dashboard stats (protected)
- `GET /analytics/url/:id` - Get URL stats (protected)

## Project Structure
```
url-shortener/
├── backend/
│   ├── src/
│   │   ├── auth/          # Authentication module
│   │   ├── urls/          # URL shortening module
│   │   ├── analytics/     # Analytics module
│   │   ├── common/        # Shared utilities
│   │   └── prisma/        # Database service
│   └── prisma/
│       └── schema.prisma  # Database schema
├── frontend/
│   ├── app/               # Next.js pages
│   ├── components/        # React components
│   ├── contexts/          # React contexts
│   ├── lib/               # Utilities and API client
│   └── types/             # TypeScript types
└── docker-compose.yml
```

## Environment Variables

### Backend (.env)
```
DATABASE_URL="file:./dev.db"
JWT_SECRET="your-secret-key"
JWT_EXPIRES_IN="7d"
PORT=3001
NODE_ENV="development"
FRONTEND_URL="http://localhost:3000"
THROTTLE_TTL=60
THROTTLE_LIMIT=10
```

### Frontend (.env.local)
```
NEXT_PUBLIC_API_URL=http://localhost:3001
```

## Testing the Application

1. Register a new account
2. Create a shortened URL (e.g., `https://google.com`)
3. Copy the shortened URL
4. Open it in a new tab - it should redirect
5. Check the visit count increment in your dashboard

## Notes

- SQLite database file is created automatically at `backend/dev.db`
- Backend runs on port 3001, frontend on port 3000
- Rate limiting is enabled (10 requests per 60 seconds by default)