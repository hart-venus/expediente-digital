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

    const logIn = (password: string) => {
        // ...
    }
    // ...
}