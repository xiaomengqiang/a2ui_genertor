import EvSteps from "@nce/eview-react/Steps";
import './Steps.css';

// 包壳 Steps：透明转发 @nce/eview-react/Steps，扩展两个能力——
//   1. className 挂在外层 div 上（尺寸类名 ev_wizard_container_xs/sm/lg，样式见同目录 Steps.css）
//   2. type="dot" 开启实心圆点模式（挂 ev_wizard_dot 类）；小尺寸（xs）默认即 dot 模式
export default function Steps(props) {
    const { className, style, type, ...rest } = props
    const isDot = type === "dot" || /(^|\s)ev_wizard_container_xs(\s|$)/.test(className ?? "")

    return (<div className={`evSteps-custom ${isDot ? "ev_wizard_dot " : ""}${className ?? ""}`} style={style ?? {}}>
        <EvSteps  {...rest} />
    </div>
    )
}
