# Frontend Unit Tests

This directory contains comprehensive unit tests for the frontend application using Vitest and React Testing Library.

## Testing Setup

### Dependencies
- `vitest` - Test runner
- `@testing-library/react` - React testing utilities
- `@testing-library/jest-dom` - Custom matchers
- `@testing-library/user-event` - User interaction simulation
- `jsdom` - DOM environment

### Configuration
- `vitest.config.ts` - Main test configuration
- `src/test/setup.ts` - Global test setup and mocks

## Run Tests
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
