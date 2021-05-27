import PagedList from "../util/PagedList";
import React from "react";
import {useHistory} from "react-router-dom";
import {getBase} from "../../js/FetchBase";
import {toast} from "bulma-toast";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faEdit} from "@fortawesome/free-solid-svg-icons";

const AdminVenueManagement = () => {

    const history = useHistory();
    const createVenueLink = "/admin/venue/create";

    async function fetchPageData(activePage) {
        try {
            return await getBase("/admin/venue?page=" + activePage);
        } catch {
            toast({
                message: 'Something went wrong while trying to fetch venues',
                type: 'is-danger'
            })
        }
    }

    const RenderVenues = (props) => {
        let venue = props.data;
        return <div className="panel-block columns" key={venue.id}>
            <div className="column"> {venue.name}</div>
            <div className="column is-1">
                <span className="icon is-clickable" onClick={() => {
                    localStorage.setItem("editVenue", JSON.stringify(venue));
                    history.push("/admin/venue/edit")
                }}>
                    <FontAwesomeIcon icon={faEdit}/>
                </span>
            </div>
        </div>
    }

    const RenderNoVenues = () => {
        return <div className="panel-block">
            No venues known in the system yet. Create the first one now by clicking&nbsp;
            <span className="has-text-link is-clickable" onClick={() => history.push(createVenueLink)}>
                here
            </span>
            !
        </div>
    };


    return <div className="container mt-2">
        <div className="level">
            <div className="level-left"><h2 className="title is-2 level-item">Venue Management</h2></div>
            <div className="level-right">
                <button onClick={() => {
                    history.push(createVenueLink)
                }} className="button is-link level-item">
                    Create venue
                </button>
            </div>
        </div>
        <div className="panel">
            <div className="panel-heading has-text-centered-mobile">
                <h2 className="title is-3">Venues</h2>
            </div>
            <PagedList fetchDataFnc={fetchPageData} RenderListItem={RenderVenues}
                       IsEmptyComponent={RenderNoVenues}/>
        </div>
    </div>;
};

export default AdminVenueManagement