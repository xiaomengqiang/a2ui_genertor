import EvIPInput from "@nce/eview-react/IPInput";
import "./IPInput.css";

export default function IPInput(props) {
    const { className, ...restProps } = props;
    return <EvIPInput className={`evIPInput-custom ${className ?? ''}`} {...restProps} />;
}
