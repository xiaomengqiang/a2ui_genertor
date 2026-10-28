import EvTextField from "@nce/eview-react/TextField";
import "./TextField.css";

export default function TextField(props) {
    const { className, prefix, style, ...restProps } = props;
    return prefix ?
        <div className={`evTextField-custom ${className ?? ''}`} style={style ?? {}}>
            <EvTextField {...restProps} />
            <span className="prefix-wrapper">{prefix}</span>
        </div>
        : <EvTextField className={`evTextField-custom ${className ?? ''}`} style={style ?? {}} {...restProps} />
}