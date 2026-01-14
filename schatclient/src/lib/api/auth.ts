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

    // Mock metadata if not provided by backend yet (for visualization)
    const signatureMetadata: SignatureMetadata = response.data.signatureMetadata || {
      algorithm: 'SDitH-128',
      keySharesGenerated: SDITH_CONFIG.PARAMETERS.NUM_SHARES,
      signatureSize: 12800,
      generationTime: 450, // ms
      syndromeLength: SDITH_CONFIG.PARAMETERS.SYNDROME_LENGTH
    };

    apiClient.setToken(accessToken);
    apiClient.setUser(userData);

    return { ...response.data, signatureMetadata };
  },

  async register(userData: SignupRequest): Promise<any> {
    const response = await apiClient.getClient().post(
      '/api/auth/register',
      userData
    );

    return {
      ...response.data,
      signatureMetadata: {
        algorithm: 'SDitH-128',
        keySharesGenerated: SDITH_CONFIG.PARAMETERS.NUM_SHARES,
        signatureSize: 0,
        generationTime: 850,
        syndromeLength: SDITH_CONFIG.PARAMETERS.SYNDROME_LENGTH
      }
    };
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
