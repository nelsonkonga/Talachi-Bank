export interface User {
  id: number;
  username: string;
  email: string;
  roles: string[];
  partyIndex?: number;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface SignupRequest {
  username: string;
  email: string;
  password: string;
  roles?: string[];
}

export interface SignatureMetadata {
  algorithm: 'SDitH-128' | 'SDitH-256';
  keySharesGenerated: number;
  signatureSize: number; // in bytes
  generationTime: number; // in ms
  syndromeLength: number;
}

export interface AuthResponse {
  accessToken: string;
  id: number;
  username: string;
  email: string;
  roles: string[];
  balance?: number;
  accountNumber?: string;
  signatureMetadata?: SignatureMetadata;
}

