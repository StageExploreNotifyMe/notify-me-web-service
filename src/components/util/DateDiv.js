import {dateArrayToDate, getRelativeTime} from "../../js/DateTime";
import {Tooltip} from "@material-ui/core";

const DateDiv = (props) => {
    return <>
        <Tooltip title={<span>{dateArrayToDate(props.date).toLocaleString()}</span>}>
            <span>{getRelativeTime(dateArrayToDate(props.date))}</span>
        </Tooltip>
    </>
}

export default DateDiv