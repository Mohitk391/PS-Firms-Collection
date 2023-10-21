import { Link } from "react-router-dom"
import Navbar from "../../../components/Navbar/Navbar";
import UmiyaMataji from "../../../assets/umiya-mataji.png";
import { useSamiti } from "../../../contexts/SamitiContext";
import { useEffect, useState } from "react";
import { Loader } from "../../../utilities/Loader/Loader";

const SamitiIndex = () => {
    
    const {samitiState: {samiti}} = useSamiti();
    const [loading, setLoading] = useState(false);

    useEffect(()=>{
        if(samiti) 
        {setLoading(false); 
           } 
        else
        setLoading(true)
    },[samiti]);

    return (
    <div className="App d-flex flex-column min-vh-100">
        <Navbar />
        <main className="container mt-3 flex-fill">
            <div className="d-flex justify-content-between mb-1">
                <h2>Samiti</h2>
                <button className="btn btn-outline-dark" data-bs-toggle="modal" data-bs-target="#addSamitiModal">Add Samiti</button>
            </div>
            <div className="day-index">
                { loading ? <Loader loading={loading} /> :
                   samiti?.length > 0 ?
                    samiti?.map(team =>{
                        return (
                            <div className="day-one d-grid mb-2 mx-5" key={team.id}>
                                <Link to={`/samiti/${team.place}/${team.name}`} className="btn btn-outline-dark d-flex justify-content-around">
                                    <span>{team.name}</span> 
                                    <span>{team.place}</span>
                                    <span>Members - {team.members.length}</span>
                                </Link>
                            </div>
                        )
                    }) 
                    : <div>No Samiti Found</div>
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

export default SamitiIndex