import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import {toast} from 'react-toastify'
import Navbar from "../components/Navbar";
import { loginUser } from "../services/Login";

function Login() {

    const navigate = useNavigate()
const [username, setUsername] = useState('');
const [password, setPassword] = useState('');
const [isUsernameEmpty, setUsernameEmpty] = useState(false);
const [isPasswordEmpty, setPasswordEmpty] = useState(false);


// navigation Hook


const onLogin = async() => {
      if(username.length == 0) {
        toast.error('Please enter username');
      }  
      else if(password.length == 0) {
        toast.error('Please enter password');
      } else {
        // Api call and check successfull.
        //go to register register file
        const result = await loginUser(username, password)
        if(result != 'undefined') {
            const token = result['token']
            sessionStorage['token'] = token;
            toast.success('Welcome ....')
            navigate('/register')
        }
        else{
            toast.error(result['error'])
        }
        // navigate('/register')
      }
}

    return (
        <>
        <Navbar/>
        <div className="container d-flex justify-content-center align-items-center vh-100">
            <div className="col-md-4">
                <div className="card shadow-lg border-0 rounded-4 p-4">
                    <h2 className="text-center mb-4 text-primary fw-bold">Login</h2>
                    
                    <div className="form">
                        <div className="mb-3">
                            <label htmlFor="username" className="form-label fw-bold">Username</label>
                            <input 
                            onChange = {(e) => {
                                if(e.target.value.length == 0)
                                    { setUsernameEmpty(true)}
                                else {
                                    setUsernameEmpty(false)

                                }
                                setUsername(e.target.value)
                            }}
                            type="text" id="username" className="form-control" placeholder="Enter your username" />
                            {isUsernameEmpty && (
                                 <p style ={{color:'red'}}>username is mandatory</p>
                            )}


                        </div>

                        <div className="mb-3">
                            <label htmlFor="password" className="form-label fw-bold">Password</label>
                            <input 
                            onChange = {(e) => {
                                if(e.target.value.length == 0)
                                    { setPasswordEmpty(true)}
                                else {
                                    setPasswordEmpty(false)

                                }
                                setPassword(e.target.value)
                            }}
                            type="password" id="password" className="form-control" placeholder="Enter your password" />
                            {isPasswordEmpty &&(
                                <p style ={{color:'red'}}>password is mandatory</p>
                            )}
                        </div>

                        <div className="d-flex justify-content-between">
                                <button onClick={onLogin} className="btn btn-success px-4">Sign In</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        </>
    );
}

export default Login;
