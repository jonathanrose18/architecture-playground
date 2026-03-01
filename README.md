# architecture-playground

Same app. Different architectures. A personal playground for exploring how architectural decisions shape maintainability, testability, and complexity.

## What is this?

This repo implements the same Next.js contact management app. Each version is identical in behavior and UI, but built with a different architectural approach.

## The App

A simple CRUD app for managing contacts

**Stack:** Next.js (App Router), Prisma, PostgreSQL, shadcn/ui

## Architectures

| #   | Architecture                                   | Core Idea                                                      |
| --- | ---------------------------------------------- | -------------------------------------------------------------- |
| 1   | **Layered** (In Progress)                      | Horizontal layers: UI -> Service -> Repository -> DB           |
| 2   | **Feature-Sliced Design** (Not started)        | Vertical slices by feature, strict dependency direction        |
| 3   | **Hexagonal (Ports & Adapters)** (Not started) | Framework-free core, adapters at the edges                     |
| 4   | **Clean Architecture** (Not started)           | Four concentric rings with strict inward dependencies          |
| 5   | **CQRS** (Not started)                         | Reads and writes as separate concerns with a command/query bus |

## Turborepo Setup

This repository is configured as a Turborepo with:

- `apps/*` for app implementations
- `packages/database` as shared Prisma package (`@workspace/database`)
- `packages/ui` as shared ui package (`@workspace/ui`)

## Getting Started

1. Install workspace dependencies:

   ```bash
   pnpm install
   ```

2. Start PostgreSQL:

   ```bash
   pnpm db:up
   ```

3. Create your local env file:

   ```bash
   cp apps/01-layered/.env.example apps/01-layered/.env
   ```

4. Run Prisma migrations:

   ```bash
   pnpm db:migrate
   ```

5. Generate Prisma client:

   ```bash
   pnpm db:generate
   ```

6. Start development:

   ```bash
   pnpm dev
   ```

## Project Structure

```text
architecture-playground/
├── apps/
│   ├── 01-layered/
│   ├── 02-fsd/
│   ├── 03-hexagonal/
│   ├── 04-clean-architecture/
│   └── 05-cqrs/
├── packages/
│   └── database/
│   └── ui/
```

## Database Commands

- `pnpm db:up` starts PostgreSQL via Docker Compose
- `pnpm db:down` stops containers
- `pnpm db:migrate` runs Prisma migrations
- `pnpm db:generate` generates Prisma client
- `pnpm db:studio` opens Prisma Studio

## Purpose

This is a learning project. The implementations are intentionally simple so architectural differences stay the main variable.
