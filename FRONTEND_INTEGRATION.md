# Frontend-Backend Integration Guide

This document explains how the frontend has been updated to work with the new backend API.

## Overview

The frontend has been updated to use the new Express.js backend instead of static data and mock APIs. Here are the key changes:

## API Service Layer

### New API Service (`lib/api.ts`)

Created a comprehensive API service layer that handles all communication with the backend:

- **Authentication API**: Login, register, logout, profile management
- **Rooms API**: Get rooms, check availability
- **Bookings API**: Create bookings, get user bookings, cancel bookings
- **Offers API**: Get offers, validate codes
- **Contact API**: Submit contact forms
- **Payments API**: Create payment intents, confirm payments
- **Admin API**: Dashboard data, user management, booking management

### Key Features

- Automatic token management (stores/removes JWT tokens)
- Error handling and response parsing
- TypeScript support with proper typing
- Query parameter handling for filtering and pagination

## Updated Components

### 1. Contact Form (`app/contact/page.tsx`)

- **Before**: Simulated form submission
- **After**: Real API calls to backend contact endpoint
- **Added**: Error handling and success messages
- **Added**: Subject field for contact form

### 2. Booking Wizard (`components/booking-wizard.tsx`)

- **Before**: Used local API route for payment intent
- **After**: Uses backend payment API
- **Updated**: Payment flow to work with backend
- **Fixed**: TypeScript types for booking data

### 3. Admin Dashboard (`app/admin/page.tsx`)

- **Before**: Static mock data
- **After**: Real data from backend dashboard API
- **Added**: Loading states and error handling
- **Added**: Fallback to mock data if API fails

## Authentication System

### New Auth Hook (`hooks/use-auth.ts`)

Created a React context-based authentication system:

- **User state management**: Stores current user data
- **Token management**: Handles JWT tokens automatically
- **Login/Register**: API integration for user authentication
- **Profile updates**: User profile management
- **Auto-login**: Checks for existing tokens on app start

### Admin Login (`app/admin/login/page.tsx`)

- Simple login form for admin access
- Error handling and loading states
- Redirects to admin dashboard on success

### Route Protection (`middleware.ts`)

- Protects admin routes from unauthorized access
- Redirects to login if no valid token
- Handles token validation

## Environment Configuration

### Required Environment Variables

Create a `.env.local` file in the frontend root:

```bash
# Backend API URL
NEXT_PUBLIC_API_URL=http://localhost:5000/api

# Stripe Configuration
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key_here

# Other Configuration
NEXT_PUBLIC_APP_NAME=Asterias Homes
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## Setup Instructions

### 1. Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   ```bash
   cp env.example .env
   # Edit .env with your configuration
   ```

4. Start the backend:
   ```bash
   npm run dev
   ```

### 2. Frontend Setup

1. Create environment file:
   ```bash
   cp .env.local.example .env.local
   # Edit .env.local with your configuration
   ```

2. Install dependencies (if not already done):
   ```bash
   npm install
   ```

3. Start the frontend:
   ```bash
   npm run dev
   ```

## API Endpoints Used

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `GET /api/auth/profile` - Get user profile
- `POST /api/auth/logout` - User logout

### Rooms
- `GET /api/rooms` - Get all rooms
- `GET /api/rooms/:id` - Get single room
- `GET /api/rooms/:id/availability` - Check availability

### Bookings
- `POST /api/bookings` - Create booking
- `GET /api/bookings/my-bookings` - Get user bookings
- `POST /api/bookings/:id/cancel` - Cancel booking

### Payments
- `POST /api/payments/create-payment-intent` - Create payment intent
- `POST /api/payments/confirm-payment` - Confirm payment

### Contact
- `POST /api/contact` - Submit contact form

### Admin
- `GET /api/admin/dashboard` - Dashboard data
- `GET /api/admin/stats` - System statistics

## Error Handling

The frontend now includes comprehensive error handling:

- **API errors**: Displayed to users with meaningful messages
- **Network errors**: Graceful fallbacks and retry mechanisms
- **Validation errors**: Form validation with backend feedback
- **Authentication errors**: Automatic logout on token expiration

## Security Features

- **JWT tokens**: Secure authentication with automatic token management
- **CORS**: Properly configured for frontend-backend communication
- **Input validation**: Both client and server-side validation
- **Error sanitization**: Prevents sensitive information leakage

## Development Workflow

1. **Backend first**: Start the backend server
2. **Frontend second**: Start the frontend development server
3. **Test integration**: Verify API calls work correctly
4. **Monitor logs**: Check both frontend and backend logs for errors

## Troubleshooting

### Common Issues

1. **CORS errors**: Ensure backend CORS is configured for frontend URL
2. **API connection errors**: Check if backend is running and accessible
3. **Authentication issues**: Verify JWT tokens are being sent correctly
4. **Environment variables**: Ensure all required env vars are set

### Debug Tips

- Check browser network tab for API calls
- Monitor backend console for incoming requests
- Verify environment variables are loaded correctly
- Test API endpoints directly with tools like Postman

## Next Steps

1. **Add more admin features**: Room management, user management
2. **Implement real-time updates**: WebSocket integration
3. **Add file uploads**: Image upload for rooms and offers
4. **Enhance security**: Add rate limiting, CSRF protection
5. **Performance optimization**: Add caching, pagination 