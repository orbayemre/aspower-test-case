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
import TextInput from "../../components/inputs/TextInput";

import '../../styles/common.css';

export default function UserRegister(){

    
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const {isLogin} = useSelector(state => state.authStore);
    const [name,setName] = useState("");
    const [surname,setSurname] = useState("");
    const [email,setEmail] = useState("");
    const [password,setPassword] = useState("");
    const [repassword,setRePassword] = useState("");
    const [validationMessage,setValidationMessage] = useState(null);

    const handleName = (e)=>{
        setName(e.target.value);
    }
    const handleSurname= (e)=>{
        setSurname(e.target.value);
    }
    const handleEmail = (e)=>{
        setEmail(e.target.value);
    }
    const handlePassword = (e)=>{
        setPassword(e.target.value);
    }
    const handleRePassword = (e)=>{
        setRePassword(e.target.value);
    }
    
    const handleSubmit = (e)=>{
        if( !name || name == "" ){
            setValidationMessage("Name required");
        }
        if( !email || email == "" ){
            setValidationMessage("E-mail required");
        }
        else if( !password || password == "" ){
            setValidationMessage("Password required");
        }
        else if( !repassword || repassword == "" ){
            setValidationMessage(t("Re-password required"));
        }
        else if(!validate(email)){
            setValidationMessage("E-mail is not valid");
        }
        else if( password != repassword){
            setValidationMessage("Password do not match");
        }
        else{
            setValidationMessage(null);
    
            axios.post(Params.api+"/api/user/register",{
                name,
                surname,
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
            <div className="authBox userRegisterBox">
                <div className="header">
                    <h1>User Register</h1>
                </div>
                <div className="formBody">
                    <div className="formField">
                        <TextInput label={"Name"} value={name} placeholder={"Enter your name"} onChange={handleName} autoFocus={true}/>
                    </div>
                    <div className="formField">
                        <TextInput label={"Surname"}  value={surname} placeholder={"Enter your surname"} onChange={handleSurname}/>
                    </div>
                    <div className="formField">
                        <MailInput value={email} placeholder={"Enter your e-mail"} onChange={handleEmail}/>
                    </div>
                    <div className="formField">
                        <PasswordInput label={"Password"} value={password} placeholder={"Enter your password"} onChange={handlePassword}/>
                    </div>
                    <div className="formField">
                        <PasswordInput label={"Re-Password"} value={repassword} placeholder={"Enter your re-password"} onChange={handleRePassword}/>
                    </div>
                    <div className="validationMessage">
                        { validationMessage  }
                    </div>
                    
                    <div className="submitButton" onClick={handleSubmit}>
                        Register
                    </div>
                    <div className="alreadyAccount">
                        <a href="/user/login">
                            Do you have already an account?
                        </a>
                    </div>
                </div>
            </div>
            <ToastContainer />
        </div>
        
    </>
}