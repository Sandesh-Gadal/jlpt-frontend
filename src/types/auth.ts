export interface User {
  id: string;
  full_name: string;
  email: string;
  email_verified: boolean;
  tenant: {
    id: string;
    plan: {
      plan_type: 'free' | 'individual' | 'team' | 'institution';
      name: string;
    };
  };
}

export interface AuthToken {
  token: string;
  user: User;
}

export type PasswordStrength = 0 | 1 | 2 | 3 | 4;
