import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from "react"
import { useSelector } from "react-redux";
import moment from "moment";
import axios from "axios";
import { ToastContainer, toast } from 'react-toastify';

import Params from '../../params';
import TextInput from "../../components/inputs/TextInput";
import TextArea from '../../components/inputs/TextArea';
import DateInput from '../../components/inputs/DateInput';
import SessionForm from '../../components/others/SessionForm';

export default function CreateEvent(){

    const navigate = useNavigate();
    const {isLogin, accessToken, role} = useSelector(state => state.authStore);

    const [title,setTitle] = useState("");
    const [description,setDescription] = useState("");
    const [location,setLocation] = useState("");
    const [startDate,setStartDate] = useState("");
    const [endDate,setEndDate] = useState("");
    const [sessions,setSessions] = useState([{
        "id":0,
        "title": "",
        "description": "",
        "speaker" : {
            "name": "",
            "bio": "",
            "image": null,
            "imageFile": null,
            "socialLinks" : []
        },
        "startTime": "",
        "endTime": "",
    }]);

    const handleTitle = (e) =>{
        setTitle(e.target.value);
    }
    const handleDescription = (e) =>{
        setDescription(e.target.value);
    }
    const handleLocation = (e) =>{
        setLocation(e.target.value);
    }
    const handleStartDate = (e) =>{
        setStartDate(e.target.value)
    }
    const handleEndDate = (e) =>{
        setEndDate(e.target.value)
    }
    
    const handleSession = (session) =>{
        setSessions(sessions.map((sessionItem) =>
            sessionItem.id === session.id
                ? { ...sessionItem, ...session }
                : sessionItem
        ));
    }

    const addNewSession = () => {
        const newSession = {
            "id":sessions.slice(-1)[0].id+1,
            "title": "",
            "description": "",
            "speaker" : {
                "name": "",
                "bio": "",
                "image": null,
                "imageFile": null,
                "socialLinks" : []
            },
            "startTime": "",
            "endTime": "",
        };
        setSessions([...sessions,newSession]);
    }
    const deleteSession = (id) =>{
        if(sessions.length > 1){
            setSessions(sessions.filter((sessionItem) => sessionItem.id !== id));        }
    }



    const saveEvent = async () =>{

        const imageFiles = [];

        const mainSessions = [];
        sessions.map((session) =>{
            var newSession = {
                "title": session.title,
                "description": session.description,
                "speaker": {
                    "name": session.speaker.name,
                    "bio": session.speaker.bio,
                    "socialLinks": session.speaker.socialLinks
                },
                "startTime": session.startTime+":00Z",
                "endTime": session.endTime+":00Z"
            }
            mainSessions.push(newSession);
            imageFiles.push(session.speaker.imageFile);
        });


        await axios.post(Params.api+"/api/event/create",{
            "title": title,
            "description": description,
            "location": location,
            "startDate": startDate+":00Z",
            "endDate": endDate+":00Z",
            "sessions": mainSessions,
            "isOnline" : false
        },{
            headers:{
                "Authorization" : "Bearer " + accessToken,
                'Content-Type': 'application/json'
            }
        })
        .then(({data})=>{
            if(data.status == "success"){
                console.log(data);
                var isSucces = true;
                if (!imageFiles.every(file => file === null)) {
                    imageFiles.map(async (imageFile,index) =>{
                        if(imageFile){
                            const speakerId = data.speakersId[index];
                            await axios.post(Params.api+"/api/event/speaker-image/"+speakerId,{
                                "image": imageFile,
                            },{
                                headers:{
                                    "Authorization" : "Bearer " + accessToken,
                                    'Content-Type': 'multipart/form-data',
                                }
                            })
                            .then(({data})=>{
                                if(data.status == "success"){
                                    isSucces = true;
                                }else{
                                    isSucces = false;
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
                                isSucces = false;
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
                    })
                } 
                else {
                    toast.success("Event created successfully", {
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
                        navigate("/admin/panel");
                    }, 1500);
                    isSucces = false;
                }
                
                if(isSucces){
                    toast.success("Event created succesfully", {
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
                        navigate("/admin/panel");
                    }, 1500);
                }
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


    useEffect(()=>{  
        if(!isLogin || role != "admin" ){
            navigate("/");
        }
    },[]); 
    return(
        <div className='createEventContainer'>
            <div className='createEvenForm'>
                <div className='createEventFormHeader'>
                    <h1>Create Event</h1>
                </div>
                <div className='formBody'>
                    <div className='formBox formBox1'>
                        <div className='left'>
                            <div className="formField">
                                <TextInput label={"Title"} value={title} placeholder={"Enter event title"} onChange={handleTitle} autoFocus={true}/>
                            </div>
                            <div className="formField">
                                <TextArea label={"Description"} value={description} placeholder={"Enter event description"} onChange={handleDescription}/>
                            </div>
                        </div>
                        <div className='right'>
                            <div className="formField">
                                <TextInput label={"Location"} value={location} placeholder={"Enter event location"} onChange={handleLocation}/>
                            </div>
                            <div className='bottom'>
                                <div className="formField">
                                    <DateInput label={"Start Date"} value={startDate} onChange={handleStartDate}/>
                                </div>
                                <div className="formField">
                                    <DateInput label={"End Date"} value={endDate} onChange={handleEndDate}/>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className='sessionsBox'>
                        <div className='sessionHeader'>
                            <h2>Sessions</h2>
                        </div>
                        <div className='formSessions'>
                            {
                                sessions.map((session,index) =>{
                                    return (
                                        <SessionForm key={session.id} session={session} handleSession={handleSession} handleDeleteSession={deleteSession}  index={index}/>
                                    )
                                })
                            }

                        </div>
                        <div className='addNewSession' onClick={()=>addNewSession()}>
                            Add Session
                        </div>
                    </div>
                    <div className='saveButton' onClick={()=>saveEvent()}>
                        Save Event
                    </div>
                </div>
            </div>
            <ToastContainer/>
        </div>
    )
}