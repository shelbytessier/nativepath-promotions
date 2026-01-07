import type { User, Session } from '@/types/auth';

const USERS_STORAGE_KEY = 'nativepath-users';
const SESSION_STORAGE_KEY = 'nativepath-session';

// Default users for demo (in production, these would come from a database)
const DEFAULT_USERS: User[] = [
  {
    id: '1',
    email: 'admin@nativepath.com',
    name: 'Admin User',
    role: 'admin',
    createdAt: new Date().toISOString(),
  },
  {
    id: '2',
    email: 'user@nativepath.com',
    name: 'Team Member',
    role: 'user',
    createdAt: new Date().toISOString(),
  },
  {
    id: '3',
    email: 'viewer@nativepath.com',
    name: 'Viewer',
    role: 'viewer',
    createdAt: new Date().toISOString(),
  },
];

// Simple password storage (in production, use proper hashing)
const DEFAULT_PASSWORDS: Record<string, string> = {
  'admin@nativepath.com': 'admin123',
  'user@nativepath.com': 'user123',
  'viewer@nativepath.com': 'viewer123',
};

export function initializeUsers() {
  if (typeof window === 'undefined') return;

  const existing = localStorage.getItem(USERS_STORAGE_KEY);
  if (!existing) {
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(DEFAULT_USERS));
  }
}

export function getUsers(): User[] {
  if (typeof window === 'undefined') return [];

  try {
    const stored = localStorage.getItem(USERS_STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
    initializeUsers();
    return DEFAULT_USERS;
  } catch {
    return DEFAULT_USERS;
  }
}

export function getUserByEmail(email: string): User | null {
  const users = getUsers();
  return users.find((u) => u.email.toLowerCase() === email.toLowerCase()) || null;
}

export function createUser(user: Omit<User, 'id' | 'createdAt'>): User {
  const newUser: User = {
    ...user,
    id: Date.now().toString(),
    createdAt: new Date().toISOString(),
  };

  const users = getUsers();
  users.push(newUser);
  localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));

  return newUser;
}

export function login(email: string, password: string): { success: boolean; user?: User; error?: string } {
  if (typeof window === 'undefined') {
    return { success: false, error: 'Cannot login on server' };
  }

  initializeUsers();

  const user = getUserByEmail(email);
  if (!user) {
    return { success: false, error: 'Invalid email or password' };
  }

  // Check password (in production, use proper password hashing)
  const storedPassword = DEFAULT_PASSWORDS[user.email.toLowerCase()];
  if (storedPassword && password !== storedPassword) {
    return { success: false, error: 'Invalid email or password' };
  }

  // Create session (expires in 7 days)
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 7);

  const session: Session = {
    user,
    expiresAt: expiresAt.toISOString(),
  };

  localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(session));

  return { success: true, user };
}

export function logout(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(SESSION_STORAGE_KEY);
}

export function getSession(): Session | null {
  if (typeof window === 'undefined') return null;

  try {
    const stored = localStorage.getItem(SESSION_STORAGE_KEY);
    if (!stored) return null;

    const session: Session = JSON.parse(stored);

    // Check if session expired
    if (new Date(session.expiresAt) < new Date()) {
      logout();
      return null;
    }

    return session;
  } catch {
    return null;
  }
}

export function getCurrentUser(): User | null {
  const session = getSession();
  return session?.user || null;
}

export function isAuthenticated(): boolean {
  return getCurrentUser() !== null;
}

export function hasRole(role: User['role']): boolean {
  const user = getCurrentUser();
  if (!user) return false;

  const roleHierarchy: Record<User['role'], number> = {
    viewer: 1,
    user: 2,
    admin: 3,
  };

  return roleHierarchy[user.role] >= roleHierarchy[role];
}






