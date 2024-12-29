import { useState, useEffect } from "react"
import { validate } from "email-validator";
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from "react-redux";
import { ToastContainer, toast } from 'react-toastify';
import axios from 'axios';

import Params from "../../params"
import { setLogin }  from "../../store/authStore";
import PasswordInput from "../../components/inputs/PasswordInput";
import MailInput from "../../components/inputs/MailInput";

import '../../styles/common.css';

export default function UserLogin(){

    
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const {isLogin} = useSelector(state => state.authStore);
    const [email,setEmail] = useState("");
    const [password,setPassword] = useState("");
    const [validationMessage,setValidationMessage] = useState(null);

    const handleEmail = (e)=>{
        setEmail(e.target.value);
    }
    const handlePassword = (e)=>{
        setPassword(e.target.value);
    }
    
    const handleSubmit = (e)=>{
        if( !email || email == "" ){
            setValidationMessage("E-mail required");
        }
        else if( !password || password == "" ){
            setValidationMessage("Password required");
        }
        else if(!validate(email)){
            setValidationMessage("E-mail is not valid");
        }
        else{
            setValidationMessage(null);
    
            axios.post(Params.api+"/api/user/login",{
                email,
                password
            })
            .then(({data})=>{
                if(data.status == "success"){
                    dispatch(setLogin( {data, role:"user"}))
                    navigate("/");
                }else{
                    toast.error(data.message, {
                        position: "bottom-center",
                        autoClose: 5000,
                        hideProgressBar: true,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                        theme: "light",
                    });
                } 
            })
            .catch(function (error) {
                toast.error(error.response.data.message, {
                    position: "bottom-center",
                    autoClose: 5000,
                    hideProgressBar: true,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "light",
                });
            });    

        }
    }

    
    useEffect(()=>{  
        if(isLogin){
            navigate("/");
        }
    },[]); 

    return <>
        <div className="authContainer">
            <div className="authBox">
                <div className="header">
                    <h1>User Login</h1>
                </div>
                <div className="formBody">
                    <div className="formField">
                        <MailInput value={email} placeholder={"Enter your e-mail"} onChange={handleEmail} autoFocus={true}/>
                    </div>
                    
                    <div className="formField">
                        <PasswordInput label={"Password"} value={password} placeholder={"Enter your password"} onChange={handlePassword}/>
                    </div>
                    <div className="validationMessage">
                        { validationMessage  }
                    </div>
                    
                    <div className="submitButton" onClick={handleSubmit}>
                        Login
                    </div>
                    <div className="needAccount">
                        <a href="/user/register">
                            Don't have an account
                        </a>
                    </div>
                </div>
            </div>
            <ToastContainer />
        </div>
        
    </>
}