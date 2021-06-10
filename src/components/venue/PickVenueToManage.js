import PagedList from "../util/PagedList";
import React from "react";
import {getBase} from "../../js/FetchBase";

import {useHistory} from "react-router-dom";
import {useSnackbar} from "notistack";

const PickVenueToManage = () => {

    const history = useHistory();
    const {enqueueSnackbar} = useSnackbar();

    async function fetchPageData(activePage) {
        try {
            return await getBase("/venue/" + localStorage.getItem("user.id") + "?page=" + activePage);
        } catch {
            enqueueSnackbar('Something went wrong while trying to fetch all the venues you are a part of', {
                variant: 'error',
            });
        }
    }

    function onVenueManageClick(venue) {
        localStorage.setItem("venue", JSON.stringify(venue));
        history.push("/");
    }

    const RenderVenues = (props) => {
        let ev = props.data;
        return <div className="panel-block columns" key={ev.id}>
            <div className="column">{ev.name}</div>
            <div className="column is-3">
                <button className="button is-primary" onClick={() => onVenueManageClick(ev)}>Manage this venue</button>
            </div>
        </div>
    }

    return <article className="container mt-2">
        <section className="level">
            <div className="level-left"><h2 className="title is-2 level-item">
                Please select which venue you'd like to manage now:
            </h2></div>
        </section>
        <section className="panel">
            <div className="panel-heading has-text-centered-mobile">
                <h2 className="title is-3">Venues</h2>
            </div>
            <PagedList fetchDataFnc={fetchPageData} RenderListItem={RenderVenues}
                       IsEmptyComponent={() => <p>Something went wrong, you appear to not be a part of any venue</p>}/>
        </section>
    </article>
};

export default PickVenueToManage;