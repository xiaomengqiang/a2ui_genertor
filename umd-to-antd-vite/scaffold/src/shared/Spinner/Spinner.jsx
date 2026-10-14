import EvSpinner from "@nce/eview-react/Spinner";
import './Spinner.css';

export default function Spinner(props) {
    const { className, style, ...rest } = props

    return (<div className={`evSpinner-custom ${className ?? ""}`} style={style ?? {}}>
        <EvSpinner  {...rest} />
    </div>
    )
}
