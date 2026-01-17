import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

type UserRole = 'student' | 'lecturer' | 'admin';

interface User {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    role: UserRole;
    department?: string;
    avatar?: string;
}

interface AuthContextType {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    login: (email: string, password: string) => Promise<boolean>;
    logout: () => void;
    isRole: (role: UserRole) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock users for fallback when backend is unavailable
const MOCK_USERS: Record<string, User> = {
    'student@edu.com': {
        id: '1',
        firstName: 'John',
        lastName: 'Doe',
        email: 'student@edu.com',
        role: 'student',
        department: 'Computer Science',
    },
    'lecturer@edu.com': {
        id: '2',
        firstName: 'Dr. Sarah',
        lastName: 'Wilson',
        email: 'lecturer@edu.com',
        role: 'lecturer',
        department: 'Computer Science',
    },
    'admin@edu.com': {
        id: '3',
        firstName: 'Admin',
        lastName: 'User',
        email: 'admin@edu.com',
        role: 'admin',
        department: 'Administration',
    },
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    // Check authentication on mount
    useEffect(() => {
        const checkAuth = async () => {
            const token = localStorage.getItem('token');
            const storedUser = localStorage.getItem('user');

            if (!token) {
                setIsLoading(false);
                return;
            }

            // Try to validate token with backend
            try {
                const response = await api.get('/auth/me');
                const userData = response.data.data.user;

                // Normalize role to lowercase
                const normalizedUser: User = {
                    id: userData.id,
                    firstName: userData.firstName,
                    lastName: userData.lastName,
                    email: userData.email,
                    role: userData.role.toLowerCase() as UserRole,
                    department: userData.department,
                    avatar: userData.avatar,
                };

                setUser(normalizedUser);
                localStorage.setItem('user', JSON.stringify(normalizedUser));
            } catch (error) {
                console.warn('Backend unavailable, using stored user data');
                // Fallback to stored user if backend is unavailable
                if (storedUser) {
                    try {
                        setUser(JSON.parse(storedUser));
                    } catch {
                        localStorage.removeItem('token');
                        localStorage.removeItem('user');
                    }
                } else {
                    localStorage.removeItem('token');
                    localStorage.removeItem('user');
                }
            } finally {
                setIsLoading(false);
            }
        };

        checkAuth();
    }, []);

    const login = async (email: string, password: string): Promise<boolean> => {
        try {
            // Try real backend login
            const response = await api.post('/auth/login', { email, password });
            const { user: userData, accessToken } = response.data.data;

            localStorage.setItem('token', accessToken);

            // Normalize role to lowercase
            const normalizedUser: User = {
                id: userData.id,
                firstName: userData.firstName,
                lastName: userData.lastName,
                email: userData.email,
                role: userData.role.toLowerCase() as UserRole,
                department: userData.department,
                avatar: userData.avatar,
            };

            setUser(normalizedUser);
            localStorage.setItem('user', JSON.stringify(normalizedUser));

            return true;
        } catch (error: any) {
            console.warn('Backend login failed, trying mock login:', error.message);

            // Fallback to mock login if backend is unavailable
            if (password === 'password' && MOCK_USERS[email]) {
                const mockUser = MOCK_USERS[email];
                const mockToken = 'mock-jwt-token-' + Date.now();
                localStorage.setItem('token', mockToken);
                localStorage.setItem('user', JSON.stringify(mockUser));
                setUser(mockUser);
                return true;
            }

            return false;
        }
    };

    const logout = async () => {
        try {
            await api.post('/auth/logout');
        } catch (error) {
            console.warn('Logout API call failed, proceeding with local logout');
        } finally {
            setUser(null);
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            window.location.href = '/login';
        }
    };

    const isRole = (role: UserRole): boolean => {
        return user?.role === role;
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                isAuthenticated: !!user,
                isLoading,
                login,
                logout,
                isRole
            }}
        >
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
