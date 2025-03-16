import React, { useState } from "react";
import Navbar from "../components/Navbar";
import { Link } from "react-router-dom";
import "../styles/LoanForm.css"; 

function LoanForm() {
  const [formData, setFormData] = useState({
    loanId: "",
    name: "",
    state: "",
    document: null,
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, document: e.target.files[0] });
  };

  const handleClear = () => {
    setFormData({ loanId: "", name: "", state: "", document: null });
  };

  const handleApply = () => {
    console.log("Apply button clicked");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Submitted Data:", formData);
  };

  return (
    <>
      <Navbar />

      {/* Left section............................................................................... */}


      <div className="container loan-form">
        <div className="row">
          <div className="col-md-6 form-section">
          <h3 className="LegalSection">Legal Section</h3>
            <form onSubmit={handleSubmit}>
              <div className="row mb-3">
                <label htmlFor="loanId" className="col-md-4 col-form-label">
                  Approval Authority
                </label>
                <div className="col-md-8">
                  <select className="form-select" name="loanId" value={formData.loanId} onChange={handleChange}>
                    <option value="">Select Approval Authority</option>
                    <option value="1">Loan 1</option>
                    <option value="2">Loan 2</option>
                  </select>
                </div>
              </div>

              <div className="row mb-3">
                <label htmlFor="loanIdSearch" className="col-md-4 col-form-label">
                  Enter Loan Number
                </label>
                <div className="col-md-8">
                  <div className="input-group">
                    <input
                      type="search"
                      className="form-control"
                      placeholder="Enter Loan Number"
                      name="loanId"
                      value={formData.loanId}
                      onChange={handleChange}
                    />
                    <button className="btn btn-outline-secondary" type="button">
                      ⌕
                    </button>
                  </div>
                </div>
              </div>

              <div className="row mb-3">
                <label htmlFor="name" className="col-md-4 col-form-label">
                  Applicant Name
                </label>
                <div className="col-md-8">
                  <input type="text" className="form-control" placeholder="Name" name="name" value={formData.name} onChange={handleChange} />
                </div>
              </div>

              <div className="row mb-3">
                <label htmlFor="state" className="col-md-4 col-form-label">
                  Application State
                </label>
                <div className="col-md-8">
                  <input type="text" className="form-control" placeholder="State" name="state" value={formData.state} onChange={handleChange} />
                </div>
              </div>

              <div className="row mb-3">
                <label htmlFor="document" className="col-md-4 col-form-label">
                  Upload Document
                </label>
                <div className="col-md-8">
                  <input type="file" className="form-control" id="document" name="document" onChange={handleFileChange} />
                </div>
              </div>

              <div className="d-flex justify-content-between">
                <button type="button" className="btn btn-secondary" onClick={handleClear}>
                  Clear
                </button>
                <button type="button" className="btn btn-primary" onClick={handleApply}>
                  Apply
                </button>
                <Link to="/progressbar">
                  <button type="submit" className="btn btn-primary">Submit</button>
                </Link>
              </div>
            </form>
          </div>

          
          
          
          
          {/* Right Section ........................................  */}


<div className="col-md-6 right-section">
  {/* Bullet Navbar Section */}
  <div className="bullet-navbar">
    <div className="row">
      <div className="col-12 d-flex justify-content-around">
        <div className="form-check">
          <input className="form-check-input" type="radio" name="options" id="read" />
          <label className="form-check-label" htmlFor="read">Read</label>
        </div>
        <div className="form-check">
          <input className="form-check-input" type="radio" name="options" id="leave" />
          <label className="form-check-label" htmlFor="leave">Leave</label>
        </div>
        <div className="form-check">
          <input className="form-check-input" type="radio" name="options" id="download" />
          <label className="form-check-label" htmlFor="download">Download</label>
        </div>
        <div className="form-check">
          <input className="form-check-input" type="radio" name="options" id="delete" />
          <label className="form-check-label" htmlFor="delete">Delete</label>
        </div>
      </div>

      <div className="col-12 d-flex justify-content-around mt-3">
        <div className="form-check">
          <input className="form-check-input" type="radio" name="options" id="edit" />
          <label className="form-check-label" htmlFor="edit">Edit</label>
        </div>
        <div className="form-check">
          <input className="form-check-input" type="radio" name="options" id="share" />
          <label className="form-check-label" htmlFor="share">Share</label>
        </div>
        <div className="form-check">
          <input className="form-check-input" type="radio" name="options" id="approve" />
          <label className="form-check-label" htmlFor="approve">Approve</label>
        </div>
        <div className="form-check">
          <input className="form-check-input" type="radio" name="options" id="reject" />
          <label className="form-check-label" htmlFor="reject">Reject</label>
        </div>
      </div>
    </div>
  </div>

{/* Horizontal bar */}
  <div class="horizontal-divider"></div>

  {/*  Image Section */}
  <div className="image-container">
    <img src="docx.png" alt="Loan Document" className="img-fluid rounded" />
  </div>
</div>


        </div>
      </div>
    </>
  );
}

export default LoanForm;

