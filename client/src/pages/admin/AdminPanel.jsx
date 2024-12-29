import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from "react"
import { useSelector } from "react-redux";
import moment from "moment";
import axios from "axios";
import Swal from 'sweetalert2';
import { ToastContainer, toast } from 'react-toastify';

import Params from "../../params";

export default function AdminPanel(){
    
    const navigate = useNavigate();

    const {isLogin, accessToken, role} = useSelector(state => state.authStore);
    const [events,setEvents] = useState(null);    
    

    const handleDeleteEvent = async (id) =>{
        Swal.fire({
            title: 'Are you sure you want to delete the event?',
            text: "You cannot undo this action!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#008000',
            cancelButtonColor: '#ff0000',
            confirmButtonText: 'Yes, delete!',
            cancelButtonText: 'No, Cancel',
          }).then( async (result) => {
            if (result.isConfirmed) {
                await axios.post(Params.api+"/api/event/delete",{
                    "id" : id
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
                        console.log(data.message)
                    }
                })
                .catch(function (error) {
                    
                    console.log(error)
        
                }); 
            }
        });
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
                console.log(data.events);
            }else{
                console.log(data.message)
            }
        })
        .catch(function (error) {
            console.log(error.response.data.message);

        });  
    }
      
    useEffect(()=>{  
        if(!isLogin || role != "admin" ){
            navigate("/");
        }
        else{
            getEvents();
        }
    },[]); 
    
    return(
        <div className='adminPanelContainer'>
            <div  className='createEventBox'>
                <span className='createEventButton' onClick={()=>{navigate("/admin/panel/create-event")}}>
                    Create New Event
                </span>
            </div>
            <div className='eventsBox'>
                <div className='eventsHeader'>
                    <h2>Events</h2>
                </div>
                <div className='eventsBody'>
                    {
                        events?.map((event,index) =>{
                            return(
                                <div className='eventBox' key={index}>
                                        <div className='eventInfo'>
                                            <div className='eventId'>
                                                <span className='label'>Event ID:</span>
                                                <span className='data'>{event._id}</span>
                                            </div>
                                            <div className='eventTitle'>
                                                <span className='label'>Event Title:</span>
                                                <span className='data'>{event.title}</span>
                                            </div>
                                        </div>
                                        <div className='eventEdit'>
                                            <div className='eventUpdate' onClick={()=>{navigate("/admin/panel/update-event/"+event._id)}}>
                                                Update
                                            </div>
                                            <div className='eventDelete' onClick={()=> handleDeleteEvent(event._id)}>
                                                Delete
                                            </div>
                                        </div>

                                </div>
                            )
                        })
                    }
                </div>

            </div>
            <ToastContainer/>         
        </div>
    )
}