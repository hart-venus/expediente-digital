'use client'
import styles from './page.module.css'
import { LoginContext } from '../../../context/LoginContext'
import { useEffect, useState } from 'react'
import { useContext } from 'react'
import { useRouter } from 'next/navigation'

export default function Login() {
    const router = useRouter();
    const [ passInput, setPassInput ] = useState('');
    const { logIn } = useContext(LoginContext) as any;
    const [ loading, setLoading ] = useState(false);
    const handleSubmit = async () => {
        setLoading(true);
        const isPasswordCorrect = await logIn(passInput);
        if (isPasswordCorrect) {
            router.push('/');
        }
        setLoading(false);
    }

    return (
        <div className={`${styles.container} ${loading ? styles.loading : ''}`}>
            <h1 className={styles.heading}>Ingresar</h1>
            <div className={styles.separatorLine}></div>
            <input className={styles.input} type="password" placeholder="Contraseña" value={passInput} onChange={(e) => setPassInput(e.target.value)} />
            <button className={styles.button} onClick={handleSubmit}>Confirmar</button>
        </div>
    )
}