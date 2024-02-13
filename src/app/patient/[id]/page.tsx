'use client';
import styles from "./page.module.css";
import Link from "next/link";
import IconComponent from "../../../../components/Icon/Icon";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { deleteHelper } from "../../../../utils/deleteHelper";

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
    examPdfPath?: string;
}


export default function ViewPatient({params}: {params: {id: string}}) {
    const [isLoading, setIsLoading] = useState(true);
    const [patient, setPatient] = useState<PatientInfo | null>(null);
    const [is404, setIs404] = useState(false);
    const [isDownloading, setIsDownloading] = useState(false);
    const router = useRouter();
    
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

    const goToEdit = () => {
        router.push(`/patient/${params.id}/edit`);
    }

    const handleDelete = async () => {
        if (await deleteHelper(params.id)) {
            router.push('/');
        }
    }

    const handleDownload = () => {
        setIsDownloading(true);
        // this function fetches the examPdfPath from the patient object and downloads the file
        // via the GET /api/files/:id route
        // downloads in browser, with the file being a base64 string (examPdf from the response JSON)
        // and the filename being the original filename (from the response JSON)
        fetch(`/api/files/${patient!.examPdfPath}`)
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
                setIsDownloading(false);
            })
            .catch((err) => {
                console.log(err);
                setIsDownloading(false);
            });
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
        <main className={`${ styles.main } ${ isLoading || isDownloading ? styles.loading : "" }`}>
            <div className={styles.navbar}> 
                <Link href="/">  
                    <IconComponent icon="lucide:arrow-left" className={styles.icon}/>
                </Link>
                <h1 className={styles.header}>Información del Paciente</h1>
            </div>
            <div className={styles.divBar}/>
            
            {   
                is404 ? 
                <div className={styles.errorContainer}>
                    <img src="https://media.tenor.com/fh604lLMYeMAAAAM/milk-pudding.gif" alt="No se encontraron resultados" className={styles.gif}/>
                    <h2> No se ha encontrado al paciente. </h2>
                    <p> Es posible que el servidor no esté en línea o que este paciente se haya desactivado. <Link href="/"> Volver a la página principal. </Link> </p>
                </div> : 

                !isLoading && <div className={styles.infoContainer}>
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
                <p className={styles.paragraph}>{patient?.familyBackground ? patient.familyBackground : "Sin antecedentes familiares."}</p>
                <label htmlFor="pathologicBackground" className={styles.label}>Antecedentes Patológicos</label>
                <p className={styles.paragraph}>{patient?.pathologicBackground ? patient.pathologicBackground : "Sin antecedentes patológicos."}</p>
                <label htmlFor="nonPathologicBackground" className={styles.label}>Antecedentes No Patológicos</label>
                <p className={styles.paragraph}>{patient?.nonPathologicBackground ? patient.nonPathologicBackground : "Sin antecedentes no patológicos."}</p>
                <label htmlFor="chirurgicalBackground" className={styles.label}>Antecedentes Quirúrgicos</label>
                <p className={styles.paragraph}>{patient?.chirurgicalBackground ? patient.chirurgicalBackground : "Sin antecedentes quirúrgicos."}</p>
                <label htmlFor="ginecoObstetricBackground" className={styles.label}>Antecedentes Gineco-Obstétricos</label>
                <p className={styles.paragraph}>{patient?.ginecoObstetricBackground ? patient.ginecoObstetricBackground : "Sin antecedentes gineco-obstétricos."}</p>
                <div className={styles.subheaderContainer}>
                    <h2 className={styles.subheader}>Evaluación</h2>
                    <div className={styles.divBar}/>
                </div>

                <label htmlFor="diagnosis" className={styles.label}>Diagnóstico</label>
                <p className={styles.paragraph}>{patient?.diagnosis ? patient.diagnosis : "Sin diagnóstico."}</p>
                <label htmlFor="treatment" className={styles.label}>Tratamiento</label>
                <p className={styles.paragraph}>{patient?.treatment ? patient.treatment : "Sin tratamiento."}</p>

                <div className={styles.buttonContainer}>
                    {   patient?.examPdfPath &&
                            <button type="button" className={styles.button} onClick={handleDownload}>
                                <IconComponent icon="fluent:arrow-download-28-filled" className={styles.buttonIcon}/>
                                Descargar archivo de examen
                            </button>
                    }
                    <button type="button" className={styles.button} onClick={goToEdit}>
                        <IconComponent icon="fluent:edit-16-filled" className={styles.buttonIcon}/>
                        Editar información del paciente
                    </button>
                    <button type="button" className={styles.deleteButton} onClick={handleDelete}>
                        <IconComponent icon="fluent:delete-16-filled" className={styles.buttonIcon}/>
                        Eliminar paciente
                    </button>
                </div>


            </div>}
        </main>
    )
}