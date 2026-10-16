import EvTextArea from "@nce/eview-react/TextArea";
import "./TextArea.css";

export default function TextArea(props) {
    const { className, ...restProps } = props;
    return <EvTextArea className={`evTextArea-custom ${className ?? ''}`} {...restProps} />;
}
