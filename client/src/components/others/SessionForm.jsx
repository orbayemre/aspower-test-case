
import { useState, useEffect } from "react"

import TextInput from "../inputs/TextInput";
import TextArea from '../inputs//TextArea';
import DateInput from '../inputs//DateInput';

export default function SessionForm({session, index, handleSession, handleDeleteSession}){

    const [title,setTitle] = useState(session.title);
    const [description,setDescription] = useState(session.description);
    const [speakerName,setSpeakerName] = useState(session.speaker.name);
    const [speakerBio,setSpeakerBio] = useState(session.speaker.bio);
    const [speakerImage,setSpeakerImage] = useState(session.speaker.image);
    const [speakerImageFile,setSpeakerImageFile] = useState(session.speaker?.imageFile);
    const [speakerSL,setSpeakerSL] = useState(session.speaker.socialLinks);
    const [startTime,setStartTime] = useState(session.startTime);
    const [endTime,setEndTime] = useState(session.endTime);


    const handleTitle = (e) =>{
        setTitle(e.target.value);
    }
    const handleDescription = (e) =>{
        setDescription(e.target.value);
    }
    const handleSpeakerName = (e) =>{
        setSpeakerName(e.target.value);
    }
    const handleSpeakerBio = (e) =>{
        setSpeakerBio(e.target.value);
    }
    const handleSpeakerImageFile = (e) =>{
        const file = e.target.files[0];
        setSpeakerImageFile(file);
        showImage(URL.createObjectURL(file));
    }
    const handleSpeakerSL = (e) =>{
        setSpeakerSL([e.target.value]);
    }
    const handleStartTime = (e) =>{
        setStartTime(e.target.value)
    }
    const handleEndTime = (e) =>{
        setEndTime(e.target.value)
    }
    
    
    const showImage = (url) => {
        const speakerImageSrc = document.querySelector(`.speakerImage-${session.id}`);
        speakerImageSrc.src = url;
    };


    useEffect(()=>{
        handleSession({
            "id" : session.id,
            "title": title,
            "description": description,
            "speaker" : {
                "name": speakerName,
                "bio": speakerBio,
                "image": speakerImage,
                "imageFile": speakerImageFile,
                "socialLinks" : speakerSL
            },
            "startTime": startTime,
            "endTime": endTime,
        })

    },[title,description,speakerName,speakerBio,speakerImage,speakerImageFile,speakerSL,startTime,endTime])

    return(
        <div className="formSessionBox">
            <div className="formSessionHeader">
                <span className="head">{index+1}. Session</span>
                <span className="deleteText" onClick={()=>handleDeleteSession(session.id)}>Delete</span>
            </div>
            <div className="formSession">
                <div className="formB">
                    <div className="formField">
                        <TextInput label={"Session Title :"} value={title} placeholder={"Enter session title"} onChange={handleTitle}/>
                    </div>
                    <div className="formField">
                        <TextArea label={"Session Description :"} value={description} placeholder={"Enter session description"} onChange={handleDescription}/>
                    </div>
                </div>
                <div className="formB">
                    <div className="formField">
                        <TextInput label={"Session Speaker Name :"} value={speakerName} placeholder={"Enter session speaker name"} onChange={handleSpeakerName}/>
                    </div>
                    <div className="formField">
                        <TextArea label={"Session Speaker Bio :"} value={speakerBio} placeholder={"Enter session speaker bio"} onChange={handleSpeakerBio}/>
                    </div>
                </div>
                <div className="formB2">
                    <div className="right">
                        <div className="formField">
                            <TextInput label={"Session Speaker Social Link :"} value={speakerSL[0]} placeholder={"Enter session speaker social link"} onChange={handleSpeakerSL}/>
                        </div>
                    </div>
                    <div className="left">
                        <div className="formField">
                            <DateInput label={"Session Start Time :"} value={startTime} onChange={handleStartTime}/>
                        </div>
                        <div className="formField">
                            <DateInput label={"Session End Time :"} value={endTime} onChange={handleEndTime}/>
                        </div>
                    </div>
                </div>
                <div className="formB3">
                    <div className="formField">
                        <label htmlFor="image"> Upload Speaker Image :</label>
                        <input
                            type="file"
                            id="image"
                            onChange={(e) => handleSpeakerImageFile(e)}
                            className="imageUpload"
                        />                    
                    </div>
                    {
                        speakerImage ? 
                        <img className={"speakerImg speakerImage-"+session.id} src={speakerImage}/>
                        :
                        <img className={"speakerImg speakerImage-"+session.id}/>
                    }
                </div>
            </div>



        </div>
    )
}