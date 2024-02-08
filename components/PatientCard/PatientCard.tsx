import styles from "./PatientCard.module.css";

interface PatientCardProps {
    id: string;
    fullName: string;
    governmentId: string;
    birthDate: string; // needs to be parsed into a Date object
    phoneNumber: string; // will be returned as "" if not present
    email: string;
}

export default function PatientCard(props: PatientCardProps) {
    return (
        <div className={styles.card}>
            <h2>{props.fullName}</h2>
            <p>{props.governmentId}</p>
            <p>{props.birthDate}</p>
            <p>{props.phoneNumber}</p>
            <p>{props.email}</p>
        </div>
    );
}