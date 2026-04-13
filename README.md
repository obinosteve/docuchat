# DocuChat API

DocuChat is an Express + Prisma API for document-backed chat workflows. The current codebase includes authentication, health checks, Swagger docs, Prisma migrations, and a SQLite development database.

## Requirements

- Node.js 22+
- npm 10+

## Getting Started

1. Clone the repository and move into it:

```bash
git clone <your-repo-url>
cd docuchat
```

2. Install dependencies:

```bash
npm install
```

3. Create your local environment file:

```bash
cp .env.example .env
```

4. Update `.env` with your local values:

```env
PORT=3000
NODE_ENV=development
JWT_ACCESS_SECRET=replace-with-a-long-random-string
JWT_REFRESH_SECRET=replace-with-another-long-random-string
DATABASE_URL="file:./dev.db"
```

5. Run Prisma migrations:

```bash
npm run db:migrate
```

6. Seed the database with sample users and a sample document:

```bash
npm run db:seed
```

7. Start the development server:

```bash
npm run dev
```

The API will be available at `http://localhost:3000` by default.

## Useful Commands

```bash
npm run dev
npm start
npm test
npm run test:watch
npm run test:coverage
npm run db:generate
npm run db:migrate
npm run db:seed
```

## Environment Variables

| Variable | Required | Description |
| --- | --- | --- |
| `PORT` | No | Port used by the Express server. Defaults to `3000`. |
| `NODE_ENV` | No | App environment, usually `development`, `test`, or `production`. |
| `JWT_ACCESS_SECRET` | Yes | Secret used to sign access tokens. |
| `JWT_REFRESH_SECRET` | Yes | Secret used to sign refresh tokens. |
| `DATABASE_URL` | Yes | Prisma database connection string. For local SQLite, use `file:./dev.db`. |

## Seeded Accounts

After running `npm run db:seed`, these users are available:

- `admin@docuchat.dev` / `Admin123!`
- `test@docuchat.dev` / `Test1234!`

## API Docs

Once the server is running:

- Swagger UI: `http://localhost:3000/api-docs`
- OpenAPI JSON: `http://localhost:3000/api-docs.json`
- Health check: `http://localhost:3000/api/v1/health`

## Testing

Integration tests use `.env.test` and a separate SQLite database:

```bash
npm test
```

If you need a fresh test env file:

```bash
cp .env.test.example .env.test
```

## Notes

- This project uses Node's `--experimental-strip-types` flag to run TypeScript files directly.
- Prisma is configured through [prisma.config.ts](/Users/obinna/www/AI/node/docuchat/prisma.config.ts:1).
- The currently mounted API routes are health and auth under `/api/v1`.
