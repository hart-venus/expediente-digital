import styles from "./SearchBar.module.css";
import Icon from "../Icon/Icon";

export default function SearchBar() {
    return (
        <main className={styles.main}>
            <input type="text" placeholder="Buscar pacientes..." className={styles.searchBar}/>
            <Icon icon="material-symbols:search" className={styles.searchIcon}/>
        </main>
    );
}