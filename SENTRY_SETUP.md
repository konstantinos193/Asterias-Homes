# Sentry Error Tracking Setup

This project uses [Sentry](https://sentry.io) for error tracking and monitoring in production.

## Setup Instructions

### 1. Create a Sentry Account

1. Go to [https://sentry.io](https://sentry.io) and create an account
2. Create a new project for this Next.js application
3. Select "Next.js" as the platform

### 2. Get Your DSN

After creating the project, Sentry will provide you with a DSN (Data Source Name). It looks like:
```
https://xxxxx@xxxxx.ingest.sentry.io/xxxxx
```

### 3. Configure Environment Variables

Add the following environment variables to your `.env.local` file (for local development) and your production environment:

```env
# Sentry Configuration
NEXT_PUBLIC_SENTRY_DSN=https://xxxxx@xxxxx.ingest.sentry.io/xxxxx
SENTRY_ORG=your-org-name
SENTRY_PROJECT=your-project-name

# Optional: Enable Sentry in development (default: disabled)
# NEXT_PUBLIC_SENTRY_DEBUG=true
```

### 4. Environment-Specific Configuration

- **Development**: Sentry is disabled by default to avoid cluttering your Sentry dashboard during development. Set `NEXT_PUBLIC_SENTRY_DEBUG=true` if you want to test Sentry locally.

- **Production**: Sentry automatically captures errors and sends them to your Sentry dashboard.

## How It Works

### Automatic Error Tracking

1. **Error Boundaries**: Errors caught by React error boundaries (`error.tsx`, `global-error.tsx`) are automatically sent to Sentry
2. **Logger Integration**: Errors logged via `logger.error()` are sent to Sentry in production
3. **Unhandled Errors**: Unhandled exceptions and promise rejections are automatically captured

### Manual Error Reporting

You can manually capture errors or messages:

```typescript
import * as Sentry from "@sentry/nextjs"

// Capture an exception
try {
  // some code
} catch (error) {
  Sentry.captureException(error)
}

// Capture a message
Sentry.captureMessage("Something went wrong", "error")
```

### Adding Context

You can add additional context to errors:

```typescript
Sentry.setUser({ id: "123", email: "user@example.com" })
Sentry.setTag("page", "booking")
Sentry.setContext("booking", { bookingId: "abc123" })
```

## Features Enabled

- **Session Replay**: Records user sessions when errors occur (10% sample rate)
- **Source Maps**: Automatically uploads source maps for better error stack traces
- **Performance Monitoring**: Tracks performance metrics (10% sample rate in production)
- **React Component Annotations**: Shows React component props/state in error reports

## Viewing Errors

1. Go to your Sentry dashboard
2. Navigate to your project
3. View errors, performance metrics, and session replays

## Disabling Sentry

To disable Sentry completely, simply don't set the `NEXT_PUBLIC_SENTRY_DSN` environment variable. The application will work normally without error tracking.

## Troubleshooting

### Errors not appearing in Sentry

1. Check that `NEXT_PUBLIC_SENTRY_DSN` is set correctly
2. Verify you're in production mode (`NODE_ENV=production`)
3. Check browser console for Sentry initialization errors
4. Ensure source maps are being uploaded (check build logs)

### Too many errors in development

Sentry is disabled by default in development. If you're seeing errors, check that `NEXT_PUBLIC_SENTRY_DEBUG` is not set to `true`.

## More Information

- [Sentry Next.js Documentation](https://docs.sentry.io/platforms/javascript/guides/nextjs/)
- [Sentry Dashboard](https://sentry.io)

