export interface User {
  id: string;
  nombre: string;
  email: string;
}

export interface AuthSession {
  user: User | null;
  token: string | null;
}
