# architecture-playground

> Same app. Different architectures. A personal playground for exploring how architectural decisions shape maintainability, testability, and complexity.

## What is this?

This repo implements the same next.js contact management app — each version identical in behavior and UI, but built with a fundamentally different architectural approach. The goal is to study how structure affects the way code is organized, tested, and extended.

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
| 1   | **Layered**                      | Horizontal layers: UI → Service → Repository → DB              |
| 2   | **Feature-Sliced Design**        | Vertical slices by feature, strict dependency direction        |
| 3   | **Hexagonal (Ports & Adapters)** | Framework-free core, adapters at the edges                     |
| 4   | **Clean Architecture**           | Four concentric rings with strict inward dependencies          |
| 5   | **CQRS**                         | Reads and writes as separate concerns with a command/query bus |

Each version lives in its own directory and can be run independently.

## Getting Started

```bash
# Clone the repo
git clone https://github.com/your-username/architecture-playground.git
cd architecture-playground

# Navigate to a version
cd 01-layered

# Install dependencies
npm install

# Set up the database
npx prisma migrate dev

# Start the dev server
npm run dev
```

## Project Structure

```
architecture-playground/
├── 01-layered/
├── 02-feature-sliced/
├── 03-hexagonal/
├── 04-clean-architecture/
└── 05-cqrs/
```

## Purpose

This is a learning project. The implementations are intentionally kept simple to keep the focus on structure rather than features. The same UI and database schema are used across all versions so that architectural differences are the only variable.
