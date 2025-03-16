import axios from "axios";
import { createUrl, createError } from "./utils";

export async function loginUser(username, password){
    try{
        const url = createUrl('api/Login')
        const body = { 
            username, 
            password
        }
        const response = await axios.post(url,body)

        console.log("Login API Response:", response.data);
        return response.data
    } catch(ex) {
        console.log("Login API Error:", ex); 
        return createError(ex)
    }
}