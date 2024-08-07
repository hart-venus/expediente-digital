'use client';
import styles from "./page.module.css";
import Link from "next/link";
import IconComponent from "../../../components/Icon/Icon";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function New() {
    const [errors, setErrors] = useState({} as Record<string, string>);
    const [selectedFile, setSelectedFile] = useState<string | null>(null);
    const [isDirty, setIsDirty] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    useEffect(() => {

        if (isDirty) {
            const msg = "¿Estás seguro que quieres salir? Los cambios no guardados se perderán.";
            window.onbeforeunload = (event: BeforeUnloadEvent) => {
                event.preventDefault(); // standard way to cancel the event
                event.returnValue = msg;
                return msg; // needed for old browsers
            }
        }

        return () => {
            window.onbeforeunload = null;
        }
    }, [isDirty])


    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setErrors({});
        setIsLoading(true);
        console.log("Form submitted");
        const formData = new FormData(event.currentTarget);

        // if I don't have a file, remove the file field from the form data
        if (!selectedFile) {
            formData.delete("file");
        }

        try {
            const res = await fetch("/api/patients", {
                method: "POST",
                body: formData
            });

            if (res.ok) {
                console.log("Patient registered");
                router.push("/");
            } else {
                const data = await res.json();
                // scroll to the first element with the id of the first error

                if (data.nonFieldError) {
                    // scroll to bottom, where the nonFieldError is, do this on timeout to ensure the element is already rendered
                    setTimeout(() => window.scrollTo({top: document.body.scrollHeight, behavior: "smooth"}), 200);
                } else {
                    const firstError = Object.keys(data)[0];
                    const element = document.getElementById(firstError);
                    window.scrollTo({top: element?.offsetTop, behavior: "smooth"});
                }

                setErrors(data);
            }
        } catch (error: any) {
            setErrors({nonFieldError: error.message});
        }
        setIsLoading(false);
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
        <main className={`${ styles.main } ${ isLoading ? styles.loading : "" }`}>
            <div className={styles.navbar}>
                <Link href="/">
                    <IconComponent icon="lucide:arrow-left" className={styles.icon}/>
                </Link>
                <h1 className={styles.header}>Registrar Paciente</h1>
            </div>
            <div className={styles.divBar}/>
            <form onSubmit={handleSubmit} className={styles.form} onChange={() => setIsDirty(true)}>
                <div className={styles.formSectionContainer}>
                    <div className={styles.formSection}>
                        <label htmlFor="fullName" className={styles.label}>Nombre *</label>
                        <input type="text" id="fullName" name="fullName" className={styles.input} required/>
                        {errors.fullName && <p className={styles.error}>
                            <IconComponent icon="icon-park-solid:error" className={styles.errorIcon}/>
                            {errors.fullName}
                        </p>}
                        <label htmlFor="governmentId" className={styles.label}>Cédula *</label>
                        <input type="text" id="governmentId" name="governmentId" className={styles.input} required/>
                        {errors.governmentId && <p className={styles.error}>
                            <IconComponent icon="icon-park-solid:error" className={styles.errorIcon}/>
                            {errors.governmentId}</p>}
                        <label htmlFor="birthDate" className={styles.label}>Fecha de Nacimiento *</label>
                        <input type="date" id="birthDate" name="birthDate" className={styles.input} required/>
                        {errors.birthDate && <p className={styles.error}>
                            <IconComponent icon="icon-park-solid:error" className={styles.errorIcon}/>
                            {errors.birthDate}</p>}
                        <label htmlFor="phoneNumber" className={styles.label}>Teléfono</label>
                        <input type="text" id="phoneNumber" name="phoneNumber" className={styles.input}/>
                        {errors.phoneNumber && <p className={styles.error}>
                            <IconComponent icon="icon-park-solid:error" className={styles.errorIcon}/>
                            {errors.phoneNumber}</p>}
                        <label htmlFor="email" className={styles.label}>Correo Electrónico *</label>
                        <input type="email" id="email" name="email" className={styles.input} required/>
                        {errors.email && <p className={styles.error}>
                            <IconComponent icon="icon-park-solid:error" className={styles.errorIcon}/>
                            {errors.email}</p>}
                        <label htmlFor="address" className={styles.label}>Dirección</label>
                        <input type="text" id="address" name="address" className={styles.input}/>
                        {errors.address && <p className={styles.error}>
                            <IconComponent icon="icon-park-solid:error" className={styles.errorIcon}/>
                            {errors.address}</p>}
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
                <label htmlFor="ginecoObstetricBackground" className={styles.label}>Antecedentes Gineco-Obstétricos</label>
                <textarea id="ginecoObstetricBackground" name="ginecoObstetricBackground" className={styles.textarea}/>
                {errors.ginecoObstetricBackground && <p className={styles.error}>
                    <IconComponent icon="icon-park-solid:error" className={styles.errorIcon}/>
                    {errors.ginecoObstetricBackground}</p>}
                <div className={styles.subheaderContainer}>
                    <h2 className={styles.subheader}>Evaluación</h2>
                    <div className={styles.divBar}/>
                </div>

                <label htmlFor="currentIllness" className={styles.label}>Padecimiento Actual</label>
                <textarea id="currentIllness" name="currentIllness" className={styles.textarea}/>
                {errors.currentIllness && <p className={styles.error}>
                    <IconComponent icon="icon-park-solid:error" className={styles.errorIcon}/>
                    {errors.currentIllness}</p>}
                <label htmlFor="vitalSignsPhysicalExam" className={styles.label}>Signos Vitales y Examen Físico</label>
                <textarea id="vitalSignsPhysicalExam" name="vitalSignsPhysicalExam" className={styles.textarea}/>
                {errors.vitalSignsPhysicalExam && <p className={styles.error}>
                    <IconComponent icon="icon-park-solid:error" className={styles.errorIcon}/>
                    {errors.vitalSignsPhysicalExam}</p>}
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
                <label htmlFor="progressNotes" className={styles.label}>Notas de Evolución</label>
                <textarea id="progressNotes" name="progressNotes" className={styles.textarea}/>
                {errors.progressNotes && <p className={styles.error}>
                    <IconComponent icon="icon-park-solid:error" className={styles.errorIcon}/>
                    {errors.progressNotes}</p>}
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

                {errors.nonFieldError && <p className={styles.nonFieldError}>
                    <IconComponent icon="icon-park-solid:error" className={styles.errorIcon}/>
                    {errors.nonFieldError}</p>}
            </form>
        </main>
    )
}
