'use client';
import styles from "./page.module.css";
import Link from "next/link";
import IconComponent from "../../../components/Icon/Icon";
import { useState } from "react";

export default function New() {
    const [errors, setErrors] = useState({} as Record<string, string>);
    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        console.log("submit");
    }
    return (
        <main className={styles.main}>
            <div className={styles.navbar}> 
                <Link href="/">  
                    <IconComponent icon="lucide:arrow-left" className={styles.icon}/>
                </Link>
                <h1 className={styles.header}>Registrar Paciente</h1>
            </div>
            <div className={styles.divBar}/>
            <form onSubmit={handleSubmit}>
                
            </form>
        </main>
    )
}