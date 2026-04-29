import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

export const AuthContext = createContext({});

const API_BASE = '/api';

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);

    // On mount, restore session from localStorage
    useEffect(() => {
        const storedToken = localStorage.getItem('fin_token');
        const storedUser = localStorage.getItem('fin_user');
        if (storedToken && storedUser) {
            setToken(storedToken);
            setUser(JSON.parse(storedUser));
        }
    }, []);

    const value = {
        signUp: async (data) => {
            try {
                const res = await axios.post(`${API_BASE}/auth/signup`, {
                    email: data.email,
                    password: data.password,
                    store_type: data.storeType || 'Retail Store',
                });
                // Don't auto-login after signup — user should sign in explicitly
                return { error: null };
            } catch (err) {
                const msg = err.response?.data?.detail || err.message || 'Signup failed';
                return { error: { message: msg } };
            }
        },

        signIn: async (data) => {
            try {
                const res = await axios.post(`${API_BASE}/auth/login`, {
                    email: data.email,
                    password: data.password,
                });
                const { token: jwt, user: userData } = res.data;

                // Store session
                setToken(jwt);
                setUser(userData);
                localStorage.setItem('fin_token', jwt);
                localStorage.setItem('fin_user', JSON.stringify(userData));

                return { error: null };
            } catch (err) {
                const msg = err.response?.data?.detail || err.message || 'Login failed';
                return { error: { message: msg } };
            }
        },

        loginAs: (userType) => {
            const userData = { email: `demo@${userType.replace(/\s+/g, '').toLowerCase()}.com`, type: userType };
            setToken('demo-token');
            setUser(userData);
            localStorage.setItem('fin_token', 'demo-token');
            localStorage.setItem('fin_user', JSON.stringify(userData));
        },

        signOut: async () => {
            setUser(null);
            setToken(null);
            localStorage.removeItem('fin_token');
            localStorage.removeItem('fin_user');
        },

        user,
        token,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};
