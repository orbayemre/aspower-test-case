import { useState, useEffect } from "react"
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import moment from "moment";
import axios from "axios";
import Swal from 'sweetalert2';

import Params from "../params";
import { setLogout } from "../store/authStore";
import SessionContent from "../components/others/SessionContent";

export default function Home(){
    
    const dispatch = useDispatch();
    const navigate = useNavigate();


    const {isLogin, accessToken, data, role} = useSelector(state => state.authStore);
    const [events,setEvents] = useState(null);    
    const [registrations,setRegistrations] = useState(null);
 



    const handleLogout = () =>{
        
        Swal.fire({
            title: 'Log Out',
            text: "Are you sure you want to Log Out?",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#008000',
            cancelButtonColor: '#ff0000',
            confirmButtonText: 'Yes, delete!',
            cancelButtonText: 'No, Cancel',
            }).then((result) => {
                if (result.isConfirmed) {
                    dispatch(setLogout());
                    navigate(0);
                } 
        });
    }

    const handleRegisterEvent = async (id) =>{
        if(role == "user"){

            await axios.post(Params.api+"/api/registration/register",{   
                "eventId" : id,
            },{
                headers:{
                    "Authorization" : "Bearer " + accessToken,
                    'Content-Type': 'application/json'
                }
            })
            .then(({data})=>{
                if(data.status == "success"){
                    toast.success(data.message, {
                        position: "bottom-center",
                        autoClose: 1000,
                        hideProgressBar: true,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                        theme: "light",
                        className:"w-96"
                    });
                    setTimeout(() => {
                        navigate(0);
                    }, 1500);
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
        else{
            navigate("/user/login");
        }

        
    }

    const getEvents = () =>{
        
        const now = moment().add(3, 'hours');
        
        const startDate = now.toJSON().split(".")[0];
        const endDate = now.add(30, 'days').toJSON().split(".")[0];

        axios.post(Params.api+"/api/event/get-events",{
            start_date: startDate,
            end_date: endDate
        })
        .then(({data})=>{
            if(data.status == "success"){
                setEvents(data.events);
            }else{
                console.log(data.message)
            }
        })
        .catch(function (error) {
            console.log(error.response.data.message);

        });  
    }
    const getRegistrations = async () =>{

        await axios.get(Params.api+"/api/registration/get-registrations",{
            headers:{
                "Authorization" : "Bearer " + accessToken,
                'Content-Type': 'application/json'
            }
        })
        .then(({data})=>{
            if(data.status == "success"){
                setRegistrations(data.registrations);
            }else{
                console.log(data.message)
            }
        })
        .catch(function (error) {
            
            console.log(error)

        });  
    }


    
    useEffect(()=>{
        getEvents();
        if(isLogin){
            getRegistrations();
        }
    },[]);


    return <>
        <div className="navBar">
            <div className="authNavbarBox">
                {
                    isLogin ? 
                    <>
                        <div className="userBox">
                            <span className="name">{data.user.name} {data.user.surname}</span>
                            <span className="email">{data.user.email}</span>
                        </div> 
                        
                        <div className="logoutBox" onClick={handleLogout}>
                            Log Out
                        </div>
                    </>
                    :
                    
                    <div className="loginBox" onClick={() => {navigate("/user/login")}}>
                        Login
                    </div> 
                
                }

            </div>
        </div>
        
        <div className="eventsContainer">
            <div className="eventsBox">
                {
                    events ? 
                    <>
                        <div className="header">
                            <h1>Our Events</h1>
                        </div>
                        <div className="eventsBody">
                            {
                                events.map((event,index) =>{
                                    let date = moment(event.startDate);
                                    let formattedDate = date.format('D MMM YYYY');
                                    var isRegistered = false;
                                    if(isLogin){
                                        registrations?.map((registration) =>{
                                            if(registration.event == event._id){
                                                isRegistered = true;
                                            }
                                        })
                                    }
                                    return(
                                        <div key={index} className="eventContent">
                                            <div className="eventHeader">
                                                <div className="headerLeft">
                                                    <h2 className="eventTitle">
                                                        {event.title}
                                                    </h2>
                                                    <span className="eventDesc">
                                                        {event.description}
                                                    </span>
                                                    <span  className="eventLoc">
                                                        <b>Location : </b>{event.location}
                                                    </span>
                                                </div>
                                                <div className="headerRight">
                                                    <div className="date">
                                                        {formattedDate}
                                                    </div>
                                                    {
                                                        role!=="admin" ?(
                                                            !isRegistered ? 
                                                        <div className="registerButton" onClick={() => handleRegisterEvent(event._id)}>
                                                            Register Event
                                                        </div>
                                                        : 
                                                        <div className="registered" >
                                                            Registered
                                                        </div>
                                                        ) : ""
                                                    }
                                                </div>
                                            </div>
                                            <div className="eventSessions">
                                                <div className="sessionsHeader">
                                                    <h2>Sessions</h2>
                                                </div>
                                                <div className="sessionsBody">
                                                    {
                                                        event.sessions.map((session,index) =>{
                                                            return(
                                                                <SessionContent session={session} key={index} index={index} />
                                                            );
                                                        })
                                                    }
                                                </div>

                                            </div>
                                        </div>
                                            
                                    )
                                })
                            }
                        </div>
                    </>
                    : ""
                }
            </div>
        </div>
        <ToastContainer/>
    </>
}