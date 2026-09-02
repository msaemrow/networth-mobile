const apiBaseUrl = process.env.EXPO_PUBLIC_API_URL?.replace(/\/$/, '');
let authToken: string | null = null;
let unauthorizedHandler: (() => void) | null = null;

export class ApiError extends Error {
  constructor(message: string, readonly status?: number) {
    super(message);
    this.name = 'ApiError';
  }
}

export const getApiBaseUrl = () => apiBaseUrl;

const request = async <T>(path: string, options: RequestInit = {}): Promise<T> => {
  if (!apiBaseUrl) {
    throw new ApiError('The API URL is not configured. Add EXPO_PUBLIC_API_URL to mobile-app/.env and restart Expo.');
  }
  let response: Response;
  try {
    response = await fetch(`${apiBaseUrl}${path}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        'X-Auth-Client': 'mobile',
        ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
        ...options.headers,
      },
    });
  } catch {
    throw new ApiError(`Could not reach the API at ${apiBaseUrl}. Check that Express is running and the phone can reach your computer.`);
  }
  if (!response.ok) {
    const body = (await response.json().catch(() => ({}))) as { message?: string };
    if (response.status === 401 && path !== '/auth/login') unauthorizedHandler?.();
    throw new ApiError(body.message || 'Something went wrong while contacting the API.', response.status);
  }
  return (response.status === 204 ? null : await response.json()) as T;
};

export const api = {
  setAuthToken: (token: string | null) => { authToken = token; },
  onUnauthorized: (handler: (() => void) | null) => { unauthorizedHandler = handler; },
  get: <T>(path: string) => request<T>(path),
  post: <T>(path: string, body: unknown) => request<T>(path, { method: 'POST', body: JSON.stringify(body) }),
  put: <T>(path: string, body: unknown) => request<T>(path, { method: 'PUT', body: JSON.stringify(body) }),
};
