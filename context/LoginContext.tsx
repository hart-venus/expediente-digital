import React, { createContext, useState, useEffect } from 'react';
import Cookies from 'js-cookie';

export const LoginContext = createContext({});

export const LoginProvider = ({ children }: any) => {
    const [token, setToken] = useState<string | null>(null);

    useEffect(() => {
        // will run only on startup
        const token = Cookies.get('token');
        if (token) {
            setToken(token);
        }
    }, []);

    const logIn = async (password: string) => {
        try {
            const res = await fetch('/api/validate-password', {
                method: 'POST',
                body: password,
            });
            if (res.ok) {
                const data = await res.json();
                if (data.valid) {
                    Cookies.set('token', password); 
                    setToken(password);
                }
            } else {
                console.error('Failed to validate password');
            }
        } catch (e) {
            console.error(e);
        }
    };
    
    const isLoggedIn = () => {
        return token !== null;
    }

    return (
        <LoginContext.Provider value={{ token, logIn, isLoggedIn }}>
            {children}
        </LoginContext.Provider>
    );

}