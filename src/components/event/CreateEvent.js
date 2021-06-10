import {useHistory} from "react-router-dom";
import React, {useState} from "react";
import {postBase} from "../../js/FetchBase";
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faExclamationTriangle} from '@fortawesome/free-solid-svg-icons'
import {useSnackbar} from 'notistack';

const CreateEvent = () => {
    const {enqueueSnackbar} = useSnackbar();
    const history = useHistory();
    const venue = JSON.parse(localStorage.getItem("venue"));

    let now = new Date()
    now.setUTCHours(now.getHours())

    const [eventDto, setEventDto] = useState({
        eventDateTime: now,
        eventDate: now.toISOString().split('T')[0],
        eventTime: now.toISOString().split('T')[1].substr(0, 5),
        name: "",
        venueId: venue.id
    })
    const [validationState, setValidationState] = useState({
        dateInpast: false,
        noName: false
    })
    const [snackBarState, setSnackBarState] = useState({isOpen: false, text: "", severity: "error"})

    function submitEvent(e) {
        e.preventDefault();

        if (eventDto.name === "") {
            setValidationState(prevState => ({
                ...prevState,
                noName: true
            }))
        }
        setDateTime(eventDto.eventDate, true)

        if (validationState.noName || validationState.dateInpast) return;

        let eventDateTime = eventDto.eventDateTime;
        eventDateTime.setUTCHours(eventDateTime.getHours())

        postBase("/event", JSON.stringify({
            name: eventDto.name,
            venueId: eventDto.venueId,
            eventDateTime: eventDateTime
        })).then(() => {
            history.push("/venue/events");
        }).catch(() => {
            enqueueSnackbar("Something went wrong while trying to create your event", {
                variant: 'error',
            });
        })
    }

    function setDateTime(value, isDate) {
        let rawDate = eventDto.eventDate;
        let time = eventDto.eventTime
        if (isDate) {
            rawDate = value
        } else {
            time = value
        }
        let date = new Date(rawDate);
        let dateTime = new Date(date.getFullYear(), date.getMonth(), date.getDate(), parseInt(time.split(':')[0]), parseInt(time.split(':')[1]));

        setEventDto(prevState => ({
            ...prevState,
            eventDate: rawDate,
            eventTime: time,
            eventDateTime: dateTime
        }))
        let dateInPast = dateTime < new Date();
        setValidationState(prevState => ({
            ...prevState,
            dateInpast: dateInPast
        }))
    }

    return <div className="container mt-2">
        <div className="level">
            <div className="level-left"><h2 className="title is-2 level-item">Create Event</h2></div>
        </div>
        <form>
            <div className="field">
                <label className="label">Name</label>
                <div className={`control ${validationState.noName ? 'has-icons-right' : ''}`}>
                    <input className={`input ${validationState.noName ? 'is-danger' : ''}`} type="text"
                           placeholder="Name of the event" value={eventDto.name}
                           onChange={e => {
                               setEventDto(prevState => ({
                                   ...prevState,
                                   name: e.target.value
                               }))
                               setValidationState(prevState => ({
                                   ...prevState,
                                   noName: e.target.value === ""
                               }))
                           }}/>
                    <span
                        className={`icon is-small is-right ${validationState.noName ? '' : 'is-hidden'}`}>
                            <FontAwesomeIcon icon={faExclamationTriangle}/>
                        </span>
                    <p className={`help is-danger ${validationState.noName ? '' : 'is-hidden'}`}>An event must have a
                        name</p>
                </div>
            </div>

            <div className="field columns">
                <div className="field column is-12-mobile">
                    <label className="label">Event Date</label>
                    <div className={`control ${validationState.dateInpast ? 'has-icons-right' : ''}`}>
                        <input className={`input ${validationState.dateInpast ? 'is-danger' : ''}`} type="date"
                               placeholder="Time of the event"
                               value={eventDto.eventDate} onChange={e => {
                            setDateTime(e.target.value, true)
                        }}/>
                        <span
                            className={`icon is-small is-right ${validationState.dateInpast ? '' : 'is-hidden'}`}>
                            <FontAwesomeIcon icon={faExclamationTriangle}/>
                        </span>
                        <p className={`help is-danger ${validationState.dateInpast ? '' : 'is-hidden'}`}>An event cannot
                            be planned in the past</p>
                    </div>
                </div>

                <div className="field column is-12-mobile">
                    <label className="label">Event Time</label>
                    <div className={`control ${validationState.dateInpast ? 'has-icons-right' : ''}`}>
                        <input className={`input ${validationState.dateInpast ? 'is-danger' : ''}`} type="time"
                               placeholder="Time of the event"
                               value={eventDto.eventTime} onChange={e => {
                            setDateTime(e.target.value, false)
                        }}/>
                        <span
                            className={`icon is-small is-right ${validationState.dateInpast ? '' : 'is-hidden'}`}>
                            <FontAwesomeIcon icon={faExclamationTriangle}/>
                        </span>
                    </div>
                </div>
            </div>

            <div className="field is-grouped">
                <div className="control">
                    <button onClick={(e) => submitEvent(e)} className="button is-link"
                            disabled={validationState.dateInpast || validationState.noName}>Submit
                    </button>
                </div>
                <div className="control">
                    <button onClick={() => history.goBack()} className="button is-link is-light">Cancel</button>
                </div>
            </div>
        </form>
    </div>;
}

export default CreateEvent