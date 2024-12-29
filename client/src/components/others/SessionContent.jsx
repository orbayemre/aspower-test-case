import moment from "moment";

export default function SessionContent({session, index}){

    let start = moment.utc(session.startTime);
    let end = moment.utc(session.endTime);

    let startTime = start.format('HH:mm');
    let endTime = end.format('HH:mm');

    let resultDate = `${startTime} - ${endTime}`;
    return(
        <div className="sessionContent">
            <span>{index+1}.</span>
            <div className="sessionLeft">
                <div className="speakerImage">
                    <img src={session.speaker.image}/>
                </div>
            </div>
            <div className="sessionRight">
                <div className="sessionHeader">
                    <div className="text">
                        <span className="sessionTitle"> { session.title}</span>
                        <span className="sessionDesc">{ session.description}</span>
                    </div>
                    <div className="date">
                        {resultDate}
                    </div>
                </div> 
                <div className="speaker">
                    <div className="speakerName"> Speaker : <b>{session.speaker.name}</b></div>
                    {
                        session.speaker.bio ? 
                        <div>{session.speaker.bio}</div> : ""
                    }
                    <div>
                        {
                            session.speaker.socialLinks.length > 0 ? 
                            session.speaker.socialLinks.map((link,index)=>{
                                return <a key={index} href={link}>{link}</a>;
                            })
                            : ""
                        }
                    </div>
                </div>

            </div>

        </div>
    )
}