### Development

1. Install dependencies

```
bun install
```

2. Generate database migrations

```
bun run db:generate
```

3. Create the D1 Database

```
bunx wrangler d1 create cfw-bun-hono-drizzle-d1
```

4. Add D1 database credentials to wrangler.toml
5. Run the local SQLite database

```
bun run db:up
```

6. Apply migrations to local database

```
bunx wrangler d1 execute moveto-db --local --file=./drizzle/migrations/<migration file name here>
```

7. Start development server

```
bun run dev
```

### Production

## Project context and engineering approach

This repository is a Moveto API implementation for file-sharing workflows. It handles the server-side concerns behind uploads and shared links: validation, authentication, metadata, database migration, and signed object-storage access.

Hono and Zod define a typed HTTP boundary. Drizzle with SQLite/D1 manages the relational model, Lucia supplies authentication, and the AWS S3 client plus presigned URLs keep file transfer out of the API process. The documented local D1 workflow makes schema changes reproducible before deployment to Cloudflare Workers.

## Status

Earlier API implementation retained as a technical reference for the Moveto product line.

1. Apply migrations to D1 database on Cloudflare

```
bunx wrangler d1 execute moveto-db --remote --file=./drizzle/migrations/<migration file name here>
```

2. Deploy the application

```
bun run deploy
```
