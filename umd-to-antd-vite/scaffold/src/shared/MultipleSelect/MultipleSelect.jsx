import EvMultipleSelect from "@nce/eview-react/MultipleSelect";
import "./MultipleSelect.css";

export default function MultipleSelect(props) {
    const { className, ...restProps } = props;
    return <EvMultipleSelect className={`evMultipleSelect-custom ${className ?? ''}`} {...restProps} />;
}
