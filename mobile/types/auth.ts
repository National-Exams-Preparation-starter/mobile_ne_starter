export interface User {
  username:string;
  email: string;
}

export type AuthContextType = {
  user: User | null;
  loading: boolean;
  isLoggedIn: boolean;
  setUser: (user: User | null) => void;
};
