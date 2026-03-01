// Fallback user profile for when backend is unavailable
export interface FallbackUserProfile {
  _id: string;
  email: string;
  role: string;
  username: string;
  name: string;
  isFallback: boolean;
}

export const getFallbackProfile = (): FallbackUserProfile => {
  return {
    _id: 'fallback-user-id',
    email: 'user@asteriashome.gr',
    role: 'USER',
    username: 'guest',
    name: 'Guest User',
    isFallback: true
  };
};

export const shouldUseFallback = (error: any): boolean => {
  // Use fallback for timeout, network, or server errors
  return (
    error?.name === 'AbortError' ||
    error?.message?.includes('timeout') ||
    error?.message?.includes('fetch failed') ||
    error?.message?.includes('Headers Timeout Error') ||
    error?.status >= 500
  );
};
