import EvAccordion from "@nce/eview-react/Accordion";
import "./Accordion.css";

export default function Accordion(props) {
    const { className, ...restProps } = props;
    return <EvAccordion className={`evAccordion-custom ${className ?? ''}`} {...restProps} />;
}
