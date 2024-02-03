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

                        <label htmlFor="governmentId" className={styles.label}>Cédula</label>
                        <input type="text" id="governmentId" name="governmentId" className={styles.input} required/>
                        {errors.governmentId && <p className={styles.error}>{errors.governmentId}</p>}
                    
                        <label htmlFor="birthDate" className={styles.label}>Fecha de Nacimiento</label>
                        <input type="date" id="birthDate" name="birthDate" className={styles.input} required/>
                        {errors.birthDate && <p className={styles.error}>{errors.birthDate}</p>}

                        <label htmlFor="phoneNumber" className={styles.label}>Teléfono</label>
                        <input type="text" id="phoneNumber" name="phoneNumber" className={styles.input}/>
                        {errors.phoneNumber && <p className={styles.error}>{errors.phoneNumber}</p>}

                        <label htmlFor="email" className={styles.label}>Correo Electrónico</label>
                        <input type="email" id="email" name="email" className={styles.input} required/>
                        {errors.email && <p className={styles.error}>{errors.email}</p>}
                    </div>

                    <div className={styles.userBox}>
                        <IconComponent icon="bx:user" className={styles.second_icon}/>
                    </div>
                </div>
                <h2 className={styles.subheader}>Antecedentes</h2>
                <label htmlFor="familyBackground" className={styles.label}>Antecedentes Familiares</label>
                <textarea id="familyBackground" name="familyBackground" className={styles.textarea}/>
            </form>
        </main>
    )
}