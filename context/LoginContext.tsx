import React, { createContext, useState, useEffect } from 'react';
import { setCookie, getCookie } from 'cookies-next';

export const LoginContext = createContext({});

export const LoginProvider = ({ children }: any) => {
    const [token, setToken] = useState<string | null>(null);

    const logIn = async (password: string) => {
        try {
            const res = await fetch('/api/validate-password', {
                method: 'POST',
                body: password,
            });
            if (res.ok) {
                const data = await res.json();
                if (data.valid) {
                    setToken(password);
                    return true;
                }
            } else {
                console.error('Failed to validate password');
                return false;
            }
        } catch (e) {
            console.error(e);
            return false;
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