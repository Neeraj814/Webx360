import { createContext, useContext, useState, ReactNode } from "react";
import { authApi, AuthUser } from "@/lib/api";
import { useDispatch } from "react-redux"; 
import { setUser } from "@/redux/authSlice"; 

interface AuthContextType {
  user: AuthUser | null;
  loading: boolean;
  login: (email: string, password: string, role: string) => Promise<void>;
  signup: (formData: FormData) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  const login = async (email: string, password: string, role: string) => {
    try {
      setLoading(true);
      const res = await authApi.login(email, password, role);
      if (res.success) {
        dispatch(setUser(res.user)); 
      }
    } catch (error: any) {
      throw new Error(error.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  const signup = async (formData: FormData) => {
    try {
      setLoading(true);
      const res = await authApi.register(formData);
      if (!res.success) throw new Error(res.message);
    } catch (error: any) {
      throw new Error(error.response?.data?.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    await authApi.logout();
    dispatch(setUser(null)); 
  };

  return (
    <AuthContext.Provider value={{ user: null, loading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
