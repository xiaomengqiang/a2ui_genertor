import EvTimePicker from "@nce/eview-react/TimePicker";
import "./TimePicker.css";

export default function TimePicker(props) {
    const { className, ...restProps } = props;
    return <EvTimePicker className={`evTimeSelector-custom ${className ?? ''}`} {...restProps} />;
}
