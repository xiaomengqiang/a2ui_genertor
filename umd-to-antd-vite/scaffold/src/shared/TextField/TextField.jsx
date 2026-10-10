import EvTextField from "@nce/eview-react/TextField";
import "./TextField.css";

export default function TextField(props) {
    const { className, ...restProps } = props;
    return <EvTextField className={`evTextField-custom ${className ?? ''}`} {...restProps} />;
}