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
                <div className={styles.formSectionContainer}>
                    <div className={styles.formSection}>
                        <label htmlFor="fullName" className={styles.label}>Nombre</label>
                        <input type="text" id="fullName" name="fullName" className={styles.input} required/>
                        {errors.fullName && <p className={styles.error}>{errors.fullName}</p>}
                    </div>

                    <div className={styles.userBox}>
                        <IconComponent icon="bx:user" className={styles.second_icon}/>
                    </div>
                </div>
            </form>
        </main>
    )
}