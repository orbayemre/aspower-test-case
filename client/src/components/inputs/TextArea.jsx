import '../../styles/common.css';

export default function TextArea({label, value="",placeholder,onChange,autoFocus=false,}){

    return(
        <div className="textArea">
            <div className="label">
                <label htmlFor={label}>{label}</label>
            </div>
            <textarea id={label} className="formInput" value={value} placeholder={placeholder} onChange={onChange} autoFocus={autoFocus}/>
        </div>
    )
}