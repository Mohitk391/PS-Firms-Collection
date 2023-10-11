import UmiyaMataji from "../../../assets/umiya-mataji.png";
import { useState } from "react";
import Pagination from "../../../utilities/Pagination/Pagination";
import { useEffect } from "react";
import jsPDF from "jspdf";
import autoTable from 'jspdf-autotable';
import Navbar from "../../../components/Navbar/Navbar";
import { useData } from "../../../contexts/DataContext";
import { Link } from "react-router-dom";
import { Loader } from "../../../utilities/Loader/Loader"
import { Timestamp, doc, setDoc, updateDoc } from "firebase/firestore";
import { db } from "../../../firebase-config";

const ITEMS_PER_PAGE = 10;

const AllFirms = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [currentDetails, setCurrentDetails] = useState({});
  const [newDetails, setNewDetails] = useState({name: "", place: "", phaadPrevious: 0, phaadCurrent: 0, phaadPayer: "", phaadMobile: "", phaadReciever: "", sikshanidhiPrevious: 0, sikshanidhiCurrent: 0, sikshanidhiPayer: "", sikshanidhiMobile: "", sikshanidhiReciever: ""});
  const {dataState : {allFirms}} = useData();  

  useEffect(()=> {
    if(allFirms) 
    {setLoading(false); 
       } 
    else
    setLoading(true)}
    // eslint-disable-next-line react-hooks/exhaustive-deps
    ,[]);

    useEffect(()=>{
      setResults(allFirms.filter((item)=>item.name.toLowerCase().includes(searchTerm.toLocaleLowerCase().trim())))
    },[searchTerm, allFirms]);
  
  const handleModalClose = () => {
    setCurrentDetails({}); 
  };

// While saving any new firm with either of only phaad, only sikshanidhi or both, add today's date as the respective collection's date . For example for only phaad add today's date as phaadDate.
// For only phaad or only sikshanidhi, make sure to add blank values for the other collection. For example,  for only phaad, add all sikshanidhi values as blank(apprpriately) and vice-versa.

  const saveNewFirm = async () => {
    console.log(newDetails);
    console.log(searchTerm);
    await setDoc(doc(db, "allFirms", newDetails.name), {
      name: newDetails.name,
      place: newDetails.place,
      phaadPrevious : newDetails.phaadPrevious,
      phaadCurrent : newDetails.phaadCurrent,
      phaadPayer : newDetails.phaadPayer,
      phaadMobile : newDetails.phaadMobile,
      phaadReciever : newDetails.phaadReciever,
      sikshanidhiPrevious : newDetails.sikshanidhiPrevious,
      sikshanidhiCurrent : newDetails.sikshanidhiCurrent,
      sikshanidhiPayer : newDetails.sikshanidhiPayer,
      sikshanidhiMobile : newDetails.sikshanidhiMobile,
      sikshanidhiReciever : newDetails.sikshanidhiReciever
    })

    await setDoc(doc(db, "phaad", newDetails.name), {
      name: newDetails.name,
      place: newDetails.place,
      previous : newDetails.phaadPrevious,
      current : newDetails.phaadCurrent,
      payer : newDetails.phaadPayer,
      mobile : newDetails.phaadMobile,
      reciever : newDetails.phaadReciever,
      date : Timestamp.fromDate(new Date())
    })

    await setDoc(doc(db, "sikshanidhi", newDetails.name), {
      name: newDetails.name,
      place: newDetails.place,
      previous : newDetails.sikshanidhiPrevious,
      current : newDetails.sikshanidhiCurrent,
      payer : newDetails.sikshanidhiPayer,
      mobile : newDetails.sikshanidhiMobile,
      reciever : newDetails.sikshanidhiReciever,
      date: Timestamp.fromDate(new Date())
    })

  }

  const saveNewFirmPhaad = async () => {
    await setDoc(doc(db, "allFirms", newDetails.name), {
      name: newDetails.name,
      place: newDetails.place,
      phaadPrevious : newDetails.phaadPrevious,
      phaadCurrent : newDetails.phaadCurrent,
      phaadPayer : newDetails.phaadPayer,
      phaadMobile : newDetails.phaadMobile,
      phaadReciever : newDetails.phaadReciever,
      sikshanidhiPrevious : 0,
      sikshanidhiCurrent : 0,
      sikshanidhiPayer : "",
      sikshanidhiMobile : "",
      sikshanidhiReciever : ""
    })

    await setDoc(doc(db, "phaad", newDetails.name), {
      name: newDetails.name,
      place: newDetails.place,
      previous : newDetails.phaadPrevious,
      current : newDetails.phaadCurrent,
      payer : newDetails.phaadPayer,
      mobile : newDetails.phaadMobile,
      reciever : newDetails.phaadReciever,
      date : Timestamp.fromDate(new Date())
    })
  }

  const saveNewFirmSikshanidhi = async () => {
    await setDoc(doc(db, "allFirms", newDetails.name), {
      name: newDetails.name,
      place: newDetails.place,
      phaadPrevious : 0,
      phaadCurrent : 0,
      phaadPayer : "",
      phaadMobile : "",
      phaadReciever : "",
      sikshanidhiPrevious : newDetails.sikshanidhiPrevious,
      sikshanidhiCurrent : newDetails.sikshanidhiCurrent,
      sikshanidhiPayer : newDetails.sikshanidhiPayer,
      sikshanidhiMobile : newDetails.sikshanidhiMobile,
      sikshanidhiReciever : newDetails.sikshanidhiReciever
    });

    await setDoc(doc(db, "sikshanidhi", newDetails.name), {
      name: newDetails.name,
      place: newDetails.place,
      previous : newDetails.sikshanidhiPrevious,
      current : newDetails.sikshanidhiCurrent,
      payer : newDetails.sikshanidhiPayer,
      mobile : newDetails.sikshanidhiMobile,
      reciever : newDetails.sikshanidhiReciever,
      date : Timestamp.fromDate(new Date())
    });
  }

  const saveUpdatedFirm = async () => {
    let updatingAllBody = {};
    let updatingPhaadBody = {};
    let updatingSikshanidhiBody = {};
    if(currentDetails.sikshanidhiPrevious > 0){ 
      updatingAllBody = {...updatingAllBody, sikshanidhiPrevious: currentDetails.sikshanidhiPrevious}
      updatingSikshanidhiBody = {...updatingSikshanidhiBody, previous: currentDetails.sikshanidhiPrevious}
    }
    if(currentDetails.sikshanidhiCurrent > 0){
      updatingSikshanidhiBody = {...updatingSikshanidhiBody, current: currentDetails.sikshanidhiCurrent}
       updatingAllBody = {...updatingAllBody, sikshanidhiCurrent: currentDetails.sikshanidhiCurrent}
    }
    if(currentDetails.sikshanidhiPayer){
      updatingSikshanidhiBody = {...updatingSikshanidhiBody, payer: currentDetails.sikshanidhiPayer}
      updatingAllBody = {...updatingAllBody, sikshanidhiPayer: currentDetails.sikshanidhiPayer}
    }
    if(currentDetails.sikshanidhiMobile){
      updatingSikshanidhiBody = {...updatingSikshanidhiBody, mobile: currentDetails.sikshanidhiMobile}
       updatingAllBody = {...updatingAllBody, sikshanidhiMobile: currentDetails.sikshanidhiMobile}
    }
    if(currentDetails.sikshanidhiReciever){
      updatingSikshanidhiBody = {...updatingSikshanidhiBody, reciever: currentDetails.sikshanidhiReciever}
       updatingAllBody = {...updatingAllBody, sikshanidhiReciever: currentDetails.sikshanidhiReciever}
    }
    if(currentDetails.phaadPrevious > 0){ 
      updatingAllBody = {...updatingAllBody, phaadPrevious: currentDetails.phaadPrevious}
      updatingPhaadBody = {...updatingPhaadBody, previous: currentDetails.phaadPrevious}
    }
    if(currentDetails.phaadCurrent > 0){
       updatingAllBody = {...updatingAllBody, phaadCurrent: currentDetails.phaadCurrent}
       updatingPhaadBody = {...updatingPhaadBody, current: currentDetails.phaadCurrent}
    }
    if(currentDetails.phaadPayer){
       updatingAllBody = {...updatingAllBody, phaadPayer: currentDetails.phaadPayer}
       updatingPhaadBody = {...updatingPhaadBody, payer: currentDetails.phaadPayer}
    }
    if(currentDetails.phaadMobile ){
       updatingAllBody = {...updatingAllBody, phaadMobile: currentDetails.phaadMobile}
       updatingPhaadBody = {...updatingPhaadBody, mobile: currentDetails.phaadMobile}
    }
    if(currentDetails.phaadReciever){
       updatingAllBody = {...updatingAllBody, phaadReciever: currentDetails.phaadReciever}
       updatingPhaadBody = {...updatingPhaadBody, reciever: currentDetails.phaadReciever}
    }

    await updateDoc(doc(db,"allFirms", currentDetails.name), updatingAllBody);
    if(updatingPhaadBody)
      await updateDoc(doc(db,"phaad", currentDetails.name), updatingPhaadBody);
    if(updatingSikshanidhiBody)
      await updateDoc(doc(db, "sikshanidhi", currentDetails.name), updatingSikshanidhiBody);

  }

  const deleteFirm = (firmDetails) => {

  }
  
  useEffect(() => {
    const modalElement = document.getElementById('updateDetails');
    const newFirmModalElement = document.getElementById('addNew');
    const newFirmIndexModalElement = document.getElementById('addNewIndex');
    const newFirmPhaadModalElement = document.getElementById('addNewPhaad');
    const newFirmSikshanidhiModalElement = document.getElementById('addNewSikshanidhi');
    modalElement.addEventListener('hidden.bs.modal', handleModalClose);
    newFirmModalElement.addEventListener('hidden.bs.modal', handleModalClose);
    newFirmIndexModalElement.addEventListener('hidden.bs.modal', handleModalClose);
    newFirmPhaadModalElement.addEventListener('hidden.bs.modal', handleModalClose);
    newFirmSikshanidhiModalElement.addEventListener('hidden.bs.modal', handleModalClose);
    return () => {
      modalElement.removeEventListener('hidden.bs.modal', handleModalClose);
      newFirmModalElement.removeEventListener('hidden.bs.modal', handleModalClose);
      newFirmIndexModalElement.removeEventListener('hidden.bs.modal', handleModalClose);
      newFirmPhaadModalElement.removeEventListener('hidden.bs.modal', handleModalClose);
      newFirmSikshanidhiModalElement.removeEventListener('hidden.bs.modal', handleModalClose);
    };
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [results]);

 

  const totalPages = Math.ceil(results.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentItems = results.slice(startIndex, endIndex);

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

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
          <div className="d-flex justify-content-between mb-2">
            <div className="header">
              <span className="h2">All Firms</span>
            </div>
            <input className="py-0 px-3 border rounded-4 border-opacity-50" type="text" placeholder="Search" value={searchTerm} onChange={event=>setSearchTerm(event.target.value)} />
           { allFirms.length > 0 ? <button onClick={downloadTable} className="btn btn-outline-dark" title="Download Records PDF"><i className="bi bi-file-earmark-arrow-down-fill"></i></button> : <button className="invisible pe-none"></button>}
          </div>
          { loading ? <Loader loading={loading} /> :
          results.length > 0 ? (
            <table className="table table-bordered table-hover" id="collectionTable">
              <thead>
                <tr>
                  <th className="col-3 text-center border-3 align-middle" rowSpan={2}>Firm Name</th>
                  <th className="col-2 text-center border-3 align-middle" rowSpan={2}>Place</th>
                  <th className="col-3 text-center border-3" colSpan={2}>Phaad</th>
                  <th className="col-3 text-center border-3" colSpan={2}>Sikshanidhi</th>
                  <th className="col-2 text-center border-3 align-middle" rowSpan={2}>Actions</th>
                </tr>
                <tr>
                  <th className="text-center border-3">Prev (2022)</th>
                  <th className="text-center border-3">Curr (2023)</th>
                  <th className="text-center border-3">Prev (2022)</th>
                  <th className="text-center border-3">Curr (2023)</th>
                </tr>
              </thead>
              <tbody>
                {currentItems.map((firm) => {
                  return (
                    <tr  key={firm.id}>
                      <td role="button" className="fw-bold border-3" data-bs-toggle="modal" data-bs-target="#updateDetails" onClick={()=> setCurrentDetails(firm)}>{firm.name}</td>
                      <td className="text-center border-3">{firm.place}</td>
                      <td className="border-3 text-center border-3">
                        {firm.phaadPrevious >0 ? firm.phaadPrevious : "-"}
                      </td>
                      <td className="text-center border-3">{firm.phaadCurrent >0 ? firm.phaadCurrent : "-"}</td>
                      <td className="border-3 text-center border-3">
                        {firm.sikshanidhiPrevious >0 ? firm.sikshanidhiPrevious : "-"}
                      </td>
                      <td className="text-center border-3">{firm.sikshanidhiCurrent >0 ? firm.sikshanidhiCurrent : "-"}</td>
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
                data-bs-target="#addNewIndex"
                onClick={()=>setNewDetails({...newDetails, name: searchTerm})}
              >
                Add New Firm
              </button>
            </div>
          )}

          {allFirms.length > ITEMS_PER_PAGE && (
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
                <div className="row">
                    <div className="table col-sm border border-2 me-2 pt-2 caption-top">
                        <caption><u><b>Phaad</b></u></caption>
                        <div className="mb-3 row">
                            <label htmlFor="phaadPrevious" className="col-sm-4 col-form-label">Previous (2022)</label>
                            <div className="col-sm-8">
                            <input type="number" min="0" placeholder="-" className="form-control" id="phaadPrevious" value={currentDetails?.phaadPrevious} onChange={e=>setCurrentDetails({...currentDetails, phaadPrevious: Number(e.target.value)})}/>
                            </div>
                        </div>
                        <div className="mb-3 row">
                            <label htmlFor="phaadCurrent" className="col-sm-4 col-form-label">Current (2023)</label>
                            <div className="col-sm-8">
                            <input type="number" min="0" placeholder="-" className="form-control" id="phaadCurrent" value={currentDetails?.phaadCurrent} onChange={e=>setCurrentDetails({...currentDetails, phaadCurrent: Number(e.target.value)})}/>
                            </div>
                        </div>
                        <div className="mb-3 row">
                            <label htmlFor="phaadPayerName" className="col-sm-4 col-form-label">Haste (Payer)</label>
                            <div className="col-sm-8">
                            <input type="text" placeholder="-" className="form-control" id="phaadPayerName" value={currentDetails?.phaadPayer} onChange={e=>setCurrentDetails({...currentDetails, phaadPayer: e.target.value})}/>
                            </div>
                        </div>
                        <div className="mb-3 row">
                            <label htmlFor="phaadPayerNumber" className="col-sm-4 col-form-label">Mobile Number</label>
                            <div className="col-sm-8">
                            <input type="text" placeholder="-" className="form-control" id="phaadPayerNumber" value={currentDetails?.phaadMobile} onChange={e=>setCurrentDetails({...currentDetails, phaadMobile:  e.target.value})}/>
                            </div>
                        </div>
                        <div className="mb-3 row">
                            <label htmlFor="phaadReceiver" className="col-sm-4 col-form-label">Haste (Receiver)</label>
                            <div className="col-sm-8">
                            <input type="text" placeholder="-" className="form-control" id="phaadReceiver" value={currentDetails?.phaadReciever} onChange={e=>setCurrentDetails({...currentDetails, phaadReciever: e.target.value})}/>
                            </div>
                        </div>
                    </div>
                    <div className="table col-sm border border-2 ms-2 pt-2 caption-top">
                        <caption><u><b>Sikshanidhi</b></u></caption>
                        <div className="mb-3 row">
                            <label htmlFor="sikshanidhiPrevious" className="col-sm-4 col-form-label">Previous (2022)</label>
                            <div className="col-sm-8">
                            <input type="number" min="0" placeholder="-" className="form-control" id="sikshanidhiPrevious" value={currentDetails?.sikshanidhiPrevious} onChange={e=>setCurrentDetails({...currentDetails, sikshanidhiPrevious: Number(e.target.value)})}/>
                            </div>
                        </div>
                        <div className="mb-3 row">
                            <label htmlFor="sikshanidhiCurrent" className="col-sm-4 col-form-label">Current (2023)</label>
                            <div className="col-sm-8">
                            <input type="number" min="0" placeholder="-" className="form-control" id="sikshanidhiCurrent" value={currentDetails?.sikshanidhiCurrent} onChange={e=>setCurrentDetails({...currentDetails, sikshanidhiCurrent: Number(e.target.value)})}/>
                            </div>
                        </div>
                        <div className="mb-3 row">
                            <label htmlFor="sikshanidhiPayerName" className="col-sm-4 col-form-label">Haste (Payer)</label>
                            <div className="col-sm-8">
                            <input type="text" placeholder="-" className="form-control" id="sikshanidhiPayerName" value={currentDetails?.sikshanidhiPayer} onChange={e=>setCurrentDetails({...currentDetails, sikshanidhiPayer: e.target.value})}/>
                            </div>
                        </div>
                        <div className="mb-3 row">
                            <label htmlFor="sikshanidhiPayerNumber" className="col-sm-4 col-form-label">Mobile Number</label>
                            <div className="col-sm-8">
                            <input type="text" placeholder="-" className="form-control" id="sikshanidhiPayerNumber" value={currentDetails?.sikshanidhiMobile} onChange={e=>setCurrentDetails({...currentDetails, sikshanidhiMobile:  e.target.value})}/>
                            </div>
                        </div>
                        <div className="mb-3 row">
                            <label htmlFor="sikshanidhiReceiver" className="col-sm-4 col-form-label">Haste (Receiver)</label>
                            <div className="col-sm-8">
                            <input type="text" placeholder="-" className="form-control" id="sikshanidhiReceiver" value={currentDetails?.sikshanidhiReciever} onChange={e=>setCurrentDetails({...currentDetails, sikshanidhiReciever: e.target.value})}/>
                            </div>
                        </div>
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
      <div className="modal fade" id="addNewIndex" tabIndex="-1" aria-labelledby="addNewIndexLabel" aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered modal-xl">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="addNewIndexLabel">Firm Details</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal" id="newFirmClose" aria-label="Close"></button>
            </div>
            <div className="modal-body">
                <div className="mb-3 row">
                    <label htmlFor="name" className="col-sm-2 col-form-label">Firm Name</label>
                    <div className="col-sm-10">
                    <input type="text" className="form-control" id="name" value={newDetails?.name} onChange={e=>setNewDetails({...newDetails, name: e.target.value})}/>
                    </div>
                </div>
                <div className="mb-3 row">
                    <label htmlFor="place" className="col-sm-2 col-form-label">Place</label>
                    <div className="col-sm-10">
                    <input type="text" className="form-control" id="place" value={newDetails?.place} onChange={e=>setNewDetails({...newDetails, place: e.target.value})}/>
                    </div>
                </div>
                <div className="mb-3 row form-check">
                    <div className="form-check form-check-inline">
                        <input type="radio"  name="Selector" className="form-check-input" id="phaadSelector" value="Phaad" data-bs-target="#addNewPhaad" data-bs-toggle="modal"/>
                        <label htmlFor="phaadSelector" className="form-check-label">Phaad</label>
                    </div>
                    <div className="form-check form-check-inline">
                        <input type="radio"  name="Selector" className="form-check-input" id="sikshanidhiSelector" value="Sikshanidhi" data-bs-target="#addNewSikshanidhi" data-bs-toggle="modal"/>
                        <label htmlFor="sikshanidhiSelector" className="form-check-label">Sikshanidhi</label>
                    </div>
                    <div className="form-check form-check-inline">
                        <input type="radio" name="Selector" className="form-check-input" id="bothSelector" value="Both" data-bs-target="#addNew" data-bs-toggle="modal"/>
                        <label htmlFor="bothSelector" className="form-check-label">Both</label>
                    </div>
                </div>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
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
                    <label htmlFor="name" className="col-sm-2 col-form-label">Firm Name</label>
                    <div className="col-sm-10">
                    <input type="text" className="form-control" id="name" value={newDetails?.name} onChange={e=>setNewDetails({...newDetails, name: e.target.value})}/>
                    </div>
                </div>
                <div className="mb-3 row">
                    <label htmlFor="place" className="col-sm-2 col-form-label">Place</label>
                    <div className="col-sm-10">
                    <input type="text" className="form-control" id="place" value={newDetails?.place} onChange={e=>setNewDetails({...newDetails, place: e.target.value})}/>
                    </div>
                </div>
                <div className="row">
                    <div className="table col-sm border border-2 me-2 pt-2 caption-top">
                        <caption><u><b>Phaad</b></u></caption>
                        <div className="mb-3 row">
                            <label htmlFor="phaadPrevious" className="col-sm-4 col-form-label">Previous (2022)</label>
                            <div className="col-sm-8">
                            <input type="number" min="0" placeholder="-" className="form-control" id="phaadPrevious" value={newDetails?.phaadPrevious} onChange={e=>setNewDetails({...newDetails, phaadPrevious: Number(e.target.value)})}/>
                            </div>
                        </div>
                        <div className="mb-3 row">
                            <label htmlFor="phaadCurrent" className="col-sm-4 col-form-label">Current (2023)</label>
                            <div className="col-sm-8">
                            <input type="number" min="0" placeholder="-" className="form-control" id="phaadCurrent" value={newDetails?.phaadCurrent} onChange={e=>setNewDetails({...newDetails, phaadCurrent: Number(e.target.value)})}/>
                            </div>
                        </div>
                        <div className="mb-3 row">
                            <label htmlFor="phaadPayerName" className="col-sm-4 col-form-label">Haste (Payer)</label>
                            <div className="col-sm-8">
                            <input type="text" placeholder="-" className="form-control" id="phaadPayerName" value={newDetails?.phaadPayer} onChange={e=>setNewDetails({...newDetails, phaadPayer: e.target.value})}/>
                            </div>
                        </div>
                        <div className="mb-3 row">
                            <label htmlFor="phaadPayerNumber" className="col-sm-4 col-form-label">Mobile Number</label>
                            <div className="col-sm-8">
                            <input type="text" placeholder="-" className="form-control" id="phaadPayerNumber" value={newDetails?.phaadMobile} onChange={e=>setNewDetails({...newDetails, phaadMobile:  e.target.value})}/>
                            </div>
                        </div>
                        <div className="mb-3 row">
                            <label htmlFor="phaadReceiver" className="col-sm-4 col-form-label">Haste (Receiver)</label>
                            <div className="col-sm-8">
                            <input type="text" placeholder="-" className="form-control" id="phaadReceiver" value={newDetails?.phaadReciever} onChange={e=>setNewDetails({...newDetails, phaadReciever: e.target.value})}/>
                            </div>
                        </div>
                    </div>
                    <div className="table col-sm border border-2 ms-2 pt-2 caption-top">
                        <caption><u><b>Sikshanidhi</b></u></caption>
                        <div className="mb-3 row">
                            <label htmlFor="sikshanidhiPrevious" className="col-sm-4 col-form-label">Previous (2022)</label>
                            <div className="col-sm-8">
                            <input type="number" min="0" placeholder="-" className="form-control" id="sikshanidhiPrevious" value={newDetails?.sikshanidhiPrevious} onChange={e=>setNewDetails({...newDetails, sikshanidhiPrevious: Number(e.target.value)})}/>
                            </div>
                        </div>
                        <div className="mb-3 row">
                            <label htmlFor="sikshanidhiCurrent" className="col-sm-4 col-form-label">Current (2023)</label>
                            <div className="col-sm-8">
                            <input type="number" min="0" placeholder="-" className="form-control" id="sikshanidhiCurrent" value={newDetails?.sikshanidhiCurrent} onChange={e=>setNewDetails({...newDetails, sikshanidhiCurrent: Number(e.target.value)})}/>
                            </div>
                        </div>
                        <div className="mb-3 row">
                            <label htmlFor="sikshanidhiPayerName" className="col-sm-4 col-form-label">Haste (Payer)</label>
                            <div className="col-sm-8">
                            <input type="text" placeholder="-" className="form-control" id="sikshanidhiPayerName" value={newDetails?.sikshanidhiPayer} onChange={e=>setNewDetails({...newDetails, sikshanidhiPayer: e.target.value})}/>
                            </div>
                        </div>
                        <div className="mb-3 row">
                            <label htmlFor="sikshanidhiPayerNumber" className="col-sm-4 col-form-label">Mobile Number</label>
                            <div className="col-sm-8">
                            <input type="text" placeholder="-" className="form-control" id="sikshanidhiPayerNumber" value={newDetails?.sikshanidhiMobile} onChange={e=>setNewDetails({...newDetails, sikshanidhiMobile:  e.target.value})}/>
                            </div>
                        </div>
                        <div className="mb-3 row">
                            <label htmlFor="sikshanidhiReceiver" className="col-sm-4 col-form-label">Haste (Receiver)</label>
                            <div className="col-sm-8">
                            <input type="text" placeholder="-" className="form-control" id="sikshanidhiReceiver" value={newDetails?.sikshanidhiReciever} onChange={e=>setNewDetails({...newDetails, sikshanidhiReciever: e.target.value})}/>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
              <button type="button" className="btn btn-primary" onClick={()=>saveNewFirm()}>Add Firm</button>
            </div>
          </div>
        </div>
      </div>
      <div className="modal fade" id="addNewPhaad" tabIndex="-1" aria-labelledby="addNewPhaadLabel" aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered modal-xl">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="addNewPhaadLabel">Firm Details</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal" id="newFirmClose" aria-label="Close"></button>
            </div>
            <div className="modal-body">
                <div className="mb-3 row">
                    <label htmlFor="name" className="col-sm-2 col-form-label">Firm Name</label>
                    <div className="col-sm-10">
                    <input type="text" className="form-control" id="name" value={newDetails?.name} onChange={e=>setNewDetails({...newDetails, name: e.target.value})}/>
                    </div>
                </div>
                <div className="mb-3 row">
                    <label htmlFor="place" className="col-sm-2 col-form-label">Place</label>
                    <div className="col-sm-10">
                    <input type="text" className="form-control" id="place" value={newDetails?.place} onChange={e=>setNewDetails({...newDetails, place: e.target.value})}/>
                    </div>
                </div>
                <div className="mb-3 row">
                    <label htmlFor="phaadPrevious" className="col-sm-2 col-form-label">Previous (2022)</label>
                    <div className="col-sm-10">
                    <input type="number" min="0" placeholder="-" className="form-control" id="phaadPrevious" value={newDetails?.phaadPrevious} onChange={e=>setNewDetails({...newDetails, phaadPrevious: Number(e.target.value)})}/>
                    </div>
                </div>
                <div className="mb-3 row">
                    <label htmlFor="phaadCurrent" className="col-sm-2 col-form-label">Current (2023)</label>
                    <div className="col-sm-10">
                    <input type="number" min="0" placeholder="-" className="form-control" id="phaadCurrent" value={newDetails?.phaadCurrent} onChange={e=>setNewDetails({...newDetails, phaadCurrent: Number(e.target.value)})}/>
                    </div>
                </div>
                <div className="mb-3 row">
                    <label htmlFor="phaadPayerName" className="col-sm-2 col-form-label">Haste (Payer)</label>
                    <div className="col-sm-10">
                    <input type="text" placeholder="-" className="form-control" id="phaadPayerName" value={newDetails?.phaadPayer} onChange={e=>setNewDetails({...newDetails, phaadPayer: e.target.value})}/>
                    </div>
                </div>
                <div className="mb-3 row">
                    <label htmlFor="phaadPayerNumber" className="col-sm-2 col-form-label">Mobile Number</label>
                    <div className="col-sm-10">
                    <input type="text" placeholder="-" className="form-control" id="phaadPayerNumber" value={newDetails?.phaadMobile} onChange={e=>setNewDetails({...newDetails, phaadMobile:  e.target.value})}/>
                    </div>
                </div>
                <div className="mb-3 row">
                    <label htmlFor="phaadReceiver" className="col-sm-2 col-form-label">Haste (Receiver)</label>
                    <div className="col-sm-10">
                    <input type="text" placeholder="-" className="form-control" id="phaadReceiver" value={newDetails?.phaadReciever} onChange={e=>setNewDetails({...newDetails, phaadReciever: e.target.value})}/>
                    </div>
                </div>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
              <button type="button" className="btn btn-primary" onClick={()=>saveNewFirmPhaad(newDetails)}>Add Firm</button>
            </div>
          </div>
        </div>
      </div>
      <div className="modal fade" id="addNewSikshanidhi" tabIndex="-1" aria-labelledby="addNewSikshanidhiLabel" aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered modal-xl">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="addNewSikshanidhiLabel">Firm Details</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal" id="newFirmClose" aria-label="Close"></button>
            </div>
            <div className="modal-body">
                <div className="mb-3 row">
                    <label htmlFor="name" className="col-sm-2 col-form-label">Firm Name</label>
                    <div className="col-sm-10">
                    <input type="text" className="form-control" id="name" value={newDetails?.name} onChange={e=>setNewDetails({...newDetails, name: e.target.value})}/>
                    </div>
                </div>
                <div className="mb-3 row">
                    <label htmlFor="place" className="col-sm-2 col-form-label">Place</label>
                    <div className="col-sm-10">
                    <input type="text" className="form-control" id="place" value={newDetails?.place} onChange={e=>setNewDetails({...newDetails, place: e.target.value})}/>
                    </div>
                </div>
                <div className="mb-3 row">
                    <label htmlFor="sikshanidhiPrevious" className="col-sm-2 col-form-label">Previous (2022)</label>
                    <div className="col-sm-10">
                    <input type="number" min="0" placeholder="-" className="form-control" id="sikshanidhiPrevious" value={newDetails?.sikshanidhiPrevious} onChange={e=>setNewDetails({...newDetails, sikshanidhiPrevious: Number(e.target.value)})}/>
                    </div>
                </div>
                <div className="mb-3 row">
                    <label htmlFor="sikshanidhiCurrent" className="col-sm-2 col-form-label">Current (2023)</label>
                    <div className="col-sm-10">
                    <input type="number" min="0" placeholder="-" className="form-control" id="sikshanidhiCurrent" value={newDetails?.sikshanidhiCurrent} onChange={e=>setNewDetails({...newDetails, sikshanidhiCurrent: Number(e.target.value)})}/>
                    </div>
                </div>
                <div className="mb-3 row">
                    <label htmlFor="sikshanidhiPayerName" className="col-sm-2 col-form-label">Haste (Payer)</label>
                    <div className="col-sm-10">
                    <input type="text" placeholder="-" className="form-control" id="sikshanidhiPayerName" value={newDetails?.sikshanidhiPayer} onChange={e=>setNewDetails({...newDetails, sikshanidhiPayer: e.target.value})}/>
                    </div>
                </div>
                <div className="mb-3 row">
                    <label htmlFor="sikshanidhiPayerNumber" className="col-sm-2 col-form-label">Mobile Number</label>
                    <div className="col-sm-10">
                    <input type="text" placeholder="-" className="form-control" id="sikshanidhiPayerNumber" value={newDetails?.sikshanidhiMobile} onChange={e=>setNewDetails({...newDetails, sikshanidhiMobile:  e.target.value})}/>
                    </div>
                </div>
                <div className="mb-3 row">
                    <label htmlFor="sikshanidhiReceiver" className="col-sm-2 col-form-label">Haste (Receiver)</label>
                    <div className="col-sm-10">
                    <input type="text" placeholder="-" className="form-control" id="sikshanidhiReceiver" value={newDetails?.sikshanidhiReciever} onChange={e=>setNewDetails({...newDetails, sikshanidhiReciever: e.target.value})}/>
                    </div>
                </div>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
              <button type="button" className="btn btn-primary" onClick={()=>saveNewFirmSikshanidhi(newDetails)}>Add Firm</button>
            </div>
          </div>
        </div>
      </div>
      <table className="table table-bordered" id="fullDataTable" style={{display: 'none'}}>
              <thead>
                <tr>
                  <th className="col-3 text-center border-3 align-middle" rowSpan={2}>Firm Name</th>
                  <th className="col-2 text-center border-3 align-middle" rowSpan={2}>Place</th>
                  <th className="col-3 text-center border-3" colSpan={2}>Phaad</th>
                  <th className="col-3 text-center border-3" colSpan={2}>Sikshanidhi</th>
                  <th className="col-2 text-center border-3 align-middle" rowSpan={2}>Actions</th>
                </tr>
                <tr>
                  <th className="text-center border-3">Prev (2022)</th>
                  <th className="text-center border-3">Curr (2023)</th>
                  <th className="text-center border-3">Prev (2022)</th>
                  <th className="text-center border-3">Curr (2023)</th>
                </tr>
              </thead>
              <tbody>
                {currentItems.map((firm) => {
                  return (
                    <tr  key={firm.id}>
                      <td role="button" className="fw-bold border-3" data-bs-toggle="modal" data-bs-target="#updateDetails" onClick={()=> setCurrentDetails(firm)}>{firm.name}</td>
                      <td className="text-center border-3">{firm.place}</td>
                      <td className="border-3 text-center border-3">
                        {firm.phaadPrevious >0 ? firm.phaadPrevious : "-"}
                      </td>
                      <td className="text-center border-3">{firm.phaadCurrent >0 ? firm.phaadCurrent : "-"}</td>
                      <td className="border-3 text-center border-3">
                        {firm.sikshanidhiPrevious >0 ? firm.sikshanidhiPrevious : "-"}
                      </td>
                      <td className="text-center border-3">{firm.sikshanidhiCurrent >0 ? firm.sikshanidhiCurrent : "-"}</td>
                     <td className="text-center border-3 d-flex gap-3 justify-content-center">
                      <i className="bi bi-trash3-fill" title="Delete Firm" onClick={()=>deleteFirm(firm)}></i>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
    </div>
  );
}

export default AllFirms;
