import EvCrumbs from "@nce/eview-react/Crumbs";
import "./Crumbs.css";

export default function Crumbs(props) {
    const { className, ...restProps } = props;
    return <EvCrumbs className={`evCrumbs-custom ${className ?? ''}`} {...restProps} />;
}
