# BEP Web Project Architecture

## Current Folder Structure
- `src/main.jsx`: Application entry point.
- `src/App.jsx`: Root component managing Preloader state and React Router.
- `src/components/layout/`: Shared layout components (`Header`, `Footer`).
- `src/components/ui/`: Reusable UI elements (`Preloader`).
- `src/features/landing/`: Landing page specific components (`LandingPage`, `HeroSection`, `FeaturesSection`, `CtaSection`).
- `src/hooks/`: Custom React hooks (`useIntersectionObserver`).
- `src/services/api/`: Centralized API client (`client.js`).
- `src/styles/globals.css`: Global design tokens, base styles, and component styles.


## Completed Pages
...
### Onboarding
- `/entry` - Cinematic, auto-advancing 3D animated intro sequence showcasing core features, with a "Skip" button and auto-redirect to `/register`.
### Public Pages
- `/` (Landing Page)
- `/about` (About Us)
- `/blog` (Blog)
- `/careers` (Careers)
- `/changelog` (Changelog)
- `/contact` (Contact)
- `/features` (Features)
- `/integrations` (Integrations)
- `/pricing` (Pricing)
- `/privacy-policy` (Privacy Policy)
- `/terms-of-service` (Terms of Service)

### Authentication Pages (Stage 1 Complete)
- `/login` - Login page with email/password, show/hide password, validation, error states
- `/register` - Registration page with full name, email, password, confirmation
- `/forgot-password` - Forgot password page with email input and success state
- `/reset-password` - Reset password page with token validation and new password form

## Architecture Additions (Stage 1)

### Context Providers
- `ThemeProvider` - Manages Light/Dark/System theme with localStorage persistence and system preference detection
- `AuthProvider` - Manages authenticated user state, loading state, and logout functionality

### Hooks
- `useTheme` - Access theme state and setter
- `useAuth` - Access user state, loading, and logout
- `useMouseParallax` - Lightweight mouse-tracking for animated background

### Reusable Components
- `AnimatedBackground` - Premium 3D animated background with theme-aware colors and mouse parallax
- `PasswordInput` - Reusable password input with show/hide toggle
- `AuthLayout` - Shared layout wrapper for authentication pages

### API Services
- `authService.ts` - Login, register, forgot password, reset password, get current user, logout

## Pending Backend Integrations
- All authentication endpoints (see API_CONTRACT.md)
- User profile retrieval
- Session management via HttpOnly cookies

## Remaining Authenticated Pages (To Be Built)
- `/dashboard` - Main dashboard
- `/invoices` - Invoice management
- `/drafts` - Draft management
- `/clients` - Client management
- `/payments` - Payment tracking
- `/me` - Account overview
- `/settings` - User settings
- `/profile` - Profile management

## Shared Dependencies
- `react`, `react-dom`, `react-router-dom`
- Vite for bundling.