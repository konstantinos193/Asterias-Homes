// Centralized logging utility with Sentry integration
// In production, errors are automatically sent to Sentry

type LogLevel = 'debug' | 'info' | 'warn' | 'error'

interface LogEntry {
  level: LogLevel
  message: string
  meta?: Record<string, unknown>
  error?: Error
  timestamp: string
}

// Lazy load Sentry to avoid issues in edge runtime or when Sentry is not configured
let Sentry: typeof import('@sentry/nextjs') | null = null

const getSentry = async () => {
  if (Sentry === null && typeof window !== 'undefined') {
    // Client-side
    try {
      Sentry = await import('@sentry/nextjs')
    } catch {
      // Sentry not available
    }
  } else if (Sentry === null && typeof window === 'undefined') {
    // Server-side
    try {
      Sentry = await import('@sentry/nextjs')
    } catch {
      // Sentry not available
    }
  }
  return Sentry
}

class Logger {
  private isDevelopment = process.env.NODE_ENV === 'development'
  private isProduction = process.env.NODE_ENV === 'production'

  private formatMessage(entry: LogEntry): string {
    const parts = [`[${entry.timestamp}]`, `[${entry.level.toUpperCase()}]`, entry.message]
    
    if (entry.meta && Object.keys(entry.meta).length > 0) {
      parts.push(JSON.stringify(entry.meta))
    }
    
    if (entry.error) {
      parts.push(`\n${entry.error.stack || entry.error.message}`)
    }
    
    return parts.join(' ')
  }

  private async log(level: LogLevel, message: string, meta?: Record<string, unknown>, error?: Error): Promise<void> {
    const entry: LogEntry = {
      level,
      message,
      meta,
      error,
      timestamp: new Date().toISOString(),
    }

    // In development, log to console
    if (this.isDevelopment) {
      const formatted = this.formatMessage(entry)
      
      switch (level) {
        case 'debug':
          console.debug(formatted)
          break
        case 'info':
          console.info(formatted)
          break
        case 'warn':
          console.warn(formatted)
          break
        case 'error':
          console.error(formatted)
          break
      }
      
      if (entry.meta) {
        console.log('Metadata:', entry.meta)
      }
      if (entry.error) {
        console.error('Error:', entry.error)
      }
    }

    // In production, send errors to Sentry
    if (this.isProduction && level === 'error') {
      try {
        const SentryModule = await getSentry()
        if (SentryModule) {
          if (error) {
            SentryModule.captureException(error, {
              extra: meta,
              tags: {
                logger: 'true',
              },
            })
          } else {
            SentryModule.captureMessage(message, {
              level: 'error',
              extra: meta,
              tags: {
                logger: 'true',
              },
            })
          }
        }
      } catch (sentryError) {
        // Fail silently if Sentry is not available or fails
        if (this.isDevelopment) {
          console.warn('Failed to send error to Sentry:', sentryError)
        }
      }
    }
  }

  debug(message: string, meta?: Record<string, unknown>): void {
    this.log('debug', message, meta).catch(() => {})
  }

  info(message: string, meta?: Record<string, unknown>): void {
    this.log('info', message, meta).catch(() => {})
  }

  warn(message: string, meta?: Record<string, unknown>): void {
    this.log('warn', message, meta).catch(() => {})
  }

  error(message: string, error?: Error, meta?: Record<string, unknown>): void {
    this.log('error', message, meta, error).catch(() => {})
  }
}

export const logger = new Logger()

