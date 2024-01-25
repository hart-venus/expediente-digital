import styles from "./page.module.css";
import SearchBar from "../../components/SearchBar/SearchBar";

export default function Home() {
  return (
    <main className={styles.main}>
      <h1 className={styles.header}>Expediente Digital</h1>
      <SearchBar/>
      <div className={styles.divBar}/>
    </main>
  );
}
