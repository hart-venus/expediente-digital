import React, { useContext, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { LoginContext } from '../context/LoginContext';

const ProtectedLayout = ({ children}: Readonly<{ children: React.ReactNode }>) => {
    const { token } = useContext(LoginContext) as any;
    const router = useRouter();
    
    useEffect(() => {
        if (!token) {
        router.push('/login');
        }
    }, [token, router]);
    
    return (
        <>{children}</>
    );
}

export default ProtectedLayout;