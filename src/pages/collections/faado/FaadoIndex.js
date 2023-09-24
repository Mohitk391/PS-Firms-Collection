import { Link } from "react-router-dom"
import Navbar from "../../../components/Navbar/Navbar";
import UmiyaMataji from "../../../assets/umiya-mataji.png";

const FaadoIndex = () => {
    
    return (
    <div className="App d-flex flex-column min-vh-100">
        <Navbar />
        <main className="container mt-3 flex-fill">
            <div className="d-flex justify-content-between mb-1">
                <h2>Faado</h2>
            </div>
            <div className="day-index">
                <div className="all d-grid my-2 mx-5">
                    <Link to="/faado/all" className="btn btn-outline-dark d-flex"><span className="me-auto">All</span> <span className="me-3">Total</span></Link>
                </div>
                <div className="day-one d-grid mb-2 mx-5">
                    <Link to="/faado/day-1" className="btn btn-outline-dark d-flex"><span className="me-auto">Day 1</span> <span className="me-3">Total</span></Link>
                </div>
                <div className="day-two d-grid mb-2 mx-5">
                    <Link to="/faado/day-2" className="btn btn-outline-dark d-flex"><span className="me-auto">Day 2</span> <span className="me-3">Total</span></Link>
                </div>
                <div className="day-three d-grid mb-2 mx-5">
                    <Link to="/faado/day-3" className="btn btn-outline-dark d-flex"><span className="me-auto">Day 3</span> <span className="me-3">Total</span></Link>
                </div>
                <div className="day-four d-grid mb-2 mx-5">
                    <Link to="/faado/day-4" className="btn btn-outline-dark d-flex"><span className="me-auto">Day 4</span> <span className="me-3">Total</span></Link>
                </div>
                <div className="day-five d-grid mb-2 mx-5">
                    <Link to="/faado/day-5" className="btn btn-outline-dark d-flex"><span className="me-auto">Day 5</span> <span className="me-3">Total</span></Link>
                </div>
                <div className="day-six d-grid mb-2 mx-5">
                    <Link to="/faado/day-6" className="btn btn-outline-dark d-flex"><span className="me-auto">Day 6</span> <span className="me-3">Total</span></Link>
                </div>
                <div className="day-seven d-grid mb-2 mx-5">
                    <Link to="/faado/day-7" className="btn btn-outline-dark d-flex"><span className="me-auto">Day 7</span> <span className="me-3">Total</span></Link>
                </div>
                <div className="day-eight d-grid mb-2 mx-5">
                    <Link to="/faado/day-8" className="btn btn-outline-dark d-flex"><span className="me-auto">Day 8</span> <span className="me-3">Total</span></Link>
                </div>
                <div className="day-nine d-grid mb-2 mx-5">
                    <Link to="/faado/day-9" className="btn btn-outline-dark d-flex"><span className="me-auto">Day 9</span> <span className="me-3">Total</span></Link>
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