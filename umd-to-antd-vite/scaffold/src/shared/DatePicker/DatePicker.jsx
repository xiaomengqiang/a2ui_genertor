import EvDatePicker from "@nce/eview-react/DatePicker";
import './DatePicker.css';

export default function DatePicker(props) {
    const { className, style, ...rest } = props

    return (
        <div className={`evDatePicker-custom ${className ?? ""}`} style={style ?? {}} >
            <EvDatePicker style={{ width: "100%" }}  {...rest} />
        </div>
    )
}
