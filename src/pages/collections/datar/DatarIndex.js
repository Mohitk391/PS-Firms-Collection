import { Link } from "react-router-dom"
import Navbar from "../../../components/Navbar/Navbar";
import UmiyaMataji from "../../../assets/umiya-mataji.png";
import { useData } from "../../../contexts/DataContext";
import { useEffect, useState } from "react";
import { Timestamp } from "firebase/firestore";

const daysIndex = {
    "15/10/2023" : 1,
    "16/10/2023" : 2,
    "17/10/2023" : 3,
    "18/10/2023" : 4,
    "19/10/2023" : 5,
    "20/10/2023" : 6,
    "21/10/2023" : 7,
    "22/10/2023" : 8,
    "23/10/2023" : 9
}

const DatarIndex = () => {
    const {dataState: {datar}} = useData();
    const [day, setDay] = useState(0);
    let elements = [];

    useEffect(()=>{
        setDay(daysIndex[(new Timestamp(datar[datar.length-1]?.created_at.seconds, datar[datar.length-1]?.created_at.nanoseconds)).toDate().toLocaleDateString('en-GB')]);
    },[datar]);

    for(let i=1; i<=day; i++) {
        elements.push(
            <div className="day-one d-grid mb-2 mx-5" key={i}>
                <Link to={`/datar/day-${i}`} className="btn btn-outline-dark d-flex">
                    <span className="me-auto">Day {i}</span> 
                    <span className="me-3">Total</span>
                </Link>
            </div>
        );
    }

    return (
    <div className="App d-flex flex-column min-vh-100">
        <Navbar />
        <main className="container mt-3 flex-fill">
            <div className="d-flex justify-content-between mb-1">
                <h2>Datar</h2>
            </div>
            <div className="day-index">
                <div className="all d-grid my-2 mx-5">
                    <Link to="/datar/all" className="btn btn-outline-dark d-flex"><span className="me-auto">All</span> <span className="me-3">Total</span></Link>
                </div>
                {
                    elements.map(element => element)
                }
            </div>
        </main>
        <footer className="page-footer shadow-lg border-top">
            <div className="d-flex flex-wrap justify-content-between align-items-center mx-auto py-4">
            <div className="d-flex flex-wrap align-items-center justify-content-start">
                <Link href="/" className="d-flex align-items-center p-0 text-dark gap-0">
                <img alt="logo" className="mx-3" src={UmiyaMataji} width="40"/>
                <span className="h5 mb-0 font-weight-bold">Patidar Yuva Mandal</span>
                </Link> 
            </div>
            <div className="pe-3 d-flex gap-3">
                <button className="btn btn-dark rounded-5">
                <i className="bi bi-facebook"></i>
                </button>
                <button className="btn btn-dark rounded-5">
                <i className="bi bi-twitter"></i>
                </button>
                <button className="btn btn-dark rounded-5">
                <i className="bi bi-instagram"></i>
                </button>
            </div>
            </div>
        </footer>
    </div>
    )
}

export default DatarIndex