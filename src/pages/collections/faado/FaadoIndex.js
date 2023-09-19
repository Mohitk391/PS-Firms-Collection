import { Link } from "react-router-dom"
import Navbar from "../../../components/Navbar/Navbar"
import autoTable from "jspdf-autotable";
import jsPDF from "jspdf";
import UmiyaMataji from "../../../assets/umiya-mataji.png";

const FaadoIndex = () => {
    
  const downloadTable = () => {
    const doc = new jsPDF();
    doc.text("Collections 2023", 15, 12);
    autoTable(doc, { html: '#fullDataTable' });
    doc.save('collections.pdf')
}
    return (
    <div className="App d-flex flex-column min-vh-100">
        <Navbar />
        <main className="container mt-3 flex-fill">
            <div className="d-flex justify-content-between mb-1">
                <h2>Faado</h2>
                <input className="py-0 px-3 border rounded-4 border-opacity-50" type="text" placeholder="Search" />
                <button onClick={downloadTable} className="btn btn-outline-dark" title="Download Records PDF"><i class="bi bi-file-earmark-arrow-down-fill"></i></button>
            </div>
            <div className="day-index">
                <div className="all d-grid my-2 mx-5">
                    <button className="btn btn-outline-dark text-start">All</button>
                </div>
                <div className="day-one d-grid mb-2 mx-5">
                    <button className="btn btn-outline-dark text-start">Day 1</button>
                </div>
                <div className="day-two d-grid mb-2 mx-5">
                    <button className="btn btn-outline-dark text-start">Day 2</button>
                </div>
                <div className="day-three d-grid mb-2 mx-5">
                    <button className="btn btn-outline-dark text-start">Day 3</button>
                </div>
                <div className="day-four d-grid mb-2 mx-5">
                    <button className="btn btn-outline-dark text-start">Day 4</button>
                </div>
                <div className="day-five d-grid mb-2 mx-5">
                    <button className="btn btn-outline-dark text-start">Day 5</button>
                </div>
                <div className="day-six d-grid mb-2 mx-5">
                    <button className="btn btn-outline-dark text-start">Day 6</button>
                </div>
                <div className="day-seven d-grid mb-2 mx-5">
                    <button className="btn btn-outline-dark text-start">Day 7</button>
                </div>
                <div className="day-eight d-grid mb-2 mx-5">
                    <button className="btn btn-outline-dark text-start">Day 8</button>
                </div>
                <div className="day-nine d-grid mb-2 mx-5">
                    <button className="btn btn-outline-dark text-start">Day 9</button>
                </div>

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

export default FaadoIndex