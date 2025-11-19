# URL Shortener Backend

Backend API for URL shortening service built with NestJS and PostgreSQL.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Set up your `.env` file (copy from `.env.example`)

3. Make sure PostgreSQL is running

4. Run database migrations:
```bash
npm run prisma:migrate
```

5. Start the server:
```bash
npm run start:dev
```

The API will run on `http://localhost:3001`

## API Endpoints

### Auth
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

## Tech Stack

- NestJS
- TypeScript
- PostgreSQL
- Prisma ORM
- JWT Authentication
- Bcrypt