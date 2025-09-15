interface UserCreate {
  email: string;
  password: string;
}

interface UserResponse {
  success: boolean;
  message: string;
  data: User;
  errors: null;
}

interface RegisterResponse extends UserResponse {}

// OAuth provider types
type AuthProvider = "email" | "google" | "github" | "facebook" | "twitter";

interface OAuthUser {
  id: string;
  email: string;
  name?: string;
  username?: string;
  image?: string;
  provider: AuthProvider;
  provider_id: string;
  created_at: string;
  updated_at: string;
}
