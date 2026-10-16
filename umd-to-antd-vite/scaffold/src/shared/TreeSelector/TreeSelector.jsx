import EvTreeSelector from "@nce/eview-react/TreeSelector";
import "./TreeSelector.css";

export default function TreeSelector(props) {
    const { className, ...restProps } = props;
    return <EvTreeSelector className={`evTreeSelector-custom ${className ?? ''}`} {...restProps} />;
}
