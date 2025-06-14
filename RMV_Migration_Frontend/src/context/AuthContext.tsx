// src/context/AuthContext.tsx
import { createContext, useState, ReactNode, useContext } from 'react';

// 1. Define User type
export type User = {
    userId: string;
    username: string;
    fullName: string;
    token: string;
    role?: string;
};


// 2. Define the shape of context data
type AuthContextType = {
    user: User | null;
    isAuthenticated: boolean;
    login: (userData: User) => void;
    logout: () => void;
};

// 3. Create the context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// 4. Define the props for AuthProvider
type AuthProviderProps = {
    children: ReactNode;
};

// 5. Create the AuthProvider component
export const AuthProvider = ({ children }: AuthProviderProps) => {
    const [user, setUser] = useState<User | null>(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    const login = (userData: User) => {
        setUser(userData);
        console.log(userData);

        setIsAuthenticated(true);
        localStorage.setItem('token', userData.token);
    };

    const logout = () => {
        setUser(null);
        setIsAuthenticated(false);
        localStorage.removeItem('token');
    };

    return (
        <AuthContext.Provider value={{ user, isAuthenticated, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

// 6. Custom hook to access AuthContext
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
