import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faEdit} from "@fortawesome/free-solid-svg-icons";
import {useHistory} from "react-router-dom";
import DateDiv from "../util/DateDiv";

const VenueEvent = (props) => {
    const history = useHistory();

    return <>
        <div className="column"> {props.event.name}</div>
        <div className="column is-1">
            {props.event.eventStatus}
        </div>
        <div className="column is-2">
            <DateDiv date={props.event.date}/>
        </div>
        <div className="column is-1">
                <span className="icon is-clickable" onClick={() => history.push("/venue/events/" + props.event.id)}>
                    <FontAwesomeIcon icon={faEdit}/>
                </span>
        </div>
    </>
}

export default VenueEvent;