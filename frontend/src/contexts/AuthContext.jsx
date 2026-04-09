import React, { createContext, useContext, useState, useEffect } from 'react';

export const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    // On mount, check if there's a user session
    useEffect(() => {
        const storedUser = localStorage.getItem('fin_user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
    }, []);

    const value = {
        signUp: async (data) => {
            console.log('Mock sign up', data);
            // Simulate account creation
            localStorage.setItem('fin_registered_user', JSON.stringify({ email: data.email, storeType: data.storeType }));
            return { error: null };
        },
        signIn: async (data) => {
            console.log('Mock sign in', data);
            // Simulate log in
            const loggedInUser = { id: 'local-user', email: data.email };
            setUser(loggedInUser);
            localStorage.setItem('fin_user', JSON.stringify(loggedInUser));
            return { error: null };
        },
        signOut: async () => {
            console.log('Mock sign out');
            setUser(null);
            localStorage.removeItem('fin_user');
        },
        user,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};


