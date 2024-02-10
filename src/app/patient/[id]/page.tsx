'use client';
import styles from "./page.module.css";
import Link from "next/link";
import IconComponent from "../../../../components/Icon/Icon";
import { useEffect, useState } from "react";

interface PatientInfo {
    fullName: string;
    governmentId: string; 
    birthDate: string;
    email: string;
    phoneNumber?: string;
    familyBackground?: string;
    pathologicBackground?: string;
    nonPathologicBackground?: string;
    chirurgicalBackground?: string;
    ginoObstetricBackground?: string;
    diagnosis?: string;
    treatment?: string;
    examPdfPath?: string;
}


export default function ViewPatient({params}: {params: {id: string}}) {
    const [errors, setErrors] = useState({} as Record<string, string>);
    const [selectedFile, setSelectedFile] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [patient, setPatient] = useState<PatientInfo | null>(null);
    const [is404, setIs404] = useState(false);
    
    const calculateAge = (birthDate: Date) => {
        const diff = Date.now() - birthDate.getTime();
        const ageDate = new Date(diff);
        return Math.abs(ageDate.getUTCFullYear() - 1970);
    }
    
    const formatDate = (date: string) => {
        const day = date.split('T')[0];
        const year = day.split('-')[0];
        const month = day.split('-')[1];
        const dateDay = day.split('-')[2];
        const parsedDate = new Date(`${month}/${dateDay}/${year}`);
        return `${parsedDate.getDate()}/${parsedDate.getMonth() + 1}/${parsedDate.getFullYear()} (${calculateAge(parsedDate)} años)`;
    }
    useEffect(() => {
        // fetch from /api/patients/:id 
        fetch(`/api/patients/${params.id}`)
            .then((res) => {
                if (res.ok) {
                    return res.json();
                } else {
                    if (res.status === 404) {
                        setIs404(true);
                    }
                    throw new Error("Network response was not ok");
                }
            })
            .then((data) => {
                setPatient(data);
                console.log(data);
                setIsLoading(false);
            })
            .catch((err) => {
                console.log(err);
                setIs404(true);
                setIsLoading(false);
            });
    }, [params.id]);


    return (
        <main className={`${ styles.main } ${ isLoading ? styles.loading : "" }`}>
            <div className={styles.navbar}> 
                <Link href="/">  
                    <IconComponent icon="lucide:arrow-left" className={styles.icon}/>
                </Link>
                <h1 className={styles.header}>Información del Paciente</h1>
            </div>
            <div className={styles.divBar}/>
            
            {!isLoading && <div className={styles.infoContainer}>
                <div className={styles.formSectionContainer}>
                <div className={styles.formSection}>
                    <label htmlFor="fullName" className={styles.label}>Nombre</label>
                    <p className={styles.text}>{patient?.fullName}</p>
                    <label htmlFor="governmentId" className={styles.label}>Cédula</label>
                    <p className={styles.text}>{patient?.governmentId}</p>
                    <label htmlFor="birthDate" className={styles.label}>Fecha de Nacimiento</label>
                    <p className={styles.text}>{formatDate(patient!.birthDate)}</p>
                    <label htmlFor="phoneNumber" className={styles.label}>Teléfono</label>
                    <p className={styles.text}>{patient?.phoneNumber ? patient.phoneNumber : "Sin n. teléfono"}</p>
                    <label htmlFor="email" className={styles.label}>Correo Electrónico </label>
                    <p className={styles.text}>{patient?.email}</p>
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
                {errors.familyBackground && <p className={styles.error}>
                    <IconComponent icon="icon-park-solid:error" className={styles.errorIcon}/>
                    {errors.familyBackground}</p>}
                <label htmlFor="pathologicBackground" className={styles.label}>Antecedentes Patológicos</label>
                <textarea id="pathologicBackground" name="pathologicBackground" className={styles.textarea}/>
                {errors.pathologicBackground && <p className={styles.error}>
                    <IconComponent icon="icon-park-solid:error" className={styles.errorIcon}/>
                    {errors.pathologicBackground}</p>}
                <label htmlFor="nonPathologicBackground" className={styles.label}>Antecedentes No Patológicos</label>
                <textarea id="nonPathologicBackground" name="nonPathologicBackground" className={styles.textarea}/>
                {errors.nonPathologicBackground && <p className={styles.error}>
                    <IconComponent icon="icon-park-solid:error" className={styles.errorIcon}/>
                    {errors.nonPathologicBackground}</p>}
                <label htmlFor="chirurgicalBackground" className={styles.label}>Antecedentes Quirúrgicos</label>
                <textarea id="chirurgicalBackground" name="chirurgicalBackground" className={styles.textarea}/>
                {errors.chirurgicalBackground && <p className={styles.error}>
                    <IconComponent icon="icon-park-solid:error" className={styles.errorIcon}/>
                    {errors.chirurgicalBackground}</p>}
                <label htmlFor="ginoObstetricBackground" className={styles.label}>Antecedentes Gineco-Obstétricos</label>
                <textarea id="ginoObstetricBackground" name="ginoObstetricBackground" className={styles.textarea}/>
                {errors.ginoObstetricBackground && <p className={styles.error}>
                    <IconComponent icon="icon-park-solid:error" className={styles.errorIcon}/>
                    {errors.ginoObstetricBackground}</p>}
                <div className={styles.subheaderContainer}>
                    <h2 className={styles.subheader}>Evaluación</h2>
                    <div className={styles.divBar}/>
                </div>

                <label htmlFor="diagnosis" className={styles.label}>Diagnóstico</label>
                <textarea id="diagnosis" name="diagnosis" className={styles.textarea}/>
                {errors.diagnosis && <p className={styles.error}>
                    <IconComponent icon="icon-park-solid:error" className={styles.errorIcon}/>
                    {errors.diagnosis}</p>}
                <label htmlFor="treatment" className={styles.label}>Tratamiento</label>
                <textarea id="treatment" name="treatment" className={styles.textarea}/>
                {errors.treatment && <p className={styles.error}>
                    <IconComponent icon="icon-park-solid:error" className={styles.errorIcon}/>
                    {errors.treatment}</p>}
                <div className={styles.buttonContainer}>
                    <div className={styles.fileModal}>
                        <input type="file" id="file" name="file" className={styles.fileInput} />
                        <button type="button" className={styles.button} >
                            Subir Archivo de Examen
                        </button>
                        <p className={styles.fileText}>
                            {selectedFile ? selectedFile : "No se ha subido ningún archivo."}
                        </p>
                    </div>
                    <button type="submit" className={styles.button}>Registrar</button>
                </div>
            </div>}
        </main>
    )
}