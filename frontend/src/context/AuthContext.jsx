import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [token, setToken] = useState(localStorage.getItem('authToken'));
    const [userEmail, setUserEmail] = useState(localStorage.getItem('userEmail'));

    useEffect(() => {
        // Sincronizar estado si el token cambia en localStorage (ej. otra pestaña)
        const handleStorageChange = () => {
            setToken(localStorage.getItem('authToken'));
            setUserEmail(localStorage.getItem('userEmail'));
        };
        window.addEventListener('storage', handleStorageChange);
        return () => window.removeEventListener('storage', handleStorageChange);
    }, []);

    const login = (data) => {
        localStorage.setItem('authToken', data.token);
        localStorage.setItem('userEmail', data.email);
        setToken(data.token);
        setUserEmail(data.email);
    };

    const logout = () => {
        localStorage.removeItem('authToken');
        localStorage.removeItem('userEmail');
        setToken(null);
        setUserEmail(null);
    };

    return (
        <AuthContext.Provider value={{ token, userEmail, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    return useContext(AuthContext);
};