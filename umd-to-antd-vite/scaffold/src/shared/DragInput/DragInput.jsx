import EvDragInput from "@nce/eview-react/DragInput";
import "./DragInput.css";

export default function DragInput(props) {
    const { className, ...restProps } = props;
    return <EvDragInput className={`evDragInput-custom ${className ?? ''}`} {...restProps} />;
}
