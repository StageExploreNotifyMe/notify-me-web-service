import {getBase} from "../../js/FetchBase";
import {getRelativeTime, dateArrayToDate} from "../../js/DateTime"
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
                message: 'Something went wrong while trying to fetch open join requests',
                type: 'is-danger'
            })
        }
    }

    useEffect(() => {
        fetchEvent();
    }, [loading]);

    if (loading) return <Spinner/>

    return <div>
        <section className="hero is-primary">
            <div className="hero-body">
                <p className="title">
                    {event.name}
                </p>
                <p className="subtitle">
                    {dateArrayToDate(event.date).toLocaleDateString()} {getRelativeTime(dateArrayToDate(event.date))}
                </p>
            </div>
        </section>
        <section>
            <EventLines/>
        </section>
    </div>
}

export default EventDetails