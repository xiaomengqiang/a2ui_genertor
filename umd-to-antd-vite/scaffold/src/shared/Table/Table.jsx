import EvTable from "@nce/eview-react/Table";
import { useRef, useLayoutEffect } from "react";
import './Table.css'

const SIZE_MAP = {
    large: 40,
    middle: 32,
    small: 28
}

export default function Table(props) {
    const { className, size = 'large', ...rest } = props
    const tableRef = useRef(null)

    useLayoutEffect(() => {
        if (tableRef.current) {
            tableRef.current.setState({ trHeight: SIZE_MAP[size] ?? SIZE_MAP.large })
        }
    }, [size])

    return <EvTable ref={tableRef} className={`evTable-custom ${size} ${className ?? ""}`} {...rest} />
}
