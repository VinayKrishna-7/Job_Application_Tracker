export interface User {
  id: string;
  name: string;
  email: string;
  title?: string;
  avatar?: string;
  bio?: string;
  location?: string;
  phone?: string;
  linkedIn?: string;
  gitHub?: string;
  portfolio?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface AuthResponse {
  user: User;
  token?: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface UpdateProfileData {
  name?: string;
  title?: string;
  bio?: string;
  avatar?: string;
  phone?: string;
  location?: string;
  linkedIn?: string;
  gitHub?: string;
  portfolio?: string;
}
