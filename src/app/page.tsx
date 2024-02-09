"use client";
import styles from "./page.module.css";
import SearchBar from "../../components/SearchBar/SearchBar";
import IconComponent from "../../components/Icon/Icon";
import Link from "next/link";
import { useEffect, useState } from "react";
import PatientCard from "../../components/PatientCard/PatientCard";
import Image from "next/image";
import Fuse from "fuse.js";

interface patientInfo {
  id: string;
  fullName: string;
  governmentId: string;
  birthDate: string; // needs to be parsed into a Date object
  phoneNumber: string; // will be returned as "" if not present
  email: string;
}

export default function Home() {
  const [loading, setLoading] = useState(true);
  const [patients, setPatients] = useState<patientInfo[]>([]);
  const [filteredPatients, setFilteredPatients] = useState<patientInfo[]>([]);

  const onSearch = (input: string) => {
    if (input === "") {
      setFilteredPatients(patients);
      return;
    }
    const fuse = new Fuse(patients, {
      keys: ["fullName", "phoneNumber", "governmentId", "email"],
    });
    const result = fuse.search(input);
    setFilteredPatients(result.map((res) => res.item));
  }

  useEffect(() => {
    console.log("Fetching patients");
    setLoading(true);
    fetch("http://localhost:3000/api/patients")
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        setPatients(data);
        setFilteredPatients(data);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  }, []);

  return (
    <main className={`${styles.main} ${loading ? styles.loading : ''}`}>
      <div className={styles.navbar}> 
        <h1 className={styles.header}>Expediente Digital</h1>
        <Link href="/new">  
          <IconComponent icon="fa:plus-square" className={styles.icon}/>
        </Link>
      </div>
      <SearchBar onInputChanged={onSearch}/>
      <div className={styles.divBar}/>
      { loading ? <div></div> :
        filteredPatients.length > 0 ?
          <div className={styles.patientList}>
            {filteredPatients.map((patient) => (
              <PatientCard key={patient.id} {...patient}/>
            ))}
          </div>
        :
          <div className={styles.noResults}>
            <img src="https://media.tenor.com/fh604lLMYeMAAAAM/milk-pudding.gif" alt="No se encontraron resultados" className={styles.gif}/>
            <h2> ¡No se encontraron resultados! </h2>
            <p> Intenta refinar tu búsqueda, o <Link href="/new"> crea un nuevo paciente. </Link> </p>

          </div>
      }

    </main>
  );
}
