import "../styles/Login.css";

function Login() {
  return (
    <div className="login-container">

      {/* Left Side - Login Form */}

      <div className="login-left">
        <div className="login-content">
            <div className="logo-container">
          <img src="ICICI-logo.png" alt="Logo" className="logo" />
          <h2 class="lotus-team"><span className="Icici-name">ICICI</span> Home Finance</h2>
          </div>

          <h4 class="login-text">Sign In</h4>
          <form>
            <div className="input-group">
              {/* <label>Username</label> */}
              <input type="text" placeholder="username" required />
            </div>
            <div className="input-group">
              <input type="password" placeholder="password" required />
            </div>
            <button type="submit" className="login-btn">LOG IN</button>
            
          </form>
        </div>
      </div>

      {/* Right Side - Info Section */}
      <div className="login-right">
        <h2 className="DWH-heading">Data Warehouse Web Reporting Module</h2>
        <div className="Dwh-logo">
          <img src="https://www.scnsoft.com/data-analytics/dwh-design/data-warehouse-design-cover-picture.svg" alt="Logo" className="Wrm-logo" />
          </div>
      </div>
    </div>
  );
}

export default Login;
