// Centralized error handling utilities

export class ApiError extends Error {
  status: number
  data?: unknown

  constructor(message: string, status: number, data?: unknown) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.data = data
    Object.setPrototypeOf(this, ApiError.prototype)
  }
}

export function handleApiError(error: unknown): ApiError {
  if (error instanceof ApiError) {
    return error
  }

  if (error instanceof Error) {
    // Network errors or other Error instances
    return new ApiError(error.message || 'An unexpected error occurred', 500)
  }

  // Unknown error type
  return new ApiError('An unexpected error occurred', 500)
}

export function parseErrorResponse(response: Response): Promise<ApiError> {
  return response
    .json()
    .then((data) => {
      const message = data?.error || data?.message || `HTTP error! status: ${response.status}`
      return new ApiError(message, response.status, data)
    })
    .catch(() => {
      // If JSON parsing fails, create error from status
      return new ApiError(`HTTP error! status: ${response.status}`, response.status)
    })
}

