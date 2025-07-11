# Asterias Homes

A modern hotel booking website built with Next.js, TypeScript, and Tailwind CSS.

## Features

- Multi-language support (Greek/English)
- Room booking system with Stripe payment integration
- Admin dashboard for managing bookings and rooms
- Responsive design with modern UI components
- Image galleries and testimonials

## Environment Variables

To run this project, you need to set up the following environment variables:

### Required for Production

```bash
# Stripe Configuration
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key_here
STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key_here
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key_here
```

### Getting Stripe Keys

1. Sign up for a Stripe account at https://stripe.com
2. Go to the Stripe Dashboard
3. Navigate to Developers > API Keys
4. Copy your publishable and secret keys
5. For testing, use the test keys (they start with `pk_test_` and `sk_test_`)

## Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   pnpm install
   ```
3. Set up environment variables (see above)
4. Run the development server:
   ```bash
   pnpm dev
   ```

## Build Issues Fixed

The following issues have been resolved:

1. **Import Error**: Fixed `roomsData` import to use `allRoomsData` from `@/data/rooms`
2. **Stripe Configuration**: Added proper error handling for missing environment variables
3. **Type Safety**: Fixed price parsing and room lookup logic

## Deployment

For deployment on Vercel:

1. Set the environment variables in your Vercel project settings
2. Deploy using the Vercel CLI or connect your GitHub repository
3. Ensure all environment variables are configured in the Vercel dashboard

## Tech Stack

- **Framework**: Next.js 15
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Radix UI + shadcn/ui
- **Payment**: Stripe
- **Package Manager**: pnpm 