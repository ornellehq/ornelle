# Architecture Overview

This document provides a high-level overview of the Ornelle ATS architecture, design decisions, and technical stack.

## System Architecture

Ornelle ATS is designed as a modern web application with a clear separation between:

1. **Client Applications** (Frontend)
   - Web application for internal users
   - Public career pages for candidates

2. **API Server** (Backend)
   - RESTful API endpoints
   - Business logic
   - Database interactions
   - File storage

3. **Shared Components**
   - Business logic shared between frontend and backend
   - Type definitions
   - Validation schemas

## Architecture Diagram

```
┌─────────────────┐      ┌─────────────────┐
│                 │      │                 │
│  Web App (SPA)  │      │  Public Pages   │
│     React       │      │     Astro       │
│                 │      │                 │
└────────┬────────┘      └────────┬────────┘
         │                        │
         │  HTTP/REST             │  HTTP/REST
         │                        │
┌────────▼────────────────────────▼────────┐
│                                          │
│               API Server                 │
│               (Fastify)                  │
│                                          │
└────────┬──────────────────────┬──────────┘
         │                      │
         │                      │
┌────────▼────────┐    ┌────────▼────────┐
│                 │    │                 │
│   PostgreSQL    │    │  File Storage   │
│                 │    │ (Local or AWS)  │
└─────────────────┘    └─────────────────┘
```

## Technical Stack

### Frontend Stack

#### Web Application (packages/webapp)
- **Framework**: React 18
- **Routing**: TanStack Router
- **State Management**: 
  - React Context for global state
  - TanStack Query for API requests and server state
- **UI Components**: React Aria Components
- **Styling**: Tailwind CSS
- **Build Tool**: Vite

#### Public Pages (packages/webpages)
- **Framework**: Astro
- **Components**: React components (shared with webapp)
- **Styling**: Tailwind CSS

### Backend Stack

#### API Server (packages/server)
- **Framework**: Fastify
- **API Documentation**: Scalar & Swagger
- **Authentication**: JWT Tokens & Cookies
- **Validation**: JSON Schema
- **Database ORM**: Prisma
- **Query Builder**: Kysely

### Shared Components

#### Business Logic (packages/isomorphic-blocs)
- **Database Schemas**: Prisma models
- **Type Definitions**: TypeScript interfaces
- **Validation Schemas**: Zod/JSON Schema

#### UI Library (packages/webui-library)
- **Component Library**: Custom components with React Aria
- **Design System**: Tailwind-based design tokens

## Key Design Decisions

### Monorepo Structure

The codebase is organized as a monorepo using pnpm workspaces. This approach enables:
- Sharing code between packages
- Consistent development experience
- Simplified dependency management
- Atomic changes across multiple packages

### API-First Design

The backend API is designed using an API-first approach:
- OpenAPI/Swagger specifications
- Generated client SDKs
- Consistent error handling
- Comprehensive schema validation

### Multi-Tenant Architecture

Ornelle ATS uses a workspace-based multi-tenant model:
- Each workspace is isolated within the same database
- Users can belong to multiple workspaces
- Organizations can manage their own workflows
- Customization is possible at the workspace level

### File Storage Strategy

The system supports two file storage strategies:

1. **Local Storage**:
   - Files stored on the local filesystem
   - Simpler setup for self-hosting
   - Good for development and smaller deployments

2. **AWS S3/CloudFront**:
   - Files stored in S3 buckets
   - CloudFront for content delivery
   - Signed cookies for secure access
   - Better for production and scaling

