# EduPro Server

Backend API for the EduPro Classroom Automation System.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create `.env` file (copy from `.env.example`):
```bash
cp .env.example .env
```

3. Update `.env` with your Supabase credentials and other configuration

4. Initialize Prisma and run migrations:
```bash
npx prisma generate
npx prisma migrate dev --name init
```

5. Start development server:
```bash
npm run dev
```

## Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build TypeScript to JavaScript
- `npm start` - Start production server
- `npm run prisma:generate` - Generate Prisma client
- `npm run prisma:migrate` - Run database migrations
- `npm run prisma:studio` - Open Prisma Studio (database GUI)

## API Endpoints

See `implementation_plan.md` for complete API documentation.

### Auth
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `POST /api/auth/refresh` - Refresh token
- `GET /api/auth/me` - Get current user

## Tech Stack

- **Runtime**: Node.js with TypeScript
- **Framework**: Express.js
- **Database**: PostgreSQL (via Supabase)
- **ORM**: Prisma
- **Auth**: JWT
- **File Upload**: Multer
- **AI**: Google Gemini API
