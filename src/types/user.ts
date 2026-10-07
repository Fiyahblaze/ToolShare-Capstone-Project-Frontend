export interface User {
  _id: string;
  name: string;
  email: string;
}

export interface AuthResponse {
  message: string;
  token: string;
  user: User;
}

export interface CurrentUserResponse {
  user: User;
}