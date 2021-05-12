import {dateArrayToDate, getRelativeTime} from "../../js/DateTime";
import ReactTooltip from "react-tooltip";

const DateDiv = (props) => {
    const id = "date-div-" + Math.round(Math.random() * 100);

    return <div data-tip="" data-for={id}>
        {getRelativeTime(dateArrayToDate(props.date))}
        <ReactTooltip id={id} place="top" type="dark" effect="solid">
            {dateArrayToDate(props.date).toLocaleString()}
        </ReactTooltip>
    </div>
}

export default DateDiv