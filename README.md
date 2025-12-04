# Employee Management System - Frontend

Frontend application for Employee Management System built with Next.js 16, React 19, TypeScript, and Tailwind CSS.

## Features

- ✅ React 19 with TypeScript
- ✅ Next.js 16 App Router
- ✅ Tailwind CSS for styling
- ✅ shadcn/ui components
- ✅ Form validation with Zod
- ✅ Authentication with JWT
- ✅ CSV file import functionality
- ✅ Real-time progress tracking
- ✅ Virtualized data tables
- ✅ Responsive design
- ✅ Toast notifications with Sonner
- ✅ Unit testing with Vitest

## Tech Stack

- **Framework**: Next.js 16
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui ( Radix UI primitives )
- **Forms**: React Hook Form + Zod validation
- **State Management**: React Hooks
- **HTTP Client**: Fetch API
- **Notifications**: Sonner
- **Testing**: Vitest + React Testing Library
- **Package Manager**: pnpm

## Prerequisites

Before running this application, make sure you have:

- Node.js (v18 or higher)
- pnpm ( latest version)
- Backend API running on `http://localhost:5000`

## Installation

### 1. Clone and install dependencies:
```bash
pnpm install
```

### 2. Set up environment variables:
```bash
cp .env.example .env
```

Then edit `.env` and configure your settings:

## Environment Variables

### API Configuration
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

## Running the Application

### Development Mode
```bash
pnpm dev
```
The application will start on `http://localhost:3000` with hot reload.

### Production Mode
```bash
pnpm build
pnpm start
```

## Available Scripts

| Command | Description |
|---------|-------------|
| `pnpm dev` | Start development server with hot reload |
| `pnpm build` | Build production application |
| `pnpm start` | Start production server |
| `pnpm lint` | Run ESLint |
| `pnpm test` | Run unit tests |
| `pnpm test:watch` | Run tests in watch mode |
| `pnpm test:ui` | Run tests with UI interface |
| `pnpm test:coverage` | Run tests with coverage report |

## Testing

### Unit Tests
```bash
# Run all tests
pnpm test

# Run tests in watch mode
pnpm test:watch

# Run tests with UI
pnpm test:ui

# Run tests with coverage
pnpm test:coverage
```

## Deployment

```bash
# Run build
pnpm build
# Start the app
pnpm start
```
