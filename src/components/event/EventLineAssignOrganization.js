import {getBase} from "../../js/FetchBase";
import {toast} from "bulma-toast";
import React from "react";
import PagedList from "../util/PagedList";

const EventLineAssignOrganization = (props) => {
    const eventLine = JSON.parse(localStorage.getItem("event.line.assign"));
    if (eventLine === undefined || eventLine === null) return "";

    const assignOrgFnc = props.assignOrg;

    async function fetchOrganizations(activePage) {
        try {
            return await getBase("/organization?page=" + activePage);
        } catch {
            toast({
                message: 'Something went wrong while trying to fetch organizations',
                type: 'is-danger'
            })
        }
    }

    const RenderOrganizationsList = (props) => {
        const org = props.data;

        return <div className="panel-block columns" key={org.id}>
            <div className="column">{org.name}</div>
            <div className="column is-1">
                <button className="button is-primary" onClick={() => assignOrgFnc(org.id, eventLine.id)}>Assign
                </button>
            </div>
        </div>

    }

    return <div>
        <div className="panel">
            <div className="panel-heading has-text-centered-mobile columns">
                <div className="column">
                    <h2 className="title is-3">Assign organization to line {eventLine.line.name}</h2>
                </div>
                <div className="column is-1">
                    <button onClick={() => props.cancel()} className="button">
                        Cancel
                    </button>
                </div>
            </div>

            <PagedList fetchDataFnc={fetchOrganizations} RenderListItem={RenderOrganizationsList}
                       IsEmptyComponent={() => <p>No organizations found!</p>}/>
        </div>
    </div>
}

export default EventLineAssignOrganization