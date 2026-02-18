// Simple API cache with rate limiting to prevent excessive requests
interface CacheEntry {
  data: any;
  timestamp: number;
  ttl: number; // Time to live in milliseconds
}

interface PendingRequest {
  promise: Promise<any>;
  timestamp: number;
}

class ApiCache {
  private cache = new Map<string, CacheEntry>();
  private pendingRequests = new Map<string, PendingRequest>();
  private readonly DEFAULT_TTL = 5 * 60 * 1000; // 5 minutes
  private readonly REQUEST_TIMEOUT = 10 * 1000; // 10 seconds

  // Generate cache key from URL and options
  private generateKey(url: string, options?: RequestInit): string {
    const method = options?.method || 'GET';
    const body = options?.body ? JSON.stringify(options.body) : '';
    return `${method}:${url}:${body}`;
  }

  // Check if cache entry is still valid
  private isValid(entry: CacheEntry): boolean {
    return Date.now() - entry.timestamp < entry.ttl;
  }

  // Clean up expired entries
  private cleanup(): void {
    const now = Date.now();
    for (const [key, entry] of this.cache.entries()) {
      if (now - entry.timestamp >= entry.ttl) {
        this.cache.delete(key);
      }
    }

    // Clean up old pending requests
    for (const [key, request] of this.pendingRequests.entries()) {
      if (now - request.timestamp >= this.REQUEST_TIMEOUT) {
        this.pendingRequests.delete(key);
      }
    }
  }

  // Get cached data or fetch new data
  async get(url: string, options?: RequestInit, ttl: number = this.DEFAULT_TTL): Promise<any> {
    this.cleanup();
    
    const key = this.generateKey(url, options);
    
    // Check cache first
    const cached = this.cache.get(key);
    if (cached && this.isValid(cached)) {
      console.log('📦 Cache hit for:', key);
      return cached.data;
    }

    // Check if there's already a pending request for the same key
    const pending = this.pendingRequests.get(key);
    if (pending && Date.now() - pending.timestamp < this.REQUEST_TIMEOUT) {
      console.log('⏳ Request deduplication for:', key);
      return pending.promise;
    }

    // Make new request
    console.log('🌐 Making new request for:', key);
    const promise = fetch(url, options)
      .then(async (response) => {
        const data = await response.json();
        
        // Cache the successful response
        this.cache.set(key, {
          data,
          timestamp: Date.now(),
          ttl
        });
        
        // Remove from pending requests
        this.pendingRequests.delete(key);
        
        return data;
      })
      .catch((error) => {
        // Remove from pending requests on error
        this.pendingRequests.delete(key);
        throw error;
      });

    // Add to pending requests
    this.pendingRequests.set(key, {
      promise,
      timestamp: Date.now()
    });

    return promise;
  }

  // Clear cache
  clear(): void {
    this.cache.clear();
    this.pendingRequests.clear();
  }

  // Clear specific URL from cache
  clearUrl(url: string, options?: RequestInit): void {
    const key = this.generateKey(url, options);
    this.cache.delete(key);
    this.pendingRequests.delete(key);
  }

  // Get cache stats
  getStats(): { cacheSize: number; pendingRequests: number } {
    return {
      cacheSize: this.cache.size,
      pendingRequests: this.pendingRequests.size
    };
  }
}

// Global cache instance
export const apiCache = new ApiCache();

// Enhanced fetch function with caching
export async function cachedFetch(url: string, options?: RequestInit, ttl?: number): Promise<Response> {
  const data = await apiCache.get(url, options, ttl);
  
  // Create a mock Response object
  return new Response(JSON.stringify(data), {
    status: 200,
    statusText: 'OK',
    headers: {
      'Content-Type': 'application/json',
    },
  });
}

// Rate limiting helper
export class RateLimiter {
  private requests = new Map<string, number[]>();
  private readonly windowMs: number;
  private readonly maxRequests: number;

  constructor(windowMs: number = 1000, maxRequests: number = 10) {
    this.windowMs = windowMs;
    this.maxRequests = maxRequests;
  }

  canMakeRequest(key: string = 'default'): boolean {
    const now = Date.now();
    const requests = this.requests.get(key) || [];
    
    // Remove old requests outside the window
    const validRequests = requests.filter(timestamp => now - timestamp < this.windowMs);
    
    if (validRequests.length >= this.maxRequests) {
      return false;
    }
    
    // Add current request
    validRequests.push(now);
    this.requests.set(key, validRequests);
    
    return true;
  }

  getRemainingRequests(key: string = 'default'): number {
    const now = Date.now();
    const requests = this.requests.get(key) || [];
    const validRequests = requests.filter(timestamp => now - timestamp < this.windowMs);
    return Math.max(0, this.maxRequests - validRequests.length);
  }

  reset(key?: string): void {
    if (key) {
      this.requests.delete(key);
    } else {
      this.requests.clear();
    }
  }
}

// Global rate limiter for availability checks
export const availabilityRateLimiter = new RateLimiter(1000, 5); // 5 requests per second per endpoint
