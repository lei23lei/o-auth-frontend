interface UserCreate {
  email: string;
  password: string;
}

interface RegisterResponse {
  success: boolean;
  message: string;
  data: User;
  errors: null;
}
