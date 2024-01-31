import styles from "./page.module.css";
import Link from "next/link";
import IconComponent from "../../../components/Icon/Icon";

export default function New() {
    return (
        <main className={styles.main}>
            <div className={styles.navbar}> 
                <Link href="/">  
                    <IconComponent icon="lucide:arrow-left" className={styles.icon}/>
                </Link>
                <h1 className={styles.header}>Registrar Paciente</h1>
            </div>
            <div className={styles.divBar}/>
        </main>
    )
}