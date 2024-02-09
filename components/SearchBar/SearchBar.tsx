'use client'; 
import styles from "./SearchBar.module.css";
import Icon from "../Icon/Icon";

interface SearchBarProps {
    onInputChanged?: (input: string) => void;
}

export default function SearchBar(props: SearchBarProps) {

    const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (props.onInputChanged) {
            props.onInputChanged(e.target.value);
        }
    }

    return (
        <main className={styles.main}>
            <input type="text" placeholder="Buscar pacientes..." className={styles.searchBar} onChange={handleInput}/>
            <Icon icon="material-symbols:search" className={styles.searchIcon}/>
        </main>
    );
}