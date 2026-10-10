import EvSelect from "@nce/eview-react/Select";
import "./Select.css";

export default function Select(props) {
    const { className, ...restProps } = props;
    return <EvSelect className={`evSelect-custom ${className ?? ''}`} {...restProps} />;
}