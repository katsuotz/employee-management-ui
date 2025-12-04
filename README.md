# Employee Management System - Frontend

Frontend application for Employee Management System built with Next.js 16, React 19, TypeScript, and Tailwind CSS.

## Features

- ✅ Modern React 19 with TypeScript
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
- **UI Components**: shadcn/ui ( Radix UI primitives
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

### 1. Install pnpm ( if not already installed:
```bash
npm install -g pnpm
```

### 2. Clone and install dependencies:
```bash
git clone <repository-url>
cd frontend
pnpm install
```

### 3. Set up environment variables:
```bash
cp .env.example .env
```

Then edit `.env` and configure your settings:

## Environment Variables

### API Configuration
```env
NEXT_PUBLIC_API_URL=http://localhost:5000
NEXT_PUBLIC_WS_URL=ws://localhost:5000
```

### Application Configuration
```env
NODE_ENV=development
NEXT_PUBLIC_APP_NAME=Employee Management System
NEXT_PUBLIC_APP_VERSION=1.0.0
```

### Authentication Configuration
```env
NEXT_PUBLIC_JWT_EXPIRES_IN=24h
```

### File Upload Configuration
```env
NEXT_PUBLIC_MAX_FILE_SIZE=10485760
NEXT_PUBLIC_ALLOWED_FILE_TYPES=.csv
```

### Development Configuration
```env
NEXT_PUBLIC_DEV_MODE=true
NEXT_PUBLIC_DEBUG_MODE=false
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
| `pnpm lint:fix` | Fix ESLint issues automatically |
| `pnpm type-check` | Run TypeScript type checking |
| `pnpm test` | Run unit tests |
| `pnpm test:watch` | Run tests in watch mode |
| `pnpm test:ui` | Run tests with UI interface |
| `pnpm test:coverage` | Run tests with coverage report |

## Project Structure

```
frontend/
├── src/
│   ├── app/)              # Next.js App Router pages
│   │   ├── (auth)/)       # Authentication pages
│   │   ├── (app)/)        # Main application pages
│   │   ├── api/           # API routes ( if any)
│   │   ├── globals.css    # Global styles
│   │   ├── layout.tsx     # Root layout
│   │   └── page.tsx       # Home page
│   ├── components/       ) Reusable UI components
│   │   ├── ui/            shadcn/ui components
│   │   ├── LoginForm.tsx  # Login form component
│   │   └── ...            Other components
│   ├── lib/               Utility functions
│   ├── services/          API service functions
│   ├── types/             TypeScript type definitions
│   └── test/              Test setup and utilities
├── public/                Static assets
├── .env.example           # Environment variables template
├── .gitignore
├── next.config.ts         # Next.js configuration
├── package.json
├── pnpm-lock.yaml
├── tailwind.config.js     # Tailwind CSS configuration
├── tsconfig.json          # TypeScript configuration
└── vitest.config.ts       # Vitest testing configuration
```

## Components

### Authentication
- **LoginForm** - User login form with validation
- **ProtectedRoute** - Route protection wrapper

### Employee Management
- **EmployeeTable** - Virtualized employee data table
- **EmployeeForm** - Create/edit employee form
- **EmployeeCard** - Employee display card

### Import Functionality
- **ImportPage** - CSV file import interface
- **ImportDialog** - Progress tracking dialog
- **FileUpload** - File upload component

### UI Components
- **Button** - Custom button component
- **Input** - Custom input component
- **Dialog** - Modal dialog component
- **Toast** - Notification system

## API Integration

The frontend integrates with the backend API through service functions:

### Authentication Service
```typescript
// src/services/authService.ts
export const authService = {
  login: ( credentials) => Promise<AuthResponse>
  logout: () => Promise<void>
  getProfile: () => Promise<User>
}
```

### Employee Service
```typescript
// src/services/employeeService.ts
export const employeeService = {
  getEmployees: (params) => Promise<EmployeeResponse>
  createEmployee: (data) => Promise<Employee>
  updateEmployee: (id, data) => Promise<Employee>
  deleteEmployee: (id) => Promise<void>
}
```

### Import Service
```typescript
// src/services/importApiService.ts
export const importApiService = {
  uploadCSV: (file) => Promise<ImportResponse>
  getImportStatus: (jobId) => Promise<ImportProgress>
}
```

## State Management

The application uses React Hooks for state management:

### Local State
- `useState` for component state
- `useReducer` for complex state logic
- `useContext` for global state

### Server State
- Custom hooks for API calls
- Optimistic updates for better UX
- Error handling and loading states

## Styling

### Tailwind CSS
- Utility-first CSS framework
- Responsive design utilities
- Dark mode support ( if implemented)

### shadcn/ui Components
- Built on Radix UI primitives
- Accessible and customizable
- Consistent design system

### Custom Styles
- Component-specific styles
- Global CSS variables
- Animation utilities

## Form Handling

### React Hook Form + Zod
- Performant forms with validation
- TypeScript integration
- Client and server-side validation

### Validation Schemas
```typescript
// Example employee form schema
const employeeSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email'),
  age: z.number().min(18, 'Must be 18 or older'),
  position: z.string().min(1, 'Position is required'),
  salary: z.number().min(0, 'Salary must be positive')
})
```

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

### Test Structure
- Component tests with React Testing Library
- User interaction testing
- API mocking with Vitest
- Accessibility testing

### Test Files
- `LoginForm.test.tsx` - Login form component tests
- `ImportPage.test.tsx` - Import functionality tests
- `EmployeesPage.test.tsx` - Employee management tests

## File Upload

### CSV Import
- Drag and drop file upload
- File validation (type, size)
- Progress tracking with real-time updates
- Error handling and user feedback

### Upload Process
1. User selects CSV file
2. Client-side validation
3. Upload to backend API
4. Progress tracking via WebSocket/SSE
5. Success/error notification

## Authentication

### JWT Token Management
- Token storage in localStorage
- Automatic token refresh
- Protected routes
- Logout functionality

### Auth Flow
1. User submits login form
2. API validates credentials
3. JWT token returned and stored
4. User redirected to dashboard
5. Token included in API requests

## Performance Optimization

### Code Splitting
- Automatic route-based code splitting
- Dynamic imports for large components
- Lazy loading for better performance

### Image Optimization
- Next.js Image component
- Responsive images
- WebP format support

### Bundle Optimization
- Tree shaking
- Minification
- Compression

## Deployment

### Production Build
```bash
# Build for production
pnpm build

# Start production server
pnpm start
```

### Environment Setup
1. Set `NODE_ENV=production`
2. Configure production API URLs
3. Set up proper CORS origins
4. Configure analytics and monitoring

### Static Export ( deployment options for static hosting:
```bash
# Export as static site
pnpm build
pnpm export
```

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Development Notes

### Code Quality
- TypeScript for type safety
- ESLint for code quality
- Prettier for code formatting
- Husky for git hooks ( if configured)

### Best Practices
- Component composition
- Accessibility (WCAG 2.1 AA)
- Performance optimization
- SEO optimization

### Debugging
- React DevTools
- Next.js DevTools
- Browser DevTools
- Console logging

## Troubleshooting

### Common Issues

#### Build Errors
- Check TypeScript configuration
- Verify environment variables
- Clear Next.js cache: `rm -rf .next`

#### API Connection Issues
- Verify backend is running on correct port
- Check CORS configuration
- Verify API URLs in environment

#### Import Issues
- Check file format and size
- Verify backend endpoint availability
- Check network connectivity

#### Styling Issues
- Verify Tailwind CSS configuration
- Check CSS imports
- Clear browser cache

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Run tests and linting
6. Submit a pull request

## License

ISC
