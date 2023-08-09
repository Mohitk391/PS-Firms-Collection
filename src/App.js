import UmiyaMataji from "./assets/umiya-mataji.png";
import './App.css';
import {data} from "./data/data";

function App() {
  return (
    <div className="App">
      <nav className="navbar navbar-expand-sm navbar-dark bg-dark">
        <div className="container-fluid">
            <a className="navbar-brand" href="/">
              <img src={UmiyaMataji} alt="logo" width="80px"/>
              Patidar Yuva Mandal
            </a>
            <form className="d-flex">
                <input className="form-control me-2" type="text" placeholder="Search" />
                <button className="btn btn-primary" type="button">Search</button>
            </form>
            <button className="btn btn-danger">Logout</button>
        </div>
      </nav>
      <main className="container mt-3">
          <h2>Collections</h2>
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
                <tr role="button" data-bs-toggle="modal" data-bs-target="#exampleModal">
                  <td className="border-3">ABC</td>
                  <td className="border-3 text-center border-3">1500</td>
                  <td className="text-center border-3">-</td>
                  <td className="text-center border-3">-</td>
                </tr>
                {data.map(firm => {
                  return (
                    <tr role="button">
                      <td className="border-3">{firm.firmName}</td>
                      <td className="border-3 text-center border-3">{firm.previousYearAmount}</td>
                      <td className="text-center border-3">{firm.currentYearAmount}</td>
                      <td className="text-center border-3">{firm.sikshaNidhiAmount}</td>
                    </tr>
                  );
                })}
              </tbody>
          </table>
          <ul className="pagination justify-content-end">
            <li className="page-item"><a className="page-link" href="/">Previous</a></li>
            <li className="page-item"><a className="page-link" href="/">1</a></li>
            <li className="page-item"><a className="page-link" href="/">2</a></li>
            <li className="page-item active"><a className="page-link" href="/">3</a></li>
            <li className="page-item"><a className="page-link disabled" href="/">Next</a></li>
          </ul>
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
      <div className="modal fade" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered modal-xl">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="exampleModalLabel">Firm Details</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body">
              <div className="mb-3 row">
                <label for="firmName" className="col-sm-2 col-form-label">Firm Name</label>
                <div className="col-sm-10">
                  <input type="text" className="form-control" id="firmName" value="ABC" />
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
    </div>
  );
}

export default App;
