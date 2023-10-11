import UmiyaMataji from "../../../assets/umiya-mataji.png";
import { useState } from "react";
import Pagination from "../../../utilities/Pagination/Pagination";
import { useEffect } from "react";
import jsPDF from "jspdf";
import autoTable from 'jspdf-autotable';
import { Link, useParams } from "react-router-dom";
import Navbar from "../../../components/Navbar/Navbar";
import { useData } from "../../../contexts/DataContext";
import { Timestamp, collection, doc, setDoc, updateDoc } from "firebase/firestore";
import { db } from "../../../firebase-config";

const ITEMS_PER_PAGE = 10;
const days = {
  "day-1" : new Date("10/15/2023").toLocaleDateString("en-GB"),
  "day-2" : new Date("10/16/2023").toLocaleDateString("en-GB"),
  "day-3" : new Date("10/17/2023").toLocaleDateString("en-GB"),
  "day-4" : new Date("10/18/2023").toLocaleDateString("en-GB"),
  "day-5" : new Date("10/19/2023").toLocaleDateString("en-GB"),
  "day-6" : new Date("10/20/2023").toLocaleDateString("en-GB"),
  "day-7" : new Date("10/21/2023").toLocaleDateString("en-GB"),
  "day-8" : new Date("10/22/2023").toLocaleDateString("en-GB"),
  "day-9" : new Date("10/23/2023").toLocaleDateString("en-GB"),
}

const Datar = () => {
  const { dayId } = useParams();
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [currentDetails, setCurrentDetails] = useState({});
  const [newDetails, setNewDetails] = useState({});
  const {dataState : {datar}} = useData();  

  useEffect(()=>{
    setResults((dayId==="all" ? datar : datar.filter(firm=>firm.date === days[dayId])).filter((item) =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase().trim())
  ));
  },[dayId, datar, searchTerm]);
  
  const handleModalClose = () => {
    setCurrentDetails({});  
    setNewDetails({});  
    setSearchTerm('');
  };

  const saveNewFirm = async (firmDetails) => {
    const docRef = await setDoc(collection(db,"datar", firmDetails.name),{...firmDetails, date: Timestamp.fromDate(new Date())})
    console.log("Document written with document id: ", docRef);
    document.getElementById('newFirmClose').click();
  }

  const saveUpdatedFirm = async () => {
    let updatingDatarBody = {};
    if(currentDetails.data){ 
      updatingDatarBody = {...updatingDatarBody, data: currentDetails.data}
    }
    if(currentDetails.amount > 0){
       updatingDatarBody = {...updatingDatarBody, amount: currentDetails.amount}
    }
    if(currentDetails.payer){
       updatingDatarBody = {...updatingDatarBody, payer: currentDetails.payer}
    }
    if(currentDetails.mobile ){
       updatingDatarBody = {...updatingDatarBody, mobile: currentDetails.mobile}
    }
    if(currentDetails.reciever){
       updatingDatarBody = {...updatingDatarBody, reciever: currentDetails.reciever}
    }

    await updateDoc(doc(db, "datar", currentDetails.name), updatingDatarBody);

    document.getElementById('newFirmClose').click();
  }

  const deleteFirm = (firmDetails) => {
   
    document.getElementById('newFirmClose').click(); 
  }
  
  useEffect(() => {
    const modalElement = document.getElementById('updateDetails');
    const newFirmModalElement = document.getElementById('addNew');
    modalElement.addEventListener('hidden.bs.modal', handleModalClose);
    newFirmModalElement.addEventListener('hidden.bs.modal', handleModalClose);
    return () => {
      modalElement.removeEventListener('hidden.bs.modal', handleModalClose);
      newFirmModalElement.removeEventListener('hidden.bs.modal', handleModalClose);
    };
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [datar]);

  const totalPages = Math.ceil(results?.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentItems = results?.slice(startIndex, endIndex);

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const downloadTable = () => {
    const doc = new jsPDF();
    doc.text(`datar ${dayId}`, 15, 12);
    autoTable(doc, { html: '#fullDataTable' });
    doc.save('collections.pdf')
}

  return (
    <div className="App d-flex flex-column min-vh-100">
     <Navbar />
      <main className="container mt-3 flex-fill">
          <div className="d-flex justify-content-between mb-2">
            <div className="header">
              <span className="h2">Datar</span>
              <span className=" px-3 fs-6">
                <Link to="/datar">Datar</Link> / <Link to={`/datar/${dayId}`}>{dayId}</Link>
              </span>
            </div>
            <input className="py-0 px-3 border rounded-4 border-opacity-50" type="text" placeholder="Search" value={searchTerm} onChange={e=>setSearchTerm(e.target.value)} />
           { results?.length > 0 ? <button onClick={downloadTable} className="btn btn-outline-dark" title="Download Records PDF"><i className="bi bi-file-earmark-arrow-down-fill"></i></button> : <button className="invisible pe-none"></button>}
          </div>
          {results?.length > 0 ? (
            <table className="table table-bordered table-hover" id="collectionTable">
              <thead>
                <tr>
                  <th className="col-1 text-center border-3">Date</th>
                  <th className="col-5 border-3">Firm Name</th>
                  <th className="col-1 text-center border-3">Place</th>
                  <th className="text-center border-3">Data</th>
                  <th className="text-center border-3">Amount</th>
                  <th className="text-center border-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentItems.map((firm) => {
                  return (
                    <tr  key={firm.id}>
                      <td className="text-center border-3">{firm.date}</td>
                      <td role="button" className="fw-bold border-3" data-bs-toggle="modal" data-bs-target="#updateDetails" onClick={()=> setCurrentDetails(firm)}>{firm.name}</td>
                      <td className="text-center border-3">{firm.place}</td>
                      <td className="border-3 text-center border-3">
                        {firm.data}
                      </td>
                      <td className="text-center border-3">{firm.amount >0 ? firm.amount : "-"}</td>
                     <td className="text-center border-3 d-flex gap-3 justify-content-center">
                      <i className="bi bi-trash3-fill" title="Delete Firm" onClick={()=>deleteFirm(firm)}></i>
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
                Add New Firm
              </button>
            </div>
          )}

          {results?.length > ITEMS_PER_PAGE && (
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
      <div className="modal fade" id="updateDetails" tabIndex="-1" aria-labelledby="updateDetailsLabel" aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered modal-xl">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="updateDetailsLabel">Firm Details</h5>
              <button type="button" className="btn-close" id="newFirmClose"  data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body">
              <div className="mb-3 row">
                <label htmlFor="name" className="col-sm-2 col-form-label">Firm Name</label>
                <div className="col-sm-10">
                  <input type="text" className="form-control" id="name" value={currentDetails?.name} onChange={e=>setCurrentDetails({...currentDetails, name: e.target.value})}/>
                </div>
              </div>
              <div className="mb-3 row">
                <label htmlFor="place" className="col-sm-2 col-form-label">Place</label>
                <div className="col-sm-10">
                  <input type="text" className="form-control" id="place" value={currentDetails?.place} onChange={e=>setCurrentDetails({...currentDetails, place: e.target.value})}/>
                </div>
              </div>
              <div className="mb-3 row">
                <label htmlFor="previous" className="col-sm-2 col-form-label">Data</label>
                <div className="col-sm-10">
                  <input type="number" min="0" placeholder="-" className="form-control" id="previous" value={currentDetails?.data} onChange={e=>setCurrentDetails({...currentDetails, data: e.target.value})}/>
                </div>
              </div>
              <div className="mb-3 row">
                <label htmlFor="current" className="col-sm-2 col-form-label">Amount</label>
                <div className="col-sm-10">
                  <input type="number" min="0" placeholder="-" className="form-control" id="current" value={currentDetails?.amount} onChange={e=>setCurrentDetails({...currentDetails, amount: Number(e.target.value)})}/>
                </div>
              </div>
              <div className="mb-3 row">
                <label htmlFor="payerName" className="col-sm-2 col-form-label">Haste (Payer)</label>
                <div className="col-sm-10">
                  <input type="text" placeholder="-" className="form-control" id="payerName" value={currentDetails?.payer} onChange={e=>setCurrentDetails({...currentDetails, payer: e.target.value})}/>
                </div>
              </div>
              <div className="mb-3 row">
                <label htmlFor="payerNumber" className="col-sm-2 col-form-label">Mobile Number</label>
                <div className="col-sm-10">
                  <input type="text" placeholder="-" className="form-control" id="payerNumber" value={currentDetails?.mobile} onChange={e=>setCurrentDetails({...currentDetails, mobile:  e.target.value})}/>
                </div>
              </div>
              <div className="mb-3 row">
                <label htmlFor="receiver" className="col-sm-2 col-form-label">Haste (Receiver)</label>
                <div className="col-sm-10">
                  <input type="text" placeholder="-" className="form-control" id="receiver" value={currentDetails?.reciever} onChange={e=>setCurrentDetails({...currentDetails, reciever: e.target.value})}/>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
              <button type="button" className="btn btn-primary" onClick={()=>saveUpdatedFirm(currentDetails)}>Save changes</button>
            </div>
          </div>
        </div>
      </div>
      <div className="modal fade" id="addNew" tabIndex="-1" aria-labelledby="addNewLabel" aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered modal-xl">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="addNewLabel">Firm Details</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal" id="newFirmClose" aria-label="Close"></button>
            </div>
            <div className="modal-body">
              <div className="mb-3 row">
                <label htmlFor="firmName" className="col-sm-2 col-form-label">Firm Name</label>
                <div className="col-sm-10">
                  <input type="text" className="form-control" id="firmName" placeholder="Firm Name"  value={newDetails?.firmName} onChange={e=>setNewDetails({...newDetails, firmName: e.target.value})}/>
                </div>
              </div>
              <div className="mb-3 row">
                <label htmlFor="place" className="col-sm-2 col-form-label">Place</label>
                <div className="col-sm-10">
                  <input type="text" className="form-control" id="place" value={newDetails?.place} onChange={e=>setNewDetails({...newDetails, place: e.target.value})}/>
                </div>
              </div>
              <div className="mb-3 row">
                <label htmlFor="inputPassword" className="col-sm-2 col-form-label">Data</label>
                <div className="col-sm-10">
                  <input type="number" min="0" placeholder="-" className="form-control" id="inputPassword" onChange={e=>setNewDetails({...newDetails, data: e.target.value})}/>
                </div>
              </div>
              <div className="mb-3 row">
                <label htmlFor="inputPassword" className="col-sm-2 col-form-label">Amount</label>
                <div className="col-sm-10">
                  <input type="number" min="0" placeholder="-" className="form-control" id="inputPassword" onChange={e=>setNewDetails({...newDetails, amount: Number(e.target.value)})}/>
                </div>
              </div>
              <div className="mb-3 row">
                <label htmlFor="payerName" className="col-sm-2 col-form-label">Haste (Payer)</label>
                <div className="col-sm-10">
                  <input type="text" placeholder="-" className="form-control" id="payerName" value={newDetails?.payer} onChange={e=>setNewDetails({...newDetails, payer: e.target.value})}/>
                </div>
              </div>
              <div className="mb-3 row">
                <label htmlFor="payerNumber" className="col-sm-2 col-form-label">Mobile Number</label>
                <div className="col-sm-10">
                  <input type="text" placeholder="-" className="form-control" id="payerNumber" value={newDetails?.payerMobile} onChange={e=>setNewDetails({...newDetails, mobile:  e.target.value})}/>
                </div>
              </div>
              <div className="mb-3 row">
                <label htmlFor="receiver" className="col-sm-2 col-form-label">Haste (Receiver)</label>
                <div className="col-sm-10">
                  <input type="text" placeholder="-" className="form-control" id="receiver" value={newDetails?.reciever} onChange={e=>setNewDetails({...newDetails, reciever: e.target.value})}/>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
              <button type="button" className="btn btn-primary" onClick={()=>saveNewFirm(newDetails)}>Add Firm</button>
            </div>
          </div>
        </div>
      </div>
      <table className="table table-bordered" id="fullDataTable" style={{display: 'none'}}>
              <thead>
                <tr>
                  <th className="col-1 text-center border-3">Date</th>
                  <th className="col-5 border-3">Firm Name</th>
                  <th className="col-1 text-center border-3">Place</th>
                  <th className="text-center border-3">Data</th>
                  <th className="text-center border-3">Amount</th>
                </tr>
              </thead>
              <tbody>
                {currentItems.map((firm) => {
                  return (
                    <tr key={firm.id}>
                      <td className="text-center border-3">{firm.date}</td>
                      <td className="fw-bold border-3">{firm.name}</td>
                      <td className="text-center border-3">{firm.place}</td>
                      <td className="border-3 text-center border-3">{firm.data}</td>
                      <td className="text-center border-3">{firm.amount >0 ? firm.amount : "-"}</td>
                    </tr>
                  );
                })}
              </tbody>
      </table>
    </div>
  );
}

export default Datar;
