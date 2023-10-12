import { Link, useNavigate } from "react-router-dom";
import UmiyaMataji from "../../assets/umiya-mataji.png";
import Navbar from "../../components/Navbar/Navbar";
import "./Homepage.css";
import { useData } from "../../contexts/DataContext";

const Homepage = () => {
    const navigate = useNavigate();
    const { dataState : {allFirms, phaad, datar, sikshanidhi}} = useData();

    return (
        <div className="App d-flex flex-column min-vh-100">
        <Navbar />
        <main className="container mt-3 flex-fill">
          <div className="container">
            <div className="row">
              <div class="col-md-4 col-xl-3" onClick={()=>navigate("/allFirms")} role="button">
                  <div class="card bg-c-blue text-white">
                      <div class="card-block">
                          <h4 class="m-b-20">All Firms</h4>
                          <p class="m-b-0">Firms Count<span class="f-right">{allFirms.length}</span></p>
                      </div>
                  </div>
              </div>
              <div class="col-md-4 col-xl-3" onClick={()=>navigate("/datar")} role="button">
                  <div class="card bg-c-green text-white">
                      <div class="card-block">
                          <h4 class="m-b-20">Datar</h4>
                          <p class="m-b-0">Datar Collected<span class="f-right">{datar.reduce((acc,curr)=>acc+curr.current,0)}</span></p>
                      </div>
                  </div>
              </div>
              
              <div class="col-md-4 col-xl-3" onClick={()=>navigate("/phaad")} role="button">
                  <div class="card bg-c-yellow text-white">
                      <div class="card-block">
                          <h4 class="m-b-20">Phaado</h4>
                          <p class="m-b-0">Phaad Collected<span class="f-right">{phaad.reduce((acc,curr)=>acc+curr.current,0)}</span></p>
                      </div>
                  </div>
              </div>
              
              <div class="col-md-4 col-xl-3" onClick={()=>navigate("/sikshanidhi")} role="button">
                  <div class="card bg-c-pink text-white">
                      <div class="card-block">
                          <h4 class="m-b-20">Sikshanidhi</h4>
                          <p class="m-b-0">Sikshanidhi Collected<span class="f-right">{sikshanidhi.reduce((acc,curr)=>acc+curr.current,0)}</span></p>
                      </div>
                  </div>
              </div>
              <div class="col-md-4 col-xl-3" onClick={()=>navigate("/sikshanidhi")} role="button">
                  <div class="card bg-c-brown text-white">
                      <div class="card-block">
                          <h4 class="m-b-20">Samiti</h4>
                          <p class="m-b-0">Samiti Count<span class="f-right">{sikshanidhi.reduce((acc,curr)=>acc+curr.current,0)}</span></p>
                      </div>
                  </div>
              </div>
              <div class="col-md-4 col-xl-3" onClick={()=>navigate("/sikshanidhi")} role="button">
                  <div class="card bg-c-gray text-white">
                      <div class="card-block">
                          <h4 class="m-b-20">Kharcha</h4>
                          <p class="m-b-0">Total Expense<span class="f-right">{sikshanidhi.reduce((acc,curr)=>acc+curr.current,0)}</span></p>
                      </div>
                  </div>
              </div>
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
    );
}

export default Homepage