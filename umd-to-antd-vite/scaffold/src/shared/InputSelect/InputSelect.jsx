import EvInputSelect from "@nce/eview-react/InputSelect";
import "./InputSelect.css";

export default function InputSelect(props) {
    const { className, ...restProps } = props;
    return <EvInputSelect className={`evInputSelect-custom ${className ?? ''}`} {...restProps} />;
}
