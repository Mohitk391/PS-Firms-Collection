import { Link, useParams } from "react-router-dom";
import UmiyaMataji from "../../../assets/umiya-mataji.png";
import Navbar from "../../../components/Navbar/Navbar";
import { useEffect, useState } from "react";
import { useSamiti } from "../../../contexts/SamitiContext";
import autoTable from "jspdf-autotable";
import jsPDF from "jspdf";
import Pagination from "../../../utilities/Pagination/Pagination";
import { deleteDoc, doc } from "firebase/firestore";
import { db } from "../../../firebase-config";

const ITEMS_PER_PAGE = 10;

const Samiti = () => {
    const {place, type} = useParams();
    const [results, setResults] = useState();
    const {samitiState: {samiti}} = useSamiti();
    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');
    const [newDetails, setNewDetails] = useState({});

    useEffect(()=>{
        setResults(samiti.find(team => team.name === type && team.place === place).filter(item =>item.name.toLowerCase().includes(searchTerm.toLowerCase().trim())));
    },[place, samiti, type, searchTerm]);

    useEffect(() => {
        setCurrentPage(1);
      }, [results]);

    const totalPages = Math.ceil(results?.members?.length / ITEMS_PER_PAGE);
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    const currentItems = results?.members?.slice(startIndex, endIndex);
  
    const handlePageChange = (newPage) => {
      setCurrentPage(newPage);
    };

    const deleteMember = async (id) => {
        await deleteDoc(doc(db, "samiti", results.name, results.place, id)); 
      }

    const downloadTable = (name) => {
        const doc = new jsPDF();
        doc.text(`Samiti - ${name}`, 15, 12);
        autoTable(doc, { html: '#fullDataTable' });
        doc.save(`Samiti - ${name}.pdf`)
    }

    return (
        <div className="App d-flex flex-column min-vh-100">
        <Navbar />
         <main className="container mt-3 flex-fill">
             <div className="d-flex justify-content-between mb-2">
               <div className="header">
                 <span className="h2">Samiti</span>
               </div>
               <input className="py-0 px-3 border rounded-4 border-opacity-50" type="text" placeholder="Search" value={searchTerm} onChange={event=>setSearchTerm(event.target.value)} />
                { results?.members?.length > 0 ? <button onClick={()=>downloadTable(results?.name)} className="btn btn-outline-dark" title="Download Records PDF"><i className="bi bi-file-earmark-arrow-down-fill"></i></button> : <button className="invisible pe-none"></button>}
             </div>
            <h3>{results?.name}</h3>
            { results?.members?.length >0 ? (
                <table className="table table-bordered table-hover" id="SamitiTable">
                    <thead>
                        <tr>
                            <th className="text-center border-3">Name</th>
                            <th className="border-3">Firm Name</th>
                            <th className="text-center border-3">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentItems?.map((member) => {
                        return (
                            <tr  key={member.id}>
                                <td role="button" className="fw-bold border-3">{member.name}</td>
                                <td className="text-center border-3">{member.firmName}</td>
                                <td className="text-center border-3 d-flex gap-3 justify-content-center">
                                    <i className="bi bi-trash3-fill" title="Delete member" onClick={()=>deleteMember(member.id)}></i>
                                </td>
                            </tr>
                        );
                        })}
                    </tbody>
                </table>
            ) : (
                <div className="d-flex flex-column align-items-center justify-content-center">
                    <p>No records found</p>
                    <button
                    type="button"
                    className="btn btn-outline-success"
                    data-bs-toggle="modal"
                    data-bs-target="#addNew"
                    onClick={()=>setNewDetails({...newDetails, name: searchTerm})}
                    >
                    Search All members
                    </button>
                </div> 
                )
            }
            {
                results?.members?.length > ITEMS_PER_PAGE && (
                    <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                />
            )}
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

export default Samiti