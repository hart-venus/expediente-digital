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
                <p className={styles.field}>
                    <IconComponent icon="tabler:id-badge-2" className={styles.fieldIcon}/>
                    {props.governmentId}
                </p>
                <p className={styles.field}>
                    <IconComponent icon="mingcute:birthday-2-line" className={styles.fieldIcon}/>
                    {formattedDate}
                </p>
                <p className={styles.field}>
                    <IconComponent icon="mingcute:phone-line" className={styles.fieldIcon}/>
                    {props.phoneNumber ? props.phoneNumber : "Sin n. teléfono"}
                </p>
                <p className={styles.field}>
                    <IconComponent icon="jam:paper-plane" className={styles.fieldIcon}/>
                    {props.email}
                </p>
            </div>
        </div>
    );
}