import { apiClient } from './client';
import { LoginRequest, SignupRequest, AuthResponse, SignatureMetadata } from '../types/auth';
import { SDITH_CONFIG } from '@/lib/SDitHConfig';

export const authApi = {
  async login(credentials: LoginRequest): Promise<AuthResponse> {
    const response = await apiClient.getClient().post<AuthResponse>(
      '/api/auth/login',
      credentials
    );

    const { accessToken, ...userData } = response.data;

    apiClient.setToken(accessToken);
    apiClient.setUser(userData);

    return response.data;
  },

  async register(userData: SignupRequest): Promise<any> {
    const response = await apiClient.getClient().post(
      '/api/auth/register',
      userData
    );

    return response.data;
  },

  logout(): void {
    apiClient.clearTokens();
  },

  getCurrentUser(): any {
    return apiClient.getUser();
  },

  isAuthenticated(): boolean {
    return !!apiClient.getUser();
  },
};
