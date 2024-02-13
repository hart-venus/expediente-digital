'use client';
import styles from "./page.module.css";
import Link from "next/link";
import IconComponent from "../../../../../components/Icon/Icon";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

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
    ginecoObstetricBackground?: string;
    diagnosis?: string;
    treatment?: string;
}

export default function Edit({params}: {params: {id: string}}) {
    const [errors, setErrors] = useState({} as Record<string, string>);
    const [selectedFile, setSelectedFile] = useState<string | null>(null);
    const [isDirty, setIsDirty] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isFetching, setIsFetching] = useState(true);
    const [is404, setIs404] = useState(false);
    const [patient, setPatient] = useState<PatientInfo | null>(null);
    const [oldPdfPath, setOldPdfPath] = useState<string | null>(null);
    const router = useRouter();

    // fetch patient
    useEffect(() => {
        fetch(`/api/patients/${params.id}`)
            .then((res)=> {
                if (res.ok) {
                    return res.json();
                } else {
                    throw new Error("Patient not found");
                }
            })
            .then((data) => {
                setPatient({...data, birthDate: toHtmlDate(data.birthDate)});
                setOldPdfPath(data.examPdfPath);
                setIsFetching(false);
            })
            .catch((e) => {
                console.log(e);
                setIs404(true);
                setIsFetching(false);
            })
    }, [params.id])

    // function that converts a string javascript date to a html date string
    const toHtmlDate = (date: string) => {
        const day = date.split('T')[0];
        return day;
    }

    const handleDownload = () => {
        setIsLoading(true);
        // this function fetches the examPdfPath from the patient object and downloads the file
        // via the GET /api/files/:id route
        // downloads in browser, with the file being a base64 string (examPdf from the response JSON)
        // and the filename being the original filename (from the response JSON)
        fetch(`/api/files/${oldPdfPath}`)
            .then((res) => {
                if (res.ok) {
                    return res.json();
                } else {
                    throw new Error("Network response was not ok");
                }
            })
            .then((data) => {
                const fileName = data.filename;
                // get extension from filename
                const extension = fileName.split('.').pop();
                const linkSource = `data:application/${extension};base64,${data.examPdf}`;
                const downloadLink = document.createElement("a");
                downloadLink.href = linkSource;
                downloadLink.download = fileName;
                downloadLink.click();
                setIsLoading(false);
            })
            .catch((err) => {
                console.log(err);
                setIsLoading(false);
            });
    }

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
            const res = await fetch(`/api/patients/${params.id}`, {
                method: "PUT",
                body: formData
            });

            if (res.ok) {
                console.log("Patient edited successfully");
                router.push("/patient/" + params.id);
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

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const {name, value} = event.target;
        setPatient((prev) => ({...prev, [name]: value}) as any);
    }

    const handleTextAreaChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        const {name, value} = event.target;
        setPatient((prev) => ({...prev, [name]: value}) as any);
    }

    return (
        <main className={`${ styles.main } ${ isLoading || isFetching ? styles.loading : "" }`}>
            <div className={styles.navbar}> 
                <Link href={`/patient/${params.id}`}>  
                    <IconComponent icon="lucide:arrow-left" className={styles.icon}/>
                </Link>
                <h1 className={styles.header}>Editar Paciente</h1>
            </div>
            <div className={styles.divBar}/>
            {

            is404 ? 
            <div className={styles.errorContainer}>
                <img src="https://media.tenor.com/fh604lLMYeMAAAAM/milk-pudding.gif" alt="No se encontraron resultados" className={styles.gif}/>
                <h2> No se ha encontrado al paciente. </h2>
                <p> Es posible que el servidor no esté en línea o que este paciente se haya desactivado. <Link href="/"> Volver a la página principal. </Link> </p>
            </div> : 

            !isFetching && <form onSubmit={handleSubmit} className={styles.form} onChange={() => setIsDirty(true)}>
                <div className={styles.formSectionContainer}>
                    <div className={styles.formSection}>
                        <label htmlFor="fullName" className={styles.label}>Nombre *</label>
                        <input type="text" id="fullName" name="fullName" className={styles.input} value={patient?.fullName} onChange={handleInputChange} required/>
                        {errors.fullName && <p className={styles.error}>
                            <IconComponent icon="icon-park-solid:error" className={styles.errorIcon}/>
                            {errors.fullName}
                        </p>}
                        <label htmlFor="governmentId" className={styles.label}>Cédula *</label>
                        <input type="text" id="governmentId" name="governmentId" className={styles.input} value={patient?.governmentId} onChange={handleInputChange} required/>
                        {errors.governmentId && <p className={styles.error}>
                            <IconComponent icon="icon-park-solid:error" className={styles.errorIcon}/>
                            {errors.governmentId}</p>}
                        <label htmlFor="birthDate" className={styles.label}>Fecha de Nacimiento *</label>
                        <input type="date" id="birthDate" name="birthDate" className={styles.input} value={patient?.birthDate} onChange={handleInputChange} required/>
                        {errors.birthDate && <p className={styles.error}>
                            <IconComponent icon="icon-park-solid:error" className={styles.errorIcon}/>
                            {errors.birthDate}</p>}
                        <label htmlFor="phoneNumber" className={styles.label}>Teléfono</label>
                        <input type="text" id="phoneNumber" name="phoneNumber" className={styles.input} value={patient?.phoneNumber} onChange={handleInputChange}/>
                        {errors.phoneNumber && <p className={styles.error}>
                            <IconComponent icon="icon-park-solid:error" className={styles.errorIcon}/>
                            {errors.phoneNumber}</p>}
                        <label htmlFor="email" className={styles.label}>Correo Electrónico *</label>
                        <input type="email" id="email" name="email" className={styles.input} value={patient?.email} onChange={handleInputChange} required/>
                        {errors.email && <p className={styles.error}>
                            <IconComponent icon="icon-park-solid:error" className={styles.errorIcon}/>
                            {errors.email}</p>}
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
                <textarea id="familyBackground" name="familyBackground" className={styles.textarea} value={patient?.familyBackground} onChange={handleTextAreaChange}/>
                {errors.familyBackground && <p className={styles.error}>
                    <IconComponent icon="icon-park-solid:error" className={styles.errorIcon}/>
                    {errors.familyBackground}</p>}
                <label htmlFor="pathologicBackground" className={styles.label}>Antecedentes Patológicos</label>
                <textarea id="pathologicBackground" name="pathologicBackground" className={styles.textarea} value={patient?.pathologicBackground} onChange={handleTextAreaChange}/>
                {errors.pathologicBackground && <p className={styles.error}>
                    <IconComponent icon="icon-park-solid:error" className={styles.errorIcon}/>
                    {errors.pathologicBackground}</p>}
                <label htmlFor="nonPathologicBackground" className={styles.label}>Antecedentes No Patológicos</label>
                <textarea id="nonPathologicBackground" name="nonPathologicBackground" className={styles.textarea} value={patient?.nonPathologicBackground} onChange={handleTextAreaChange}/>
                {errors.nonPathologicBackground && <p className={styles.error}>
                    <IconComponent icon="icon-park-solid:error" className={styles.errorIcon}/>
                    {errors.nonPathologicBackground}</p>}
                <label htmlFor="chirurgicalBackground" className={styles.label}>Antecedentes Quirúrgicos</label>
                <textarea id="chirurgicalBackground" name="chirurgicalBackground" className={styles.textarea} value={patient?.chirurgicalBackground} onChange={handleTextAreaChange}/>
                {errors.chirurgicalBackground && <p className={styles.error}>
                    <IconComponent icon="icon-park-solid:error" className={styles.errorIcon}/>
                    {errors.chirurgicalBackground}</p>}
                <label htmlFor="ginecoObstetricBackground" className={styles.label}>Antecedentes Gineco-Obstétricos</label>
                <textarea id="ginecoObstetricBackground" name="ginecoObstetricBackground" className={styles.textarea} value={patient?.ginecoObstetricBackground} onChange={handleTextAreaChange}/>
                {errors.ginecoObstetricBackground && <p className={styles.error}>
                    <IconComponent icon="icon-park-solid:error" className={styles.errorIcon}/>
                    {errors.ginecoObstetricBackground}</p>}
                <div className={styles.subheaderContainer}>
                    <h2 className={styles.subheader}>Evaluación</h2>
                    <div className={styles.divBar}/>
                </div>

                <label htmlFor="diagnosis" className={styles.label}>Diagnóstico</label>
                <textarea id="diagnosis" name="diagnosis" className={styles.textarea} value={patient?.diagnosis} onChange={handleTextAreaChange}/>
                {errors.diagnosis && <p className={styles.error}>
                    <IconComponent icon="icon-park-solid:error" className={styles.errorIcon}/>
                    {errors.diagnosis}</p>}
                <label htmlFor="treatment" className={styles.label}>Tratamiento</label>
                <textarea id="treatment" name="treatment" className={styles.textarea} value={patient?.treatment} onChange={handleTextAreaChange}/>
                {errors.treatment && <p className={styles.error}>
                    <IconComponent icon="icon-park-solid:error" className={styles.errorIcon}/>
                    {errors.treatment}</p>}
                <div className={styles.buttonContainer}>
                    <div className={styles.fileModal}>
                        {
                            oldPdfPath && <button type="button" className={styles.button} onClick={handleDownload}>
                                <IconComponent icon="fluent:arrow-download-28-filled" className={styles.buttonIcon}/>
                                Descargar Archivo Original
                            </button>
                        }
                        <input type="file" id="file" name="file" className={styles.fileInput} onChange={handleFileSelect}/>
                        <button type="button" className={styles.button} onClick={triggerFileInput}>
                            Subir Nuevo Archivo de Examen
                        </button>
                        <p className={styles.fileText}>
                            {selectedFile ? selectedFile : "No se ha subido ningún archivo."}
                        </p>
                    </div>
                    <button type="submit" className={styles.button}>Guardar cambios</button>
                </div>

                {errors.nonFieldError && <p className={styles.nonFieldError}>
                    <IconComponent icon="icon-park-solid:error" className={styles.errorIcon}/>
                    {errors.nonFieldError}</p>}
            </form>}
        </main>
    )
}