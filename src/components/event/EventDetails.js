import {getBase, postBase} from "../../js/FetchBase";
import {dateArrayToDate, getRelativeTime} from "../../js/DateTime"

import {useParams} from "react-router-dom";
import React, {useEffect, useState} from "react";
import Spinner from "../util/Spinner";
import EventLines from "./EventLines";
import UnlockAccess from "../authentication/UnlockAccess";
import {useSnackbar} from 'notistack';


const EventDetails = () => {
    let {id} = useParams();

    const [event, setEvent] = useState({})
    const [loading, setLoading] = useState(true);
    const {enqueueSnackbar} = useSnackbar();

    async function fetchEvent() {
        try {
            let result = await getBase("/event/" + id);
            setEvent(result)
            setLoading(false)
        } catch {
            enqueueSnackbar("Something went wrong while trying to fetch the details of this event", {
                variant: 'error',
            });
        }
    }

    useEffect(() => {
        fetchEvent();
    }, [loading]);

    function setEventState(state) {
        postBase("/event/" + event.id + "/" + state, {}).then(() => setLoading(true)).catch(() => {
            enqueueSnackbar("Something went wrong while trying to update the status of your event", {
                variant: 'error',
            });
        })
    }

    if (loading) return <Spinner/>

    return <article>
        <h1 className="is-hidden">Manage event</h1>
        <section className="hero is-primary">
            <div className="hero-body">
                <h1 className="title">
                    {event.name}
                </h1>
                <p className="subtitle">
                    {dateArrayToDate(event.date).toLocaleDateString()} {getRelativeTime(dateArrayToDate(event.date))}
                </p>
            </div>
        </section>
        <UnlockAccess request={['VENUE_MANAGER']}>
            <section className="section">
                <h2 className="title is-3">Change event status</h2>
                <div><p>{event.eventStatus}</p></div>
                <div className="buttons">
                    <button
                        className={`button ${event.eventStatus === "CREATED" || event.eventStatus === "PRIVATE" ? "is-hidden" : ""}`}
                        onClick={() => setEventState('private')}>Make Private
                    </button>
                    <button className={`button ${event.eventStatus === "PUBLIC" ? "is-hidden" : ""}`}
                            onClick={() => setEventState('publish')}>Make Public
                    </button>
                    <button className={`button is-danger ${event.eventStatus === "CANCELED" ? "is-hidden" : ""}`}
                            onClick={() => setEventState('cancel')}>Cancel
                    </button>
                </div>
            </section>
        </UnlockAccess>

        <section>
            <EventLines/>
        </section>
    </article>
}

export default EventDetails