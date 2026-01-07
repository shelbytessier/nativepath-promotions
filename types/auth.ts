export type User = {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'user' | 'viewer';
  createdAt: string;
};

export type Session = {
  user: User;
  expiresAt: string;
};






