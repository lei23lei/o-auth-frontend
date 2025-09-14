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

interface LoginResponse {
  success: boolean;
  message: string;
  data: TokenData;
  errors: null;
}

interface User {
  id: string;
  email: string;
  password: string;
  image?: string;
  name?: string;
  created_at: string;
  updated_at: string;
}

interface UserResponse {
  success: boolean;
  message: string;
  data: User;
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
