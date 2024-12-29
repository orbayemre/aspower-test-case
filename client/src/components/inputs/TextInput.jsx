import '../../styles/common.css';

export default function TextInput({label, value="",placeholder,onChange,autoFocus=false,}){

    return(
        <div className="textInput">
            <div className="label">
                <label htmlFor={label}>{label}</label>
            </div>
            <input id={label} className="formInput" type="text" value={value} placeholder={placeholder} onChange={onChange} autoFocus={autoFocus}/>

        </div>
    )
}