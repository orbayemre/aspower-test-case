import '../../styles/common.css';

export default function DateInput({label, value="",placeholder,onChange}){

    return(
        <div className="dateInput">
            <div className="label">
                <label htmlFor={label}>{label}</label>
            </div>
            <input type="datetime-local" id={label} className="formInput" value={value} placeholder={placeholder} onChange={onChange} />
        </div>
    )
}