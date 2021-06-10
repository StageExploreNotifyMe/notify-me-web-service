import {useHistory} from "react-router-dom";
import React from "react";
import {getBase} from "../../js/FetchBase";
import {toast} from "bulma-toast";
import PagedList from "../util/PagedList";
import VenueEvent from "./VenueEvent";
import UnlockAccess from "../authentication/UnlockAccess";

const EventManagement = () => {
    const venue = JSON.parse(localStorage.getItem("venue"));
    const history = useHistory();

    async function fetchPageData(activePage) {
        try {
            return await getBase("/event/venue/" + venue.id + "?page=" + activePage);
        } catch {
            toast({
                message: 'Something went wrong while trying to fetch events',
                type: 'is-danger'
            })
        }
    }

    const RenderEventItems = (props) => {
        let ev = props.data;
        return <div className="panel-block columns" key={ev.id}>
            <VenueEvent event={ev}/>
        </div>
    }

    const RenderNoEvents = () => {
        return <UnlockAccess request={['VENUE_MANAGER']}>
        <div className="panel-block">
            No events scheduled yet. Schedule an event now by clicking&nbsp;
            <span className="has-text-link is-clickable" onClick={() => history.push("/venue/events/create")}>
                here
            </span>
            !
        </div>
        </UnlockAccess>
    };

    return <div className="container mt-2">
        <div className="level">
            <div className="level-left"><h2 className="title is-2 level-item">Venue {venue.name}</h2></div>
            <div className="level-right">
                <UnlockAccess request={['VENUE_MANAGER']}>
                <button onClick={() => {
                    history.push("/venue/events/create")
                }} className="button is-link level-item">
                    Create Event
                </button>
                </UnlockAccess>
            </div>
        </div>
        <div className="panel">
            <div className="panel-heading has-text-centered-mobile">
                <h2 className="title is-3">Events</h2>
            </div>
            <PagedList fetchDataFnc={fetchPageData} RenderListItem={RenderEventItems}
                       IsEmptyComponent={RenderNoEvents}/>
        </div>
    </div>;
};

export default EventManagement