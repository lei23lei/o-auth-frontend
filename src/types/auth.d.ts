interface LoginRequest {
  email: string;
  password: string;
}

interface TokenData {
  access_token: string;
  token_type: string;
  expires_in: number;
  user_id: string;
  email: string;
}

interface TokenResponse {
  success: boolean;
  message: string;
  data: TokenData;
  errors: null;
}

interface LoginResponse extends TokenResponse {}

interface User {
  id: string;
  email: string;
  password?: string; // Optional for OAuth users
  image?: string;
  name?: string;
  provider: string; // Default to "email", can be "google", "github", etc.
  provider_id?: string; // GitHub user ID or other OAuth provider ID
  username?: string; // GitHub username or other provider username
  created_at: string;
  updated_at: string;
}

interface UserResponse {
  success: boolean;
  message: string;
  data: User;
  errors: null;
}

interface NextAuthCallbackResponse {
  success: boolean;
  message: string;
  data: {
    user: User;
    token: TokenData;
  };
  errors: null;
}

interface ForgotPasswordRequest {
  email: string;
}

interface PasswordResetResponse {
  success: boolean;
  message: string;
}

interface ForgotPasswordResponse extends PasswordResetResponse {}

interface ErrorDetail {
  message: string;
  code: string;
}

interface ErrorResponse {
  message: string;
  errors: ErrorDetail[];
}

interface ResetPasswordRequest {
  token: string;
  new_password: string;
}

interface ResetPasswordResponse {
  success: boolean;
  message: string;
  data: {
    email: string;
  };
}
