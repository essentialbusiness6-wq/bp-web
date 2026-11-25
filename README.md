# Business Essentials Prime - Web Frontend

A modern, secure, and highly responsive invoicing and business management platform built for freelancers and small businesses. This repository contains the complete user-facing web application.

## 🚀 Features

- **Authentication**: Secure login, registration, password recovery, and 2FA setup.
- **Dashboard**: Real-time overview of balances, invoice stats, and recent activity with an interactive onboarding tour.
- **Invoice Management**: Create, view, edit, and delete invoices. Generate secure, tokenized client request links.
- **Client & Payment Tracking**: Manage client directories and track payment statuses (Paid, Pending, Overdue).
- **Billing & Subscriptions**: Seamless Paystack integration for plan upgrades and secure payment processing.
- **Profile & Security**: Manage personal details, bank account verification, active session revocation, and password changes.
- **Support Center**: Searchable FAQ, pro tips, ticket submission, and a live chat widget.
- **Referral System**: Share unique referral codes and track rewards.
- **Public Pages**: Beautiful, print-optimized invoice viewing and secure client invoice request forms.

## 🛠️ Tech Stack

- **Framework**: React 18 + TypeScript
- **Build Tool**: Vite
- **Routing**: React Router v6
- **Styling**: Custom CSS with CSS Variables (Light/Dark/System theme support)
- **State Management**: React Hooks (`useState`, `useEffect`, `useContext`)
- **API Communication**: Native `fetch` via a centralized `apiClient`
- **Animations**: CSS Keyframes & Intersection Observer for scroll animations

## 📂 Project Structure

```text
src/
├── components/         # Reusable UI components (Layouts, Modals, Buttons)
├── contexts/           # React Context providers (Auth, Theme)
├── features/           # Feature-based modules (dashboard, invoices, auth, etc.)
│   ├── [feature]/
│   │   ├── components/ # Feature-specific components
│   │   ├── pages/      # Route-level page components
│   │   └── services/   # API service functions for the feature
├── hooks/              # Custom React hooks (useAuth, useTheme, etc.)
├── services/           # Global services (apiClient)
├── types/              # Global TypeScript interfaces and types
├── App.tsx             # Main application component & routing
└── main.tsx            # Application entry point

```

## ⚙️ Getting Started
**Prerequisites**
    - **Node.js (v18.x or higher)**
    - **npm, yarn, or pnpm**