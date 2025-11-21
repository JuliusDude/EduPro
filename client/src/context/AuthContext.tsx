import React, { createContext, useContext, useState, useEffect } from 'react';

type UserRole = 'student' | 'lecturer' | 'admin';

interface User {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    role: UserRole;
    department?: string;
}

interface AuthContextType {
    user: User | null;
    isAuthenticated: boolean;
    login: (email: string, password: string, role: UserRole) => Promise<boolean>;
    logout: () => void;
    isRole: (role: UserRole) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock users for demo
const MOCK_USERS = {
    student: {
        id: 'S001',
        firstName: 'John',
        lastName: 'Doe',
        email: 'student@edu.com',
        role: 'student' as UserRole,
        department: 'Computer Science'
    },
    lecturer: {
        id: 'L001',
        firstName: 'Dr. Sarah',
        lastName: 'Wilson',
        email: 'lecturer@edu.com',
        role: 'lecturer' as UserRole,
        department: 'Computer Science'
    },
    admin: {
        id: 'A001',
        firstName: 'Admin',
        lastName: 'User',
        email: 'admin@edu.com',
        role: 'admin' as UserRole,
        department: 'Administration'
    }
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);

    // Load user from localStorage on mount
    useEffect(() => {
        const savedUser = localStorage.getItem('edupro_user');
        if (savedUser) {
            setUser(JSON.parse(savedUser));
        }
    }, []);

    const login = async (email: string, password: string, role: UserRole): Promise<boolean> => {
        // Mock authentication - in real app, this would call an API
        const mockUser = MOCK_USERS[role];

        if (mockUser && email === mockUser.email && password === 'password') {
            setUser(mockUser);
            localStorage.setItem('edupro_user', JSON.stringify(mockUser));
            return true;
        }

        return false;
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('edupro_user');
    };

    const isRole = (role: UserRole): boolean => {
        return user?.role === role;
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                isAuthenticated: !!user,
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
