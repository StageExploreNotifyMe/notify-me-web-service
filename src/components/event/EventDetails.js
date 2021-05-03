import {getBase, postBase} from "../../js/FetchBase";
import {dateArrayToDate, getRelativeTime} from "../../js/DateTime"
import {toast} from "bulma-toast";
import {useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import Spinner from "../util/Spinner";
import EventLines from "./EventLines";


const EventDetails = () => {
    let {id} = useParams();

    const [event, setEvent] = useState({})
    const [loading, setLoading] = useState(true);

    async function fetchEvent() {
        try {
            let result = await getBase("/event/" + id);
            setEvent(result)
            setLoading(false)
        } catch {
            toast({
                message: 'Something went wrong while trying to fetch the details of this event',
                type: 'is-danger'
            })
        }
    }

    useEffect(() => {
        fetchEvent();
    }, [loading]);

    function setEventState(state) {
        postBase("/event/" + event.id + "/" + state, {}).then(() => setLoading(true)).catch(() => {
            toast({
                message: 'Something went wrong while trying to update the status of your event',
                type: 'is-danger'
            })
        })
    }

    if (loading) return <Spinner/>

    return <div>
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
        <section className="section">
            <h2 className="title is-3">Change event status</h2>
            <div><p>{event.eventStatus}</p></div>
            <div className="buttons">
                <button className={`button ${event.eventStatus === "CREATED" ? "is-hidden" : ""}`}
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

        <section>
            <EventLines/>
        </section>
    </div>
}

export default EventDetails