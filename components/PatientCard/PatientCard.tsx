import IconComponent from "../Icon/Icon";
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

    const parsedDate = new Date(props.birthDate);
    const formattedDate = `${parsedDate.getDate()}/${parsedDate.getMonth()}/${parsedDate.getFullYear()}`;

    return (
        <div className={styles.card}>
            <div className={styles.userBox}>
                <IconComponent icon="bx:user" className={styles.userIcon}/>
            </div>

            <div className={styles.userInfo}>
                <h2 className={styles.name}>{props.fullName}</h2>
                <p className={styles.field}>{props.governmentId}</p>
                <p className={styles.field}>{formattedDate}</p>
                <p className={styles.field}>{props.phoneNumber ? props.phoneNumber : "Sin n. teléfono"}</p>
                <p className={styles.field}>{props.email}</p>
            </div>
        </div>
    );
}