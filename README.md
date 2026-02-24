# architecture-playground

> Same app. Different architectures. A personal playground for exploring how architectural decisions shape maintainability, testability, and complexity.

## What is this?

This repo implements the same Next.js contact management app. Each version is identical in behavior and UI, but built with a different architectural approach.

## The App

A simple CRUD app for managing contacts. Every version supports:

- List all contacts
- View contact details
- Create a contact
- Edit a contact
- Delete a contact

**Stack:** Next.js (App Router), Prisma, SQLite, shadcn/ui

## Architectures

| #   | Architecture                     | Core Idea                                                      |
| --- | -------------------------------- | -------------------------------------------------------------- |
| 1   | **Layered**                      | Horizontal layers: UI -> Service -> Repository -> DB          |
| 2   | **Feature-Sliced Design**        | Vertical slices by feature, strict dependency direction        |
| 3   | **Hexagonal (Ports & Adapters)** | Framework-free core, adapters at the edges                    |
| 4   | **Clean Architecture**           | Four concentric rings with strict inward dependencies         |
| 5   | **CQRS**                         | Reads and writes as separate concerns with a command/query bus |

## Turborepo Setup

This repository is configured as a Turborepo with:

- `apps/*` for app implementations
- `packages/db` as shared Prisma package (`@workspace/db`)

## Getting Started

```bash
# 1) Clone repository
# git clone <repo-url>
cd architecture-playground

# 2) Create shared env
cp .env.example .env

# 3) Install workspace dependencies
pnpm install

# 4) Generate Prisma client from shared db package
pnpm db:generate

# 5) Run migrations
pnpm db:migrate

# 6) Start layered app only
pnpm dev -- --filter=@workspace/01-layered
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
│   └── db/
└── data/
```

## Purpose

This is a learning project. The implementations are intentionally simple so architectural differences stay the main variable.
