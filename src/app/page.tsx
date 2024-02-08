"use client";
import styles from "./page.module.css";
import SearchBar from "../../components/SearchBar/SearchBar";
import IconComponent from "../../components/Icon/Icon";
import Link from "next/link";
import { useEffect, useState } from "react";
import PatientCard from "../../components/PatientCard/PatientCard";

interface patientInfo {
  id: string;
  fullName: string;
  governmentId: string;
  birthDate: string; // needs to be parsed into a Date object
  phoneNumber: string; // will be returned as "" if not present
  email: string;
}

export default function Home() {
  const [loading, setLoading] = useState(false);
  const [patients, setPatients] = useState<patientInfo[]>([]);

  useEffect(() => {
    console.log("Fetching patients");
    setLoading(true);
    fetch("http://localhost:3000/api/patients")
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        setPatients(data);
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
      <SearchBar/>
      <div className={styles.divBar}/>
      <div className={styles.patientList}>
        {patients.map((patient) => (
          <PatientCard key={patient.id} {...patient}/>
        ))}
      </div>
    </main>
  );
}
