# 🍽️ Savory Frontend - Personal Recipe Manager

Modern, responsive React frontend for the Savory recipe management application. Built with TypeScript, Vite, and Tailwind CSS.

[![React CI](https://github.com/GabbyFerm/Savory-Frontend/actions/workflows/react-ci.yml/badge.svg)](https://github.com/GabbyFerm/Savory-Frontend/actions/workflows/react-ci.yml)

## 📋 Table of Contents

- [Overview](#-overview)
- [Tech Stack](#-tech-stack)
- [Features](#-features)
- [Prerequisites](#-prerequisites)
- [Getting Started](#-getting-started)
- [Environment Variables](#-environment-variables)
- [Available Scripts](#-available-scripts)
- [Project Structure](#-project-structure)
- [Styling](#-styling)
- [API Integration](#-api-integration)
- [Deployment](#-deployment)
- [Contributing](#-contributing)

## 🎯 Overview

Savory Frontend is a modern React application that provides an intuitive interface for managing personal recipes. Built as a multi-page application with React Router, users can create, edit, delete, and organize recipes with images, ingredients, and detailed instructions.

**Live Demo:** [Coming Soon]

**Backend Repository:** [Savory-Backend](https://github.com/GabbyFerm/Savory-Backend)

## 🛠️ Tech Stack

### Core

- **React 18** - UI library with hooks
- **TypeScript** - Type-safe JavaScript
- **Vite** - Fast build tool and dev server
- **React Router v6** - Client-side routing

### Styling

- **Tailwind CSS** - Utility-first CSS framework
- **Lucide React** - Beautiful icon library
- **React Hot Toast** - Toast notifications

### State Management & Data Fetching

- **React Context API** - Global state management
- **Axios** - HTTP client with interceptors

### Code Quality

- **ESLint** - Code linting
- **Prettier** - Code formatting
- **TypeScript** - Static type checking

## ✨ Features

### Authentication

- ✅ User registration with avatar customization (modal)
- ✅ Secure login with JWT tokens (modal)
- ✅ Password change functionality (modal)
- ✅ Profile update (username, email, avatar color) (modal)
- ✅ Automatic token refresh (7-day sessions)
- ✅ Cross-tab logout detection
- ✅ Protected routes

### Recipe Management

- ✅ Create recipes with images, ingredients, and instructions
- ✅ Edit existing recipes
- ✅ Delete recipes with confirmation
- ✅ Upload and display recipe images
- ✅ Dynamic ingredient management (add/remove)
- ✅ "To taste" quantity support for seasonings
- ✅ Full-page recipe detail view with hero image

### Discovery & Organization

- ✅ Search recipes by title or ingredient
- ✅ Sort by title, category, date, or cook time
- ✅ Pagination (10 recipes per page)
- ✅ Recipe cards with hero images

### UI/UX Features

- ✅ Modal-based authentication (login, register, password change, profile update)
- ✅ Full-page recipe detail with hero image and stats
- ✅ Recipe card list view for browsing
- ✅ Responsive design (mobile, tablet, desktop)
- ✅ Loading states and spinners
- ✅ Toast notifications for user actions
- ✅ Error handling with helpful messages
- ✅ Dashboard with user profile
- ✅ Avatar with initials and custom colors

## 📦 Prerequisites

- **Node.js** 18.x or higher
- **npm** 9.x or higher
- **Backend API** running (see [Backend Setup](https://github.com/GabbyFerm/Savory-Backend))

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/GabbyFerm/Savory-Frontend.git
cd Savory-Frontend
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Create a `.env` file in the root directory:

```bash
cp .env.example .env
```

Update with your backend API URL:

```env
VITE_API_URL=https://localhost:7286/api
```

### 4. Start Development Server

```bash
npm run dev
```

The app will be available at `http://localhost:5173`

### 5. Build for Production

```bash
npm run build
```

Built files will be in the `dist/` directory.

## 🔐 Environment Variables

| Variable       | Description          | Example                      |
| -------------- | -------------------- | ---------------------------- |
| `VITE_API_URL` | Backend API base URL | `https://localhost:7286/api` |

**Note:** Vite requires the `VITE_` prefix for environment variables to be exposed to the client.

## 📜 Available Scripts

### Development

```bash
npm run dev          # Start development server with hot reload
npm run build        # Build for production
npm run preview      # Preview production build locally
```

### Code Quality

```bash
npm run lint         # Run ESLint
npm run lint:fix     # Auto-fix ESLint issues
npm run format       # Format code with Prettier
npm run format:check # Check code formatting
```

### CI/CD

```bash
npm ci               # Clean install (for CI)
npm run build        # Production build
npm run lint         # Lint check
npm run format:check # Format check
```

## 📁 Project Structure

```
savory-frontend/
├── public/              # Static assets
├── src/
│   ├── api/            # API client configuration
│   │   └── axios.ts    # Axios instance with interceptors
│   ├── components/     # Reusable components
|   |   ├── auth/       # Authentication modals
│   │   │   ├── LoginModal.tsx
│   │   │   └── RegisterModal.tsx
│   │   ├── common/     # Shared UI components
│   │   │   ├── Avatar.tsx
│   │   │   ├── Button.tsx
│   │   │   ├── ImageUpload.tsx
│   │   │   ├── Input.tsx
│   │   │   ├── Navbar.tsx
│   │   │   ├── Pagination.tsx
│   │   │   └── ProtectedRoute.tsx
│   │   ├── dashboard/     # Dashboard components
│   │   │   └── StatCard.tsx
│   │   ├── layout/     # Layout components
│   │   │   ├── Footer.tsx
│   │   │   ├── Header.tsx
│   │   │   ├── HeroImage.tsx
│   │   │   ├── Layout.tsx
│   │   │   └── PageHeading.tsx
│   │   ├── profile/     # User profile components
│   │   │   ├── ChangePasswordModal.tsx
│   │   │   └── EditProfileModal.tsx
│   │   └── recipe/     # Recipe page components
│   │       └── RecipeForm.tsx
│   ├── context/        # React Context providers
│   │   └── AuthContext.tsx
│   ├── pages/          # Page components (routes)
│   │   ├── Landing.tsx
│   │   ├── Dashboard.tsx
│   │   ├── MyRecipes.tsx         # Recipe card list view
│   │   ├── RecipeDetail.tsx      # Full recipe page with hero image
│   │   ├── CreateRecipe.tsx
│   │   └── EditRecipe.tsx
│   ├── types/          # TypeScript type definitions
│   │   └── index.ts
│   ├── utils/          # Utility functions
│   │   └── errorHandler.ts
│   ├── App.tsx           # Root component with routing
│   ├── main.tsx          # Application entry point
│   └── index.css         # Global styles + Tailwind
├── .env.example          # Environment variables template
├── .prettierrc           # Prettier configuration
├── eslint.config.js      # ESLint configuration
├── index.html            # Main HTML file
├── package-lock.json     # Dependency lock file
├── package.json          # Dependencies and scripts
├── postcss.config.cjs    # PostCSS configuration
├── tailwind.config.ts    # Tailwind CSS configuration
├── tsconfig.app.json     # TypeScript config for app
├── tsconfig.json         # TypeScript base configuration
├── tsconfig.node.json    # TypeScript config for Node (Vite)
└── vite.config.ts        # Vite configuration
```

## 🎨 Styling

### Tailwind Configuration

Custom color palette in `tailwind.config.ts`:

```typescript
colors: {
  primary: '#81BAB4',    // Teal
  secondary: '#FBD180',  // Gold
  darkTeal: '#32324D',   // Dark blue-gray
  accent: '#3F716C',     // Deep teal
  light: '#F5F5F5',      // Off-white
}
```

### Typography

- **Headings:** Playfair Display (serif)
- **Body:** DM Sans (sans-serif)

### Responsive Breakpoints

- **Mobile:** < 768px
- **Tablet:** 768px - 1024px
- **Desktop:** > 1024px

## 🔌 API Integration

### Axios Configuration

**Base URL:** Set via `VITE_API_URL` environment variable

**Interceptors:**

- **Request:** Automatically adds JWT token to Authorization header
- **Response:** Handles 401 errors and refreshes tokens automatically

### Authentication Flow

1. User logs in → Receives `accessToken` (1 hour) and `refreshToken` (7 days)
2. Both tokens stored in localStorage
3. Access token sent with every API request
4. On 401 error → Automatically calls `/auth/refresh`
5. New tokens received → Original request retried
6. If refresh fails → User logged out

### API Endpoints Used

```
POST   /auth/register       # Register new user
POST   /auth/login          # Login user
POST   /auth/refresh        # Refresh access token

GET    /recipe              # Get user's recipes (paginated, filtered, sorted)
GET    /recipe/{id}         # Get single recipe
POST   /recipe              # Create recipe
PUT    /recipe/{id}         # Update recipe
DELETE /recipe/{id}         # Delete recipe
POST   /recipe/{id}/image   # Upload recipe image

GET    /category            # Get all categories
GET    /ingredient          # Get all ingredients
```

## 🏗️ Architecture

### Routing Structure

The app uses **React Router v6** for client-side routing:

```
/                    → Landing page
/dashboard           → User dashboard with profile
/my-recipes          → Recipe list (cards, pagination)
/recipe/:id          → Recipe detail page (full view with hero image)
/create-recipe       → Create new recipe form
/edit-recipe/:id     → Edit existing recipe form
```

### Modal System

Authentication and profile management use **modal dialogs** instead of dedicated pages:

- **Login Modal** - Email/password authentication
- **Register Modal** - New user registration with avatar selection
- **Change Password Modal** - Update user password
- **Update Profile Modal** - Edit username, email, avatar color

### State Management

- **Global State:** React Context API (AuthContext)
- **Local State:** React useState/useReducer hooks
- **Server State:** Axios with automatic token refresh

### Component Architecture

```
┌─────────────────────────────────────┐
│           App (Router)              │
├─────────────────────────────────────┤
│         AuthProvider                │
├─────────────────────────────────────┤
│     ┌─────────┐    ┌─────────┐    │
│     │  Pages  │    │ Modals  │    │
│     └────┬────┘    └────┬────┘    │
│          │              │          │
│     ┌────▼──────────────▼────┐    │
│     │   Shared Components    │    │
│     │ (Button, Input, etc.)  │    │
│     └────────────────────────┘    │
└─────────────────────────────────────┘
```

## 🚀 Deployment

### Manual Deployment

1. Build the project:

```bash
npm run build
```

2. Upload `dist/` folder to your hosting provider

3. Configure your server to:
   - Serve `index.html` for all routes (client-side routing fallback)
   - Set proper CORS headers
   - Enable HTTPS
   - Set environment variables

**Note:** Even though the app has multiple pages, it's still a Single Page Application (SPA) in the technical sense - all routing happens client-side, so your server must redirect all routes to `index.html`.

### Environment Variables for Production

Update `.env` for production:

```env
VITE_API_URL=https://your-production-api.com/api
```

## 📝 Notes

### Known Issues

- Image upload is local only (stored in backend wwwroot/images)
- No pagination on ingredient list

### Future Improvements

- [ ] Add unit tests (Vitest + React Testing Library)
- [ ] Add E2E tests (Playwright)
- [ ] Implement dark mode
- [ ] Add recipe sharing functionality
- [ ] Implement meal planning calendar
- [ ] Add shopping list generation
- [ ] Add nutritional information
- [ ] Migrate to cloud image storage (Cloudinary)
- [ ] Add recipe import from URLs
- [ ] Implement offline support (PWA)

## 👤 Author

**Gabriella Frank Ferm**

- GitHub: [@GabbyFerm](https://github.com/GabbyFerm)
- Email: gabbzf@gmail.com

## 📄 License

This project is for educational purposes as part of a school assignment.

---

**Built with ❤️ using React, TypeScript, and Tailwind CSS.**
