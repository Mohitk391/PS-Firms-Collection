import UmiyaMataji from "./assets/umiya-mataji.png";
import './App.css';
import {data} from "./data/data";
import { useState } from "react";
import debounce from "lodash.debounce";
import Pagination from "./utilities/Pagination/Pagination";
import { useEffect } from "react";
const ITEMS_PER_PAGE = 10;


function App() {
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState(data);
  const [currentPage, setCurrentPage] = useState(1);
  // const [currentDetails, setCurrentDetails] = useState({});
  
  // const handleModalClose = () => {
  //   setCurrentDetails({});
  // };
  
  // useEffect(() => {
  //   const modalElement = document.getElementById('updateDetails');
  //   modalElement.addEventListener('hidden.bs.modal', handleModalClose);
  //   return () => {
  //     modalElement.removeEventListener('hidden.bs.modal', handleModalClose);
  //   };
  // }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [results]);

  const handleChange = (event) => {
    setSearchTerm(event.target.value);
    debouncedSearch(event.target.value);
  };

  const debouncedSearch = debounce((searchTerm) => {
    const filteredResults = data.filter((item) =>
      item.firmName.toLowerCase().includes(searchTerm.toLowerCase().trim())
    );
    setResults(filteredResults);
  }, 500);

  const totalPages = Math.ceil(data.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentItems = results.slice(startIndex, endIndex);

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  return (
    <div className="App d-flex flex-column min-vh-100">
      <nav className="navbar navbar-expand-sm navbar-dark bg-dark">
        <div className="container-fluid">
            <a className="navbar-brand" href="/">
              <img src={UmiyaMataji} alt="logo" width="80px"/>
              Patidar Yuva Mandal
            </a>
            <form className="d-flex">
                <input className="form-control me-2" type="text" placeholder="Search" value={searchTerm} onChange={handleChange}/>
            </form>
            <button className="btn btn-outline-danger">Logout</button>
        </div>
      </nav>
      <main className="container mt-3 flex-fill">
          <h2>Collections</h2>
          {results.length > 0 ? (
            <table className="table table-bordered table-hover">
              <thead>
                <tr>
                  <th className="col-6 border-3">Firm Name</th>
                  <th className="text-center border-3">Prev (2022)</th>
                  <th className="text-center border-3">Curr (2023)</th>
                  <th className="text-center border-3">Siksha Nidhi</th>
                </tr>
              </thead>
              <tbody>
                {currentItems.map((firm) => {
                  return (
                    <tr role="button" data-bs-toggle="modal"
                    data-bs-target="#addNew" >
                      <td className="border-3">{firm.firmName}</td>
                      <td className="border-3 text-center border-3">
                        {firm.previousYearAmount >0 ? firm.previousYearAmount : "-"}
                      </td>
                      <td className="text-center border-3">{firm.currentYearAmount >0 ? firm.currentYearAmount : "-"}</td>
                      <td className="text-center border-3">{firm.sikshaNidhiAmount >0 ? firm.sikshaNidhiAmount : "-"}</td>
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
              >
                Add New Firm
              </button>
            </div>
          )}

          {results.length > ITEMS_PER_PAGE && (
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
            <a href="/#" className="d-flex align-items-center p-0 text-dark gap-0">
              <img alt="logo" src={UmiyaMataji} width="150px"/>
              <span className="h5 mb-0 font-weight-bold">Patidar Yuva Mandal</span>
            </a> 
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
      <div className="modal fade" id="updateDetails" tabindex="-1" aria-labelledby="updateDetailsLabel" aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered modal-xl">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="updateDetailsLabel">Firm Details</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body">
              <div className="mb-3 row">
                <label for="firmName" className="col-sm-2 col-form-label">Firm Name</label>
                <div className="col-sm-10">
                  <input type="text" className="form-control" id="firmName" />
                </div>
              </div>
              <div className="mb-3 row">
                <label for="inputPassword" className="col-sm-2 col-form-label">Previous (2022)</label>
                <div className="col-sm-10">
                  <input type="number" min="0" placeholder="-" className="form-control" id="inputPassword" />
                </div>
              </div>
              <div className="mb-3 row">
                <label for="inputPassword" className="col-sm-2 col-form-label">Current (2023)</label>
                <div className="col-sm-10">
                  <input type="number" min="0" placeholder="-" className="form-control" id="inputPassword" />
                </div>
              </div>
              <div className="mb-3 row">
                <label for="inputPassword" className="col-sm-2 col-form-label">Siksha Nidhi</label>
                <div className="col-sm-10">
                  <input type="number" min="0" placeholder="-" className="form-control" id="inputPassword" />
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
              <button type="button" className="btn btn-primary">Save changes</button>
            </div>
          </div>
        </div>
      </div>
      <div className="modal fade" id="addNew" tabindex="-1" aria-labelledby="addNewLabel" aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered modal-xl">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="addNewLabel">Firm Details</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body">
              <div className="mb-3 row">
                <label for="firmName" className="col-sm-2 col-form-label">Firm Name</label>
                <div className="col-sm-10">
                  <input type="text" className="form-control" id="firmName" placeholder="Firm Name"  value={searchTerm}/>
                </div>
              </div>
              <div className="mb-3 row">
                <label for="inputPassword" className="col-sm-2 col-form-label">Previous (2022)</label>
                <div className="col-sm-10">
                  <input type="number" min="0" placeholder="-" className="form-control" id="inputPassword" />
                </div>
              </div>
              <div className="mb-3 row">
                <label for="inputPassword" className="col-sm-2 col-form-label">Current (2023)</label>
                <div className="col-sm-10">
                  <input type="number" min="0" placeholder="-" className="form-control" id="inputPassword" />
                </div>
              </div>
              <div className="mb-3 row">
                <label for="inputPassword" className="col-sm-2 col-form-label">Siksha Nidhi</label>
                <div className="col-sm-10">
                  <input type="number" min="0" placeholder="-" className="form-control" id="inputPassword" />
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
              <button type="button" className="btn btn-primary">Add Firm</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
