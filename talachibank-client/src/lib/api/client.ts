import axios, { AxiosInstance, AxiosError, InternalAxiosRequestConfig } from 'axios';
import Cookies from 'js-cookie';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

export class ApiClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: API_URL,
      headers: {
        'Content-Type': 'application/json',
      },
      timeout: 10000,
    });

    // Request interceptor to add auth token
    this.client.interceptors.request.use(
      (config: InternalAxiosRequestConfig) => {
        const publicEndpoints = [
          '/api/auth/register',
          '/api/auth/login'
        ];

        // [FIX] Use includes() to be safer against full URLs or relative paths
        const url = config.url || '';
        const isPublicEndpoint = publicEndpoints.some(endpoint => url.includes(endpoint));

        const token = this.getToken();

        // [FIX] Strict check: ONLY add token if it exists AND it's NOT a public endpoint
        if (token && !isPublicEndpoint) {
          if (config.headers) {
            config.headers.Authorization = `Bearer ${token}`;
          }
        }
        return config;
      },
      (error) => {
        console.error("DEBUG: Request Interceptor Error:", error);
        return Promise.reject(error);
      }
    );

    // Response interceptor
    this.client.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          console.warn("DEBUG: 401 Error detected. Automatic redirect temporarily disabled for diagnosis.");
          // this.clearTokens();
          // if (typeof window !== 'undefined') {
          //   window.location.href = '/login';
          // }
        }
        return Promise.reject(error);
      }
    );
  }

  getClient(): AxiosInstance {
    return this.client;
  }

  private getToken(): string | null {
    if (typeof window !== 'undefined') {
      // 1. Try localStorage FIRST (contains full SDitH token)
      const localToken = localStorage.getItem('accessToken');
      if (localToken) return localToken;

      // 2. Try Cookies (might be truncated/light token)
      const cookieToken = Cookies.get('token');
      if (cookieToken) return cookieToken;

      // 3. Last resort: document.cookie parse
      const match = document.cookie.match(new RegExp('(^| )token=([^;]+)'));
      if (match) return match[2];
    }
    return null;
  }

  setToken(token: string): void {
    if (typeof window !== 'undefined') {
      console.log("DEBUG: Storing auth tokens. Full size:", token.length);

      // Store FULL token in localStorage (12KB+)
      localStorage.setItem('accessToken', token);

      // Store LIGHT token in Cookie for Middleware (Standard JWT part only < 4KB)
      // SDitH token is "unsignedJWT.sigB64" (where unsignedJWT has 2 dots)
      const parts = token.split('.');
      const lightToken = parts.slice(0, 3).join('.');
      console.log("DEBUG: Setting light token cookie. Size:", lightToken.length);
      Cookies.set('token', lightToken, { expires: 7, path: '/', sameSite: 'lax' });
    }
  }

  clearTokens(): void {
    if (typeof window !== 'undefined') {
      Cookies.remove('token', { path: '/' });
      document.cookie = "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
      localStorage.removeItem('accessToken');
      localStorage.removeItem('user');
    }
  }

  setUser(user: any): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem('user', JSON.stringify(user));
    }
  }

  getUser(): any {
    if (typeof window !== 'undefined') {
      const user = localStorage.getItem('user');
      return user ? JSON.parse(user) : null;
    }
    return null;
  }
}

export const apiClient = new ApiClient();
