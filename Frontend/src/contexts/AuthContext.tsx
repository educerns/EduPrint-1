
import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from "../services/api"; // your axios instance
import { jwtDecode } from "jwt-decode";
interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  company: string;
  address?: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
}

// interface AuthContextType {
//   user: User | null;
//   login: (email: string, password: string) => Promise<boolean>;
//   signup: (userData: Omit<User, 'id'> & { password: string }) => Promise<boolean>;
//   logout: () => void;
//   updateProfile: (userData: Partial<User>) => void;
//   isAuthenticated: boolean;
// }

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
   logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
const [token, setToken] = useState<string | null>(null);
const [loggedin, setloggedin] = useState<Boolean | null>(null);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      try {
        const decoded: any = jwtDecode(storedToken);
        if (decoded.exp * 1000 > Date.now()) {
          setToken(storedToken);
          setUser(decoded);
          setloggedin(true);
        } else {
          localStorage.removeItem("token");
        }
      } catch {
        localStorage.removeItem("token");
      }
    }
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const res = await axios.post("/api/eduprintverifyOtp", { email, password });
      const { token, user } = res.data;
      localStorage.setItem("token", token);
      setToken(token);
      setUser(user);
          setloggedin(true);

      return true;
    } catch (err) {
      
      console.log("Login failed:", err);
      return false;
    }
  };


  const signup = async (userData: Omit<User, 'id'> & { password: string }): Promise<boolean> => {
    const users = JSON.parse(localStorage.getItem('eduprint_users') || '[]');
    const existingUser = users.find((u: any) => u.email === userData.email);
    
    if (existingUser) {
      return false;
    }

    const newUser = {
      ...userData,
      id: Date.now().toString(),
    };

    users.push(newUser);
    localStorage.setItem('eduprint_users', JSON.stringify(users));

    const { password: _, ...userWithoutPassword } = newUser;
    setUser(userWithoutPassword);
    localStorage.setItem('eduprint_user', JSON.stringify(userWithoutPassword));
    return true;
  };

 const logout = () => {
    localStorage.removeItem("token");
    
    setUser(null);
    setToken(null);
  };

  const updateProfile = (userData: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...userData };
      setUser(updatedUser);
      localStorage.setItem('eduprint_user', JSON.stringify(updatedUser));
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      login,
      signup,
      logout,
      updateProfile,
      token,
      isAuthenticated: !!token,
      loggedin,

    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
