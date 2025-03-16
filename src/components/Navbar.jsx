import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light px-3">
          <img src="ICICI_Logo.png" alt="Logo" width="50" height="50" className="d-inline-block align-text-top" />
      <a className="navbar-brand" href="#">ICICI Home Finance</a>

      <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
        <span className="navbar-toggler-icon"></span>
      </button>

      <div className="collapse navbar-collapse" id="navbarSupportedContent">
        <div className="ms-auto">
          <div className="dropdown">
            <button className="btn btn-light border-0" type="button" id="dropdownMenuButton" data-bs-toggle="dropdown" aria-expanded="false">Harshal
              ⏷
            </button>
            <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="dropdownMenuButton">
              <li><Link className="dropdown-item" to="/profile">Profile</Link></li>
              <li><Link className="dropdown-item" to="/settings">Settings</Link></li>
              <li><hr className="dropdown-divider" /></li>
              <li><Link className="dropdown-item text-danger" to="/">Logout</Link></li>
            </ul>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
