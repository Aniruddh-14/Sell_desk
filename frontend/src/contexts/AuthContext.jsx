import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
    // Stubbed user for dev without Supabase
    const [user, setUser] = useState({ id: 'local-user', email: 'admin@demo.com' });

    const value = {
        signUp: async (data) => console.log('Mock sign up', data),
        signIn: async (data) => console.log('Mock sign in', data),
        signOut: async () => console.log('Mock sign out'),
        user,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    return useContext(AuthContext);
};
