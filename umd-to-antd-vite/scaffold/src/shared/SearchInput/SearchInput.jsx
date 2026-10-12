import EvSearchInput from "@nce/eview-react/SearchInput";
import "./SearchInput.css";

export default function SearchInput(props) {
    const { className, ...restProps } = props;
    return <EvSearchInput className={`evSearchInput-custom ${className ?? ''}`} {...restProps} />;
}
