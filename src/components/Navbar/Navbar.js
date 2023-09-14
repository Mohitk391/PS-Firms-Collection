import { Link, useNavigate } from "react-router-dom";
import UmiyaMataji from "../../assets/umiya-mataji.png";

const Navbar = () => {
    const navigate = useNavigate();

    return (<nav className="navbar navbar-expand-sm navbar-dark bg-dark">
    <div className="container-fluid">
        <Link className="navbar-brand d-flex" to="/collections">
          <img src={UmiyaMataji} className="mx-1" alt="logo" width="30"/>
          Patidar Yuva Mandal
        </Link>
        <button className="btn btn-outline-danger" onClick={()=>{navigate("/login")}}>Logout</button>
    </div>
  </nav>)
}

export default Navbar;