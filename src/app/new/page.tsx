'use client';
import styles from "./page.module.css";
import Link from "next/link";
import IconComponent from "../../../components/Icon/Icon";
import { useState } from "react";

export default function New() {
    const [errors, setErrors] = useState({} as Record<string, string>);
    const [selectedFile, setSelectedFile] = useState<string | null>(null);
    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        console.log("submit");
    }

    const triggerFileInput = () => {
        const fileInput = document.getElementById("file");
        fileInput?.click();
    }

    const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            setSelectedFile(file.name);
        }
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
                <div className={styles.subheaderContainer}>
                    <h2 className={styles.subheader}>Antecedentes</h2>
                    <div className={styles.divBar}/>
                </div>
                <label htmlFor="familyBackground" className={styles.label}>Antecedentes Familiares</label>
                <textarea id="familyBackground" name="familyBackground" className={styles.textarea}/>
                {errors.familyBackground && <p className={styles.error}>{errors.familyBackground}</p>}
                <label htmlFor="pathologicBackground" className={styles.label}>Antecedentes Patológicos</label>
                <textarea id="pathologicBackground" name="pathologicBackground" className={styles.textarea}/>
                {errors.pathologicBackground && <p className={styles.error}>{errors.pathologicBackground}</p>}
                <label htmlFor="nonPathologicBackground" className={styles.label}>Antecedentes No Patológicos</label>
                <textarea id="nonPathologicBackground" name="nonPathologicBackground" className={styles.textarea}/>
                {errors.nonPathologicBackground && <p className={styles.error}>{errors.nonPathologicBackground}</p>}
                <label htmlFor="chirurgicalBackground" className={styles.label}>Antecedentes Quirúrgicos</label>
                <textarea id="chirurgicalBackground" name="chirurgicalBackground" className={styles.textarea}/>
                {errors.chirurgicalBackground && <p className={styles.error}>{errors.chirurgicalBackground}</p>}
                <label htmlFor="ginoObstetricBackground" className={styles.label}>Antecedentes Gineco-Obstétricos</label>
                <textarea id="ginoObstetricBackground" name="ginoObstetricBackground" className={styles.textarea}/>
                {errors.ginoObstetricBackground && <p className={styles.error}>{errors.ginoObstetricBackground}</p>}
                <div className={styles.subheaderContainer}>
                    <h2 className={styles.subheader}>Evaluación</h2>
                    <div className={styles.divBar}/>
                </div>

                <label htmlFor="diagnosis" className={styles.label}>Diagnóstico</label>
                <textarea id="diagnosis" name="diagnosis" className={styles.textarea}/>
                {errors.diagnosis && <p className={styles.error}>{errors.diagnosis}</p>}
                <label htmlFor="treatment" className={styles.label}>Tratamiento</label>
                <textarea id="treatment" name="treatment" className={styles.textarea}/>
                {errors.treatment && <p className={styles.error}>{errors.treatment}</p>}

                <div className={styles.buttonContainer}>
                    <div className={styles.fileModal}>
                        <input type="file" id="file" name="file" className={styles.fileInput} onChange={handleFileSelect}/>
                        <button type="button" className={styles.button} onClick={triggerFileInput}>
                            Subir Archivo de Examen
                        </button>
                        <p className={styles.fileText}>
                            {selectedFile ? selectedFile : "No se ha subido ningún archivo."}
                        </p>
                    </div>
                    <button type="submit" className={styles.button}>Registrar</button>
                </div>
            </form>
        </main>
    )
}