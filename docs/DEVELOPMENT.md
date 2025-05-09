# Development Guide

This guide provides information on setting up your development environment and working with the Ornelle ATS codebase.

## Project Structure

Ornelle ATS is organized as a monorepo with several packages:

```
ornelle-ats/
├── packages/
│   ├── webapp/           # React frontend application
│   ├── server/           # Fastify backend API
│   ├── webpages/         # Astro public pages
│   ├── isomorphic-blocs/ # Shared business logic
│   ├── sdks/             # Generated API clients
│   ├── lib/              # Shared utilities
│   └── webui-library/    # Reusable UI components
├── docs/                 # Documentation
└── README.md
```

## Development Environment

### Requirements

- Node.js (v22 recommended)
- pnpm (v8 or later)
- PostgreSQL (v14 or later)
- Redis (v6 or later)

### Setting Up Locally

1. **Set up your database:**

   Create a PostgreSQL database:

   ```sql
   CREATE DATABASE ornelle_ats;
   CREATE USER ornelle WITH ENCRYPTED PASSWORD 'your_password';
   GRANT ALL PRIVILEGES ON DATABASE ornelle_ats TO ornelle;
   ```

2. **Configure environment variables:**

   Copy the example environment file and edit it with your settings:

   ```bash
   cp packages/server/.env.example packages/server/.env
   ```

   Update the DATABASE_URL variable to point to your PostgreSQL instance:

   ```
   DATABASE_URL=postgresql://ornelle:your_password@localhost:5432/ornelle_ats
   ```

3. **Run database migrations:**

   ```bash
   cd packages/isomorphic-blocs
   pnpm migrate:apply
   cd ../..
   ```

4. **Start development servers:**

   ```bash
   pnpm dev
   ```

   This will start all services concurrently.

### Code Quality Tools

We use several tools to maintain code quality:

- **Biome**: For code formatting and linting
- **TypeScript**: For type checking
- **Vitest**: For unit testing

Run the linter:

```bash
pnpm lint
```

Run tests:

```bash
pnpm test
```

## Frontend Development

The web application is built with:

- React
- TanStack Router for routing
- Tailwind CSS for styling
- React Aria Components for accessible UI components

### Component Structure

(WIP)

## Backend Development

The server is built with:

- Fastify
- Prisma ORM
- JSON Schema for request/response validation

### Service Structure

The backend follows a service-oriented architecture:

- **Routes**: API endpoints
- **Blocs**: Business logic services
- **Plugins**: Fastify plugins

### File Storage

For file storage, we support two options:

1. **Local Storage**: Default configuration stores files on local disk
2. **AWS S3/CloudFront**: Configurable to use AWS services

The AWS implementation includes:
- S3 for object storage
- CloudFront signed cookies for secure access

## Submitting Changes

(WIP)

<!-- See our [Contributing Guide](../CONTRIBUTING.md) for details on submitting changes. -->
