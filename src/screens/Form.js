import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { FaSearch} from "react-icons/fa";
import "../styles/Form.css";

function Form() {
    const [employeeId, setEmployeeId] = useState('');
    const [action, setAction] = useState('');
    const [name, setName] = useState('');
    const [branch, setBranch] = useState('');
    const [designation, setDesignation] = useState('');
    const [manager, setManager] = useState('');
    const [managerId, setManagerid] = useState('');
    const [lamId, setLamid] = useState('');
    const [role, setRole] = useState('');

    const navigate = useNavigate();

    const onRegister = async () => {
        if (employeeId.length === 0) {
            toast.error('Please select employee ID');
            return;
        }
        if (role.length === 0) {
            toast.error('Please select role');
            return;
        }
        if (action.length === 0) {
            toast.error('Please select action');
            return;
        }

        try {
            const payload = {
                employeeId,
                name,
                designation,
                branch,
                manager,
                managerId,
                lamId,
                role,
                action,
            };

            const response = await axios.post("http://localhost:5275/api/Employee/Register", payload);

            if (response.status === 200) {
                toast.success("Registration successful!");
                navigate('/');
            } else {
                toast.error("Failed to register. Please try again.");
            }
        } catch (error) {
            toast.error("Error submitting data: " + (error.response?.data || error.message));
        }
    };

    const searchEmployee = async () => {
        if (!employeeId.trim()) {
            toast.error("Please enter a valid Employee ID.");
            return;
        }

        try {
            const response = await axios.get(`http://localhost:5275/api/Employee/${employeeId}`);
            const data = response.data;

            setName(data.name || '');
            setBranch(data.branch || '');
            setDesignation(data.designation || '');
            setManager(data.manager || '');
            setManagerid(data.managerId || '');
            setLamid(data.lamId || '');

        } catch (error) {
            toast.error("Employee not found or an error occurred.");
            clearForm();
        }
    };

    const clearForm = () => {
        setEmployeeId('');
        setAction('');
        setName('');
        setBranch('');
        setDesignation('');
        setManager('');
        setManagerid('');
        setLamid('');
        setRole('');
    };

    return (
        <div className="container">
            <div className="form-container">
                <h2 className="title">Register</h2>
                <div className="form">

                    <div className="input-group">
                        <label htmlFor="employeeId">EmployeeID</label>
                        <div className="search-group">
                            <input type="search" id="employeeId" placeholder="Enter Employee ID"
                                value={employeeId} onChange={(e) => setEmployeeId(e.target.value)} />
                            <button className="btn-primary" onClick={searchEmployee}><FaSearch /></button>
                        </div>
                    </div>

                    <div className="input-group">
                        <label htmlFor="name">Name</label>
                        <input type="text" id="name" value={name} readOnly />
                    </div>

                    <div className="input-group">
                        <label htmlFor="designation">Designation</label>
                        <input type="text" id="designation" value={designation} readOnly />
                    </div>

                    <div className="input-group">
                        <label htmlFor="branch">Branch</label>
                        <input type="text" id="branch" value={branch} readOnly />
                    </div>

                    <div className="input-group">
                        <label htmlFor="manager">Manager</label>
                        <input type="text" id="manager" value={manager} readOnly />
                    </div>

                    <div className="input-group">
                        <label htmlFor="managerId">Manager ID</label>
                        <input type="text" id="managerId" value={managerId} readOnly />
                    </div>

                    <div className="input-group">
                        <label htmlFor="lamid">Lam ID</label>
                        <input type="text" id="lamid" value={lamId} readOnly />
                    </div>

                    <div className="input-group">
                        <label htmlFor="role">User Type</label>
                        <select id="role" value={role} onChange={(e) => setRole(e.target.value)}>
                            <option value="">User Type</option>
                            <option value="Admin">Admin</option>
                            <option value="Sub Admin">Lam Admin</option>
                            <option value="IT User">IT User</option>
                            <option value="User">User</option>
                        </select>
                    </div>

                    <div className="input-group">
                        <label htmlFor="action">Action</label>
                        <select id="action" value={action} onChange={(e) => setAction(e.target.value)}>
                            <option value="">Select Action</option>
                            <option value="Create">Create New</option>
                            <option value="Delete">Delete Existing</option>
                        </select>
                    </div>

                    <div className="button-group">
                        <button className="btn-danger" onClick={clearForm}>Clear</button>
                        <button className="btn-success" onClick={onRegister}>Submit</button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Form;
