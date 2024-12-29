import '../../styles/common.css';

export default function MailInput({value="",placeholder,onChange,autoFocus=false,}){

    return(
        <div className="mailInput">
            <div className="label">
                <label htmlFor='e-mail'>E-mail</label>
            </div>
            <input id='e-mail' className="formInput" type="text" value={value} placeholder={placeholder} onChange={onChange} autoFocus={autoFocus}/>

        </div>
    )
}