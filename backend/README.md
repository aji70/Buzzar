# Backend API

Production-ready backend with Fastify, PostgreSQL, TypeORM, Redis, and Swagger.

## Features

- User authentication (register, login, logout)
- Profile management (view, edit profile, change password)
- JWT-like token authentication with Redis
- Password hashing with bcrypt
- Swagger API documentation
- TypeORM with PostgreSQL
- Redis for session management

## Setup

1. Install dependencies:
```bash
npm install
```

2. Configure environment:
```bash
cp .env.example .env
# Edit .env with your database and redis credentials
```

3. Start PostgreSQL and Redis (using Docker):
```bash
docker run -d -p 5432:5432 -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=buzzar postgres:16
docker run -d -p 6379:6379 redis:7-alpine
```

4. Run development server:
```bash
npm run dev
```

## API Endpoints

### Auth
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user (requires auth)
- `GET /api/auth/profile` - View profile (requires auth)
- `PUT /api/auth/profile` - Update profile (requires auth)
- `POST /api/auth/change-password` - Change password (requires auth)

### Questions
- `POST /api/questions` - Create single question (requires auth)
- `POST /api/questions/bulk` - Bulk create from JSON array (requires auth)
- `POST /api/questions/bulk/csv` - Bulk create from CSV (requires auth)
- `GET /api/questions` - List all questions (requires auth)
- `GET /api/questions/:id` - Get single question (requires auth)
- `PUT /api/questions/:id` - Update question (requires auth)
- `DELETE /api/questions/:id` - Delete question (requires auth)

### Question Types
- `input` - Free text answer
- `multichoice` - Multiple choice with options
- `true_or_false` - True/False question

### Bulk Upload Samples
- JSON: See `sample-questions.json`
- CSV: See `sample-questions.csv`

## Documentation

Swagger UI available at: `http://localhost:3000/docs`

## Production

```bash
npm run build
npm start
```

## Migrations

```bash
npm run migration:generate -- src/migrations/MigrationName
npm run migration:run
npm run migration:revert
```
