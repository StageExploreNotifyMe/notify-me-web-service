import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faEdit} from "@fortawesome/free-solid-svg-icons";
import {useHistory} from "react-router-dom";
import DateDiv from "../util/DateDiv";
import {TableCell, TableRow} from "@material-ui/core";
import React from "react";
import {makeStyles} from "@material-ui/styles";
import {isClickable} from "../../style/StyleUtils";

const VenueEvent = (props) => {
    const history = useHistory();
    const classes = useStyles();

    function navigateToEvent(event) {
        localStorage.setItem("currentEvent", JSON.stringify(event));
        history.push("/venue/event")
    }

    return <TableRow>
        <TableCell className="column"> {props.event.name}</TableCell>
        <TableCell className="column is-1">
            {props.event.eventStatus}
        </TableCell>
        <TableCell className="column is-2">
            <DateDiv date={props.event.date}/>
        </TableCell>
        <TableCell width={100} align="center">
                <span className={classes.clickable} onClick={() => navigateToEvent(props.event)}>
                    <FontAwesomeIcon icon={faEdit}/>
                </span>
        </TableCell>
    </TableRow>
}

const useStyles = makeStyles((theme) => ({
    clickable: {...isClickable}
}));

export default VenueEvent;