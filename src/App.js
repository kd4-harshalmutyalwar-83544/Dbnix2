import {Route, Routes} from 'react-router-dom'
import Login from "./screens/Login";
import Register from "./screens/Register";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import LoanForm from './screens/LoanForm';
import ProgressBar from './screens/ProgressBar';

function App() {
  return <div className="container">
    <Routes>
  <Route path="" element={<Login/>} />
  <Route path="register" element={<Register/>} />
  <Route path="loanForm" element={<LoanForm/>} />
  <Route path="progressbar" element={<ProgressBar/>}/>
  </Routes>
  <ToastContainer />
  </div>
}

export default App;
