# Asterias Homes - Frontend Application

![Next.js](https://img.shields.io/badge/Next.js-16.1.1-000000?style=for-the-badge&logo=next.js&logoColor=white)
![React](https://img.shields.io/badge/React-19.2.3-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9.3-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-4.1.18-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Stripe](https://img.shields.io/badge/Stripe-20.1.2-635BFF?style=for-the-badge&logo=stripe&logoColor=white)

## Overview

Welcome to the frontend graveyard where React components go to die (and sometimes get resurrected after a refresh). This is the Next.js 16 frontend for Asterias Homes - a hotel management system built with TypeScript, React 19, and Tailwind CSS. It handles booking flows, admin dashboards, payment processing, and apparently your sanity if you stare at the component tree long enough.

Built with love, TypeScript strict mode, and questionable state management decisions that somehow work in production.

**Live Website**: [https://asteriashome.gr](https://asteriashome.gr)

## Technologies Used

- **Framework**: Next.js 16.1.1 with App Router (because pages are old news)
- **React**: 19.2.3 (because React 18 is for peasants)
- **TypeScript**: 5.9.3 (because JavaScript is too forgiving)
- **Styling**: Tailwind CSS 4.1.18 (utility-first, because writing CSS is 2010)
- **UI Components**: Radix UI primitives (because accessible components shouldn't be optional)
- **Form Management**: React Hook Form 7.70.0 with Zod 4.3.5 validation
- **State Management**: TanStack Query 5.90.16 (because Redux is dead)
- **Payment**: Stripe React 5.4.1 and Stripe.js 8.6.1
- **Icons**: Lucide React 0.562.0 (because icons matter)
- **Date Handling**: date-fns 4.1.0 and react-day-picker 9.13.0
- **Maps**: Leaflet 1.9.4 and React Leaflet 5.0.0
- **Theming**: next-themes 0.4.6 (dark mode support)
- **Backend**: Express.js backend with MongoDB (all database operations via API)
- **Charts**: Recharts 3.6.0 (because data visualization shouldn't be painful)
- **Excel Export**: xlsx 0.18.5 (for when you need to export data to Excel, for some reason)
- **Toast Notifications**: Sonner 2.0.7 (because users need feedback)
- **Authentication**: Jose 6.1.3 (JWT handling, because tokens are trendy)

## Requirements

- **Node.js**: Version 18.0.0 or higher (lower versions will mock you)
- **Package Manager**: Yarn 1.22.22 (or npm if you're basic, but yarn is recommended)
- **Backend Service**: Asterias-Backend must be running (or nothing works)
- **Stripe Account**: For payment processing (because free money isn't a thing)
- **Backend API**: Either local backend or production URL configured

## Installation

### 1. Clone and Navigate
```bash
git clone <repository-url>
cd Asterias-Homes
```

### 2. Install Dependencies
```bash
yarn install
# OR if you prefer npm (we won't judge, much)
npm install
```

This will download approximately 500MB of `node_modules` because JavaScript. Go grab coffee.

### 3. Environment Configuration
Create `.env.local` in the frontend root (or watch everything break):

```env
# Backend API URL
NEXT_PUBLIC_BACKEND_URL=http://localhost:5000
# OR for production:
# NEXT_PUBLIC_BACKEND_URL=https://asterias-backend.onrender.com

# Stripe Configuration
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret

# Authentication
JWT_SECRET=your_super_secret_jwt_key_here
NEXTAUTH_SECRET=your_nextauth_secret_if_using_nextauth

# Email (if using email features in frontend API routes)
EMAIL_USER=your_gmail@gmail.com
EMAIL_APP_PASSWORD=your_gmail_app_password

# Admin Configuration
ADMIN_EMAIL=admin@asteriashomes.com
```

## Running the Project

### Development Mode
```bash
yarn dev
# OR
npm run dev
```

This starts the Next.js development server with Turbopack. It watches files, hot reloads when you save, and occasionally crashes for no apparent reason. Perfect for development.

The app will be available at `http://localhost:3000` (or whatever port Next.js chooses).

### Production Build
```bash
yarn build
# OR
npm run build
```

This builds the production bundle. It might take a while. Go grab coffee.

### Production Start
```bash
yarn start
# OR
npm start
```

This runs the production server. Make sure you built it first, or this will fail spectacularly.

### Linting
```bash
yarn lint
# OR
npm run lint
```

This checks your code for style violations and TypeScript errors. It will probably complain about something.

## Key Features

### Multilingual Support
- **3 Languages**: Greek (ελληνικά), English, German (Deutsch)
- **Smart Language Detection**: Automatically detects language from URL paths (`/el/`, `/en/`, `/de/`)
- **Localized Content**: All pages, forms, and components adapt to user's language
- **Language Context**: Custom React context for language management

### Booking System
- **Multi-step Booking Wizard**: Step-by-step booking process with validation
- **Date Selection**: Advanced date picker with availability checking
- **Room Selection**: Browse and select rooms with real-time availability
- **Guest Information**: Collect guest details with form validation
- **Payment Processing**: Stripe integration for secure payments
- **Cash Booking**: Support for cash on arrival bookings

### Admin Dashboard
- **Booking Management**: View, edit, and manage all bookings
- **Room Management**: Create, edit, and delete rooms
- **Guest Management**: View and manage guest information
- **Offer Management**: Create and manage special offers and promotions
- **Analytics & Reports**: Revenue tracking, occupancy rates, booking statistics
- **Settings**: Configure system settings and preferences
- **Profile Management**: Admin profile and password management

### Public Pages
- **Homepage**: Hero section, featured rooms, special offers
- **Rooms**: Room listings with filtering and search
- **Room Details**: Individual room pages with image galleries
- **Offers**: Special offers and promotions listing
- **Offer Details**: Individual offer pages
- **Gallery**: Photo gallery of the property
- **About**: Information about the property
- **Contact**: Contact form with map integration
- **Privacy & Terms**: Legal pages
- **Booking Success**: Confirmation page after successful booking
- **User Bookings**: Users can view their own bookings

### Payment Processing
- **Stripe Integration**: Secure card payment processing
- **Payment Intent Creation**: Server-side payment intent creation
- **Payment Confirmation**: Confirms payment and creates booking
- **Cash Booking Support**: Create bookings without payment
- **VAT Calculation**: Automatic 13% VAT calculation (Greek tax compliance)

### API Routes
- **Authentication**: JWT-based authentication endpoints
- **Admin API**: Proxy routes for admin operations
- **Payment API**: Stripe payment processing routes
- **Image API**: Image upload and serving
- **Offers API**: Offer management endpoints
- **Rooms API**: Room data endpoints

### UI Components
- **shadcn/ui**: Comprehensive component library based on Radix UI
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Dark Mode**: Theme switching support (if implemented)
- **Accessibility**: ARIA-compliant components
- **Animations**: Smooth transitions and interactions

## Project Structure

```
Asterias-Homes/
├── app/                          # Next.js App Router
│   ├── [lang]/                   # Internationalized routes
│   │   ├── about/               # About page
│   │   ├── book/                # Booking pages
│   │   │   └── [roomId]/       # Book specific room
│   │   ├── bookings/            # User bookings
│   │   ├── contact/             # Contact page
│   │   ├── gallery/             # Photo gallery
│   │   ├── offers/              # Special offers
│   │   │   └── [offerId]/      # Offer detail page
│   │   ├── rooms/               # Room listings
│   │   │   └── [roomId]/       # Room detail page
│   │   ├── success/             # Payment success
│   │   ├── privacy/             # Privacy policy
│   │   ├── terms/               # Terms of service
│   │   ├── layout.tsx           # Language-specific layout
│   │   └── page.tsx             # Homepage
│   ├── admin/                   # Admin dashboard
│   │   ├── bookings/            # Booking management
│   │   │   ├── [bookingId]/    # Booking detail
│   │   │   └── page.tsx        # Bookings list
│   │   ├── guests/              # Guest management
│   │   │   ├── [guestId]/      # Guest detail
│   │   │   └── page.tsx        # Guests list
│   │   ├── offers/              # Offer management
│   │   │   ├── new/            # Create offer
│   │   │   ├── edit/[offerId]/ # Edit offer
│   │   │   └── page.tsx        # Offers list
│   │   ├── reports/             # Analytics & reports
│   │   ├── rooms/               # Room management
│   │   │   ├── new/            # Create room
│   │   │   ├── [roomId]/       # Edit room
│   │   │   └── page.tsx        # Rooms list
│   │   ├── settings/            # System settings
│   │   ├── profile/             # Admin profile
│   │   ├── login/               # Admin login
│   │   ├── layout.tsx           # Admin layout
│   │   ├── AuthGuard.tsx        # Authentication guard
│   │   └── page.tsx             # Admin dashboard
│   ├── api/                     # Next.js API routes
│   │   ├── admin/               # Admin API endpoints
│   │   │   ├── analytics/      # Analytics endpoint
│   │   │   ├── revenue-reports/ # Revenue reports
│   │   │   └── [...admin]/     # Admin API proxy
│   │   ├── auth/                # Authentication
│   │   │   ├── [...auth]/      # Auth API proxy
│   │   │   └── session/        # Session endpoint
│   │   ├── confirm-payment/     # Payment confirmation
│   │   ├── create-payment-intent/ # Stripe payment intent
│   │   ├── images/              # Image handling
│   │   │   ├── upload/         # Image upload
│   │   │   └── [imageName]/    # Image serving
│   │   ├── offers/              # Offers API
│   │   │   ├── [id]/           # Specific offer
│   │   │   └── route.ts        # Offers list
│   │   ├── rooms/               # Rooms API
│   │   └── test/                # Test endpoint
│   ├── layout.tsx               # Root layout
│   ├── page.tsx                 # Root page (redirects to language)
│   ├── globals.css              # Global styles
│   ├── sitemap.ts               # Sitemap generation
│   └── robots.ts                # Robots.txt generation
├── components/                   # React components
│   ├── admin/                   # Admin-specific components
│   │   ├── image-upload.tsx    # Image upload component
│   │   └── room-image-editor.tsx # Room image editor
│   ├── booking-steps/           # Booking wizard steps
│   │   ├── step-confirmation.tsx
│   │   ├── step-dates.tsx
│   │   ├── step-guest-info.tsx
│   │   ├── step-payment.tsx
│   │   └── step-room-details.tsx
│   ├── booking-wizard.tsx       # Main booking wizard
│   ├── seo/                     # SEO components
│   │   ├── page-seo.tsx        # Page SEO metadata
│   │   ├── seo-head.tsx        # SEO head component
│   │   ├── structured-data.tsx # Structured data
│   │   ├── performance-optimizer.tsx # Performance optimization
│   │   └── index.ts            # SEO utilities
│   ├── ui/                      # Reusable UI components (shadcn/ui)
│   │   ├── button.tsx
│   │   ├── input.tsx
│   │   ├── card.tsx
│   │   ├── dialog.tsx
│   │   ├── table.tsx
│   │   ├── form.tsx
│   │   ├── calendar.tsx
│   │   ├── date-picker.tsx
│   │   ├── chart.tsx
│   │   └── ... (many more)
│   ├── header.tsx               # Site header/navigation
│   ├── footer.tsx               # Site footer
│   ├── hero.tsx                 # Hero section
│   ├── hero-slider.tsx          # Hero image slider
│   ├── room-card.tsx            # Room card component
│   ├── room-selection.tsx       # Room selection component
│   ├── special-offers-section.tsx # Offers section
│   ├── features-section.tsx     # Features section
│   ├── testimonial-section.tsx  # Testimonials
│   ├── welcome-section.tsx      # Welcome section
│   ├── contact-map.tsx          # Contact map component
│   ├── mobile-nav.tsx           # Mobile navigation
│   ├── stripe-provider.tsx      # Stripe provider wrapper
│   ├── theme-provider.tsx       # Theme provider
│   └── memory-monitor-init.tsx  # Memory monitoring
├── hooks/                       # Custom React hooks
│   ├── api/                     # API hooks
│   │   ├── use-admin.ts        # Admin operations
│   │   ├── use-bookings.ts     # Booking operations
│   │   ├── use-offers.ts       # Offer operations
│   │   ├── use-payments.ts     # Payment operations
│   │   ├── use-rooms.ts        # Room operations
│   │   └── index.ts            # Hooks exports
│   ├── use-auth.tsx             # Authentication hook
│   └── use-mobile.tsx           # Mobile detection hook
├── lib/                         # Utility libraries
│   ├── api-client.ts            # Unified API client (direct backend calls)
│   ├── api.ts                   # Legacy API layer (if exists)
│   ├── backend-url.ts           # Backend URL utilities
│   ├── errors.ts                # Error handling utilities
│   ├── image-utils.ts           # Image utility functions
│   ├── logger.ts                # Logging utilities
│   ├── memory-monitor.ts        # Memory monitoring
│   ├── query-client.tsx         # React Query client setup
│   ├── seo-config.ts            # SEO configuration
│   ├── translations.ts          # i18n translations
│   └── utils.ts                 # General utilities
├── contexts/                    # React contexts
│   ├── language-context.tsx     # Language context
│   └── ... (other contexts)
├── types/                       # TypeScript type definitions
│   └── booking.ts               # Booking types
├── data/                        # Static data (if any)
├── public/                      # Static assets
├── styles/                      # Global styles (if any)
├── proxy.ts                     # Middleware for language routing
├── middleware.ts                # Next.js middleware
├── tailwind.config.ts           # Tailwind configuration
├── tsconfig.json                # TypeScript configuration
├── next.config.mjs              # Next.js configuration
├── postcss.config.mjs           # PostCSS configuration
├── components.json              # shadcn/ui configuration
├── package.json                 # Dependencies and scripts
└── README.md                    # This file (you're reading it, congrats)
```

## Authentication

The frontend uses JWT-based authentication for admin routes:
- **Admin Login**: `/admin/login`
- **Protected Routes**: Admin routes are protected by `AuthGuard`
- **Token Storage**: JWT tokens stored in cookies
- **Session Management**: Token refresh and validation

## API Integration

The frontend communicates with the backend API through:
- **Direct API Client**: `lib/api-client.ts` - Direct backend calls
- **React Query Hooks**: Custom hooks in `hooks/api/` for data fetching
- **API Proxy Routes**: Some API routes in `app/api/` proxy to backend
- **Error Handling**: Centralized error handling in `lib/errors.ts`

## Styling

- **Tailwind CSS**: Utility-first CSS framework
- **Custom Components**: shadcn/ui component library
- **Responsive Design**: Mobile-first approach
- **Theme Support**: Dark mode support via `next-themes`

## SEO

- **Sitemap Generation**: Dynamic sitemap via `app/sitemap.ts`
- **Robots.txt**: Generated via `app/robots.ts`
- **Structured Data**: JSON-LD structured data for better SEO
- **Meta Tags**: Dynamic meta tags per page
- **Performance**: Image optimization, code splitting, lazy loading

## Development

### Adding New Features
1. Create components in `components/`
2. Add pages in `app/`
3. Create API hooks in `hooks/api/`
4. Add types in `types/`
5. Update translations if needed
6. Test it (ha, good one)
7. Update this README (or don't, nobody reads these anyway)

### TypeScript
The project uses strict TypeScript. Errors are your friend. Embrace them.

### Linting
ESLint is configured. It will complain about your code style. Fix it.

## Troubleshooting

### Build Errors
- Check TypeScript errors: `yarn tsc --noEmit`
- Verify all environment variables are set
- Check if backend API is accessible
- Clear `.next` folder and rebuild

### API Connection Issues
- Verify `NEXT_PUBLIC_BACKEND_URL` is set correctly
- Check if backend service is running
- Check CORS configuration on backend
- Verify authentication tokens

### Styling Issues
- Clear Tailwind cache
- Verify Tailwind config
- Check if PostCSS is configured correctly

### Payment Issues
- Verify Stripe keys are set correctly
- Check Stripe dashboard for errors
- Verify webhook configuration
- Test with Stripe test cards

### Type Errors
- Run `yarn tsc --noEmit` to see all errors
- Check type definitions in `types/`
- Verify API response types match expected types
- Fix the errors (there's no escape)

## Deployment

### Vercel Deployment
The project is deployed on Vercel. Configuration:
- Framework: Next.js
- Build Command: `yarn build`
- Output Directory: `.next`
- Node Version: 18.x or higher

### Environment Variables
Set all required environment variables in Vercel dashboard:
- `NEXT_PUBLIC_BACKEND_URL`
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
- `STRIPE_SECRET_KEY`
- `JWT_SECRET`
- Other required variables

### Build Optimization
- Image optimization is enabled
- Code splitting is automatic
- Static pages are pre-rendered
- Dynamic routes use ISR or SSR as needed

## Known Issues

- Some admin routes might not require authentication (by design or oversight)
- Memory monitoring might not work in all environments
- TypeScript strict mode might complain about legacy code
- Some components might have accessibility issues (fix them)
- The codebase has evolved over time, so some parts are cleaner than others

## Contributing

If you want to contribute:
1. Don't break production
2. Test your changes
3. Follow TypeScript strict mode
4. Update documentation
5. Follow existing code style (or don't, consistency is overrated)

## License

MIT License - because who wants license drama?

## Contact

For questions, complaints, or existential crises about this codebase:
- **Company**: Adinfinity
- **Email**: adenfinity@gmail.com

**Live Website**: [https://asteriashome.gr](https://asteriashome.gr)

---

**Final Note**: This frontend works with the Asterias-Backend API service. Make sure the backend is running and properly configured, or you'll have a bad time. The codebase uses Next.js 16 with React 19, so expect some breaking changes and occasional existential crises when dependencies update.

**Good luck, and may your components never re-render unnecessarily.**
