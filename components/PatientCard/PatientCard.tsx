import Link from "next/link";
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
    // birthdate is YYYY-MM-DDTHH:MM:SSZ, we only need the date
    const day = props.birthDate.split('T')[0];
    const year = day.split('-')[0];
    const month = day.split('-')[1];
    const date = day.split('-')[2];
    const parsedDate = new Date(`${month}/${date}/${year}`);
    // make date format not use locale
    
    const formattedDate = `${parsedDate.getDate()}/${parsedDate.getMonth() + 1}/${parsedDate.getFullYear()}`;

    const calculateAge = (birthDate: Date) => {
        const diff = Date.now() - birthDate.getTime();
        const ageDate = new Date(diff);
        return Math.abs(ageDate.getUTCFullYear() - 1970);
    }

    return (
        <Link href={`/patient/${props.id}`} className={styles.link}>
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
                        {`${formattedDate} (${calculateAge(parsedDate)} años)`}
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
                <div className={styles.options}>
                    <Link href={`/patient/${props.id}/edit`}>
                        <IconComponent icon="fluent:edit-16-filled" className={styles.editIcon} />
                    </Link>
                    <IconComponent icon="fluent:delete-16-filled" className={styles.deleteIcon} />
                </div>
        </Link>
    );
}