import {useHistory} from "react-router-dom";
import React, {useEffect, useState} from "react";
import {getBase} from "../../js/FetchBase";
import {toast} from "bulma-toast";
import Spinner from "../util/Spinner";
import PageControls from "../util/PageControls";
import ReactTooltip from 'react-tooltip';
import {dateArrayToDate, getRelativeTime} from "../../js/DateTime";
import {faEdit} from '@fortawesome/free-solid-svg-icons'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'

const EventManagement = () => {
    const venue = JSON.parse(localStorage.getItem("venue"));
    const history = useHistory();

    const [eventPage, setEventPage] = useState({
        content: [],
        number: 0,
        first: true,
        last: false,
        totalPages: 0
    })
    const [loading, setLoading] = useState(true);
    const [activePage, setActivePage] = useState(0);

    async function fetchEvents() {
        try {
            let result = await getBase("/event/venue/" + venue.id + "?page=" + activePage);
            setEventPage(result)
            setLoading(false)
        } catch {
            toast({
                message: 'Something went wrong while trying to fetch open join requests',
                type: 'is-danger'
            })
        }
    }

    useEffect(() => {
        fetchEvents();
    }, [activePage]);

    function onPageChange(e) {
        setActivePage(e);
        setLoading(true);
        fetchEvents();
    }

    const RenderEventsList = () => {
        if (loading) return <Spinner/>
        if (eventPage.content.length === 0) return <div className="panel-block">No events scheduled yet. Schedule an
            event now by clicking&nbsp;<span className="has-text-link is-clickable"
                                             onClick={() => history.push("/venue/events/create")}>here</span>!</div>
        return eventPage.content.map(ev => <div className="panel-block columns" key={ev.id}>
            <div className="column"> {ev.name}</div>

            <div className="column is-2" data-tip="" data-for={"event-date-" + ev.id}>
                {getRelativeTime(dateArrayToDate(ev.date))}
                <ReactTooltip id={"event-date-" + ev.id} place="top" type="dark" effect="solid">
                    {dateArrayToDate(ev.date).toLocaleString()}
                </ReactTooltip>
            </div>
            <div className="column is-1">
                <span className="icon is-clickable" onClick={() => history.push("/venue/events/" + ev.id)}>
                    <FontAwesomeIcon icon={faEdit}/>
                </span>
            </div>
        </div>);
    }

    return <div className="container mt-2">
        <div className="level">
            <div className="level-left"><h2 className="title is-2 level-item">Venue {venue.name}</h2></div>
            <div className="level-right">
                <button onClick={() => {
                    history.push("/venue/events/create")
                }} className="button is-link level-item">Create Event
                </button>
            </div>
        </div>
        <div className="panel">
            <div className="panel-heading has-text-centered-mobile">
                <h2 className="title is-3">Events</h2>
            </div>
            <RenderEventsList/>
            {
                eventPage.content.length === 0 ? "" :
                    <div className="control">
                        <PageControls showButtons={true} pageSettings={eventPage} changePage={(e) => onPageChange(e)}/>
                    </div>
            }
        </div>
    </div>;
}

export default EventManagement