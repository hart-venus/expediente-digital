import styles from "./page.module.css";
import SearchBar from "../../components/SearchBar/SearchBar";
import IconComponent from "../../components/Icon/Icon";
import Link from "next/link";

export default function Home() {
  return (
    <main className={styles.main}>
      <div className={styles.navbar}> 
        <h1 className={styles.header}>Expediente Digital</h1>
        <Link href="/new">  
          <IconComponent icon="fa:plus-square" className={styles.icon}/>
        </Link>
      </div>
      <SearchBar/>
      <div className={styles.divBar}/>
    </main>
  );
}
