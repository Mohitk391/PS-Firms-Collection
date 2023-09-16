import { Link, useNavigate } from "react-router-dom";
import UmiyaMataji from "../../../assets/umiya-mataji.png";
import Navbar from "../../../components/Navbar/Navbar";

const Datar = () => {
    const navigate = useNavigate();

    return (
        <div className="App d-flex flex-column min-vh-100">
        <Navbar />
        <main className="container mt-3 flex-fill">
           <button onClick={()=>navigate("/datar")}>Datar</button>
           <button onClick={()=>navigate("/faado")}>Faado</button>
           <button onClick={()=>navigate("/sikshanidhi")}>Sikshanidhi</button>
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
    );
}

export default Datar