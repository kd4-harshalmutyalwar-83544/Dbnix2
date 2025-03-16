import { useState } from "react";
import axios from "axios";
import {toast} from 'react-toastify'
import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";

function Register() {
    const [employeeId, setEmployeeId] = useState('');
    const [action, setAction] = useState('');
    const [name, setName] = useState('');
    const [department, setDepartment] = useState('');
    const [designation, setDesignation] = useState('');
    const [manager, setManager] = useState('');
    const [role, setRole] = useState('');


    //navigation
    const navigate = useNavigate();
    const onRegister = () => {
        if(employeeId.length == 0) {
            toast.error('please select employee ID')
        } else if (role.length == 0) {
            toast.error('please select role')
        } else if (action.length == 0) {
            toast.error('please select action')
        } else {
            //Api call for register, check status 
            // if success go to login screen.
            
            toast.success('Registration successful!');
            navigate('/');
        }

    }
    // const onRegister = async () => {
    //     if (!employeeId.trim() || !role || !action) {
    //         toast.error("Please fill all required fields.");
    //         return;
    //     }

        // try {
        //     const response = await axios.post("https://RegisterApi/api/register", {
        //         employeeId,
        //         role,
        //         action
        //     });

        //     toast.Register("Registration successful!");
        //     clearForm();
        // } catch (error) {
        //     toast.error("An error occurred. Please try again.");
        // }
   // };

    const searchEmployee = async () => {
        if (!employeeId.trim()) {
            toast.error("Please enter a valid Employee ID.");
            return;
        }

        try {
            const response = await axios.get(`https://Register/api/employees/${employeeId}`);
            const data = response.data;

            setName(data.name || '');
            setDepartment(data.department || '');
            setDesignation(data.designation || '');
            setManager(data.manager || '');
        } catch (error) {
            toast.error("Employee not found or an error occurred.");
            clearForm();
        }
    };

    const clearForm = () => {
        setEmployeeId('');
        setAction('');
        setName('');
        setDepartment('');
        setDesignation('');
        setManager('');
        setRole('');
    };

    return (
        
          <>
            
            <Navbar/>
        <div className="container d-flex justify-content-center align-items-center vh-100">
            <div className="col-md-6">
                <div className="card shadow-lg border-0 rounded-4 p-4">
                    <h2 className="text-center mb-4 text-primary fw-bold">Register</h2>
                    <div className="form">
                        {/* Employee ID Search */}
                        <div className="mb-3">
                            <label htmlFor="employeeId" className="fw-bold">Employee ID</label>
                            <div className="d-flex">
                                <input type="search" id="employeeId" className="form-control"
                                    placeholder="Enter Employee ID"
                                    value={employeeId}
                                    onChange={(e) => setEmployeeId(e.target.value)} />
                                <button className="btn btn-primary ms-2" onClick={searchEmployee}>Search</button>
                            </div>
                        </div>

                        {/* Name  */}
                        <div className="mb-3">
                            <label htmlFor="name" className="fw-bold">Name</label>
                            <input type="text" id="name" className="form-control" value={name} readOnly />
                        </div>

                        {/* Department */}
                        <div className="mb-3">
                            <label htmlFor="department" className="fw-bold">Department</label>
                            <input type="text" id="department" className="form-control" value={department} readOnly />
                        </div>

                        {/* Designation */}
                        <div className="mb-3">
                            <label htmlFor="designation" className="fw-bold">Designation</label>
                            <input type="text" id="designation" className="form-control" value={designation} readOnly />
                        </div>

                        {/* Manager */}
                        <div className="mb-3">
                            <label htmlFor="manager" className="fw-bold">Manager Name</label>
                            <input type="text" id="manager" className="form-control" value={manager} readOnly />
                        </div>

                        {/* Role Dropdown */}
                        <div className="mb-3">
                            <label htmlFor="role" className="fw-bold">Role</label>
                            <div className="position-relative">
                                <select className="form-control pe-4" id="role" value={role} onChange={(e) => setRole(e.target.value)}>
                                    <option value="">Select Role</option>
                                    <option value="Admin">Admin</option>
                                    <option value="Sub Admin">Sub Admin</option>
                                    <option value="IT User">IT User</option>
                                    <option value="User">User</option>
                                </select>
                                <span className="position-absolute end-0 top-50 translate-middle-y me-3">▼</span>
                            </div>
                        </div>

                        {/* Action Dropdown */}
                        <div className="mb-3">
                            <label htmlFor="action" className="fw-bold">Action</label>
                            <div className="position-relative">
                                <select className="form-control pe-4" id="action" value={action} onChange={(e) => setAction(e.target.value)}>
                                    <option value="">Select Action</option>
                                    <option value="Create">Create New</option>
                                    <option value="Delete">Delete Existing</option>
                                </select>
                                <span className="position-absolute end-0 top-50 translate-middle-y me-3">▼</span>
                            </div>
                        </div>

                        {/* Buttons */}
                        <div className="mb-3 d-flex justify-content-between">
                            <button className="btn btn-danger px-4" onClick={clearForm}>Clear</button>
                            <button className="btn btn-success px-4" onClick={onRegister}>Submit</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        </>
    );
}

export default Register;
