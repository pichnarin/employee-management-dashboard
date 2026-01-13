# Employee Dashboard Management

A Vue 3 + TypeScript frontend application for managing employees with role-based access control.

## Features

- **Authentication System**
  - Two-step OTP authentication (login + email OTP verification)
  - JWT-based authentication with automatic token refresh
  - Secure token storage and management
  - Session persistence across page refreshes

- **Role-Based Access Control**
  - Three user roles: Admin, Employee, Trainee
  - Route guards for protecting pages based on user role
  - Admin-only user management features

- **User Management (Admin)**
  - View all users with filtering and pagination
  - Create new users with file uploads (documents, photos)
  - Update user information
  - Soft delete and restore users
  - Permanently delete users

- **Profile Management**
  - View personal information
  - Account details and emergency contact info

## Tech Stack

- **Vue 3** - Progressive JavaScript framework with Composition API
- **TypeScript** - Type-safe development
- **Vite** - Fast build tool and dev server
- **Pinia** - State management
- **Vue Router** - Client-side routing with navigation guards
- **Axios** - HTTP client with interceptors for automatic token refresh

## Prerequisites

- Node.js (^20.19.0 || >=22.12.0)
- npm or yarn

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd employee_dashboard_management
```

2. Install dependencies:
```bash
npm install
```

3. Create environment file:
```bash
cp .env.example .env
```

4. Update the `.env` file with your API base URL:
```env
VITE_API_BASE_URL=http://localhost:8000
VITE_APP_NAME=Employee Dashboard
```

## Development

Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:5173`

## Build for Production

Build the application:
```bash
npm run build
```

Preview the production build:
```bash
npm run preview
```

## Project Structure

```
src/
├── api/              - API client and endpoint definitions
│   ├── client.ts     - Axios instance with interceptors
│   ├── auth.api.ts   - Authentication API calls
│   └── user.api.ts   - User management API calls
├── assets/           - Static assets (CSS, images)
├── components/       - Reusable Vue components
├── router/           - Vue Router configuration with guards
├── stores/           - Pinia stores
│   ├── auth.store.ts - Authentication state
│   └── user.store.ts - User management state
├── types/            - TypeScript type definitions
│   ├── api.types.ts  - API response types
│   ├── auth.types.ts - Authentication types
│   └── user.types.ts - User types
├── utils/            - Utility functions
│   ├── formData.util.ts   - FormData helper for file uploads
│   └── validation.util.ts - Form validation utilities
├── views/            - Page components
│   ├── admin/        - Admin-only pages
│   ├── auth/         - Authentication pages
│   └── user/         - User pages
├── App.vue           - Root component
├── main.ts           - Application entry point
└── env.d.ts          - Environment variable type declarations
```

## Key Features Implementation

### Automatic Token Refresh

The Axios client includes interceptors that automatically:
- Attach the access token to every request
- Detect 401 errors and refresh the token
- Retry failed requests with the new token
- Queue multiple requests during token refresh
- Redirect to login if refresh fails

This ensures a seamless user experience with no blank screens or interruptions.

### Type-Safe API Layer

All API endpoints are fully typed with TypeScript interfaces:
- Request payloads
- Response data structures
- Pagination metadata
- Error responses

### Form Data Handling

The `formData.util.ts` provides helpers for:
- Converting objects to FormData for file uploads
- File size validation
- File type validation
- Image preview generation

### Route Guards

Vue Router guards protect routes based on:
- Authentication status
- User role (admin, employee, trainee)
- Guest-only pages (login, OTP verification)

## Available Routes

### Public Routes
- `/login` - Login page
- `/verify-otp` - OTP verification page

### Protected Routes (Authenticated)
- `/dashboard` - Admin dashboard (admin only)
- `/users` - User list (admin only)
- `/users/create` - Create user (admin only)
- `/profile` - User profile (all roles)

### Utility Routes
- `/unauthorized` - 403 Access denied page
- `/*` - 404 Not found page

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `VITE_API_BASE_URL` | Backend API URL | `http://localhost:8000` |
| `VITE_APP_NAME` | Application name | `Employee Dashboard` |

## API Integration

The application integrates with a Laravel backend API. See `CLAUDE.md` for complete API documentation.

### Authentication Flow

1. User enters credentials → `/api/auth/login`
2. OTP sent to email
3. User enters OTP → `/api/auth/verify-otp`
4. Tokens stored (access + refresh)
5. User profile fetched → `/api/get-profile`
6. Redirect to dashboard

### Token Management

- Access tokens stored in localStorage
- Refresh tokens used for silent token renewal
- Automatic logout on refresh failure
- Tokens cleared on manual logout

## Development Guidelines

### Adding New API Endpoints

1. Define types in `src/types/`
2. Create API function in `src/api/`
3. Use in Pinia store or component

### Adding New Routes

1. Create view component in `src/views/`
2. Add route to `src/router/index.ts`
3. Set appropriate meta fields for guards

### State Management

Use Pinia stores for:
- Global state (authentication, user data)
- Shared logic across components
- API call management

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

[Your License Here]
