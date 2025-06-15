import { createContext, useState, ReactNode, useContext, useEffect } from 'react';
import { User } from '../types/index';

type AuthContextType = {
    user: User | null;
    isAuthenticated: boolean;
    login: (userData: User) => void;
    logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

type AuthProviderProps = {
    children: ReactNode;
};

export const AuthProvider = ({ children }: AuthProviderProps) => {
    const [user, setUser] = useState<User | null>(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('token');
        const storedUser = localStorage.getItem('user');

        if (token && storedUser) {
            const parsedUser = JSON.parse(storedUser);
            setUser({ ...parsedUser, token });
            setIsAuthenticated(true);
        }

        setIsLoading(false);
    }, []);

    const login = (userData: User) => {
        setUser(userData);
        setIsAuthenticated(true);
        localStorage.setItem('token', userData.token);
        localStorage.setItem('user', JSON.stringify(userData));
    };

    const logout = () => {
        setUser(null);
        setIsAuthenticated(false);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    };

    if (isLoading) {
        return <div>Loading session...</div>;
    }

    return (
        <AuthContext.Provider value={{ user, isAuthenticated, login, logout }}>
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
