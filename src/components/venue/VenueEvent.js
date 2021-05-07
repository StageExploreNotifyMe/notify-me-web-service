import {dateArrayToDate, getRelativeTime} from "../../js/DateTime";
import ReactTooltip from "react-tooltip";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faEdit} from "@fortawesome/free-solid-svg-icons";
import {useHistory} from "react-router-dom";

const VenueEvent = (props) => {
    const history = useHistory();

    return <>
        <div className="column"> {props.event.name}</div>
        <div className="column is-1">
            {props.event.eventStatus}
        </div>
        <div className="column is-2" data-tip="" data-for={"event-date-" + props.event.id}>
            {getRelativeTime(dateArrayToDate(props.event.date))}
            <ReactTooltip id={"event-date-" + props.event.id} place="top" type="dark" effect="solid">
                {dateArrayToDate(props.event.date).toLocaleString()}
            </ReactTooltip>
        </div>
        <div className="column is-1">
                <span className="icon is-clickable" onClick={() => history.push("/venue/events/" + props.event.id)}>
                    <FontAwesomeIcon icon={faEdit}/>
                </span>
        </div>
    </>
}

export default VenueEvent;