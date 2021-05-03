import {getBase} from "../../js/FetchBase";
import {toast} from "bulma-toast";
import React, {useEffect, useState} from "react";
import PageControls from "../util/PageControls";
import Spinner from "../util/Spinner";

const EventLineAssignOrganization = (props) => {
    const [organizationsPage, setOrganizationsPage] = useState({
        content: [],
        number: 0,
        first: true,
        last: false,
        totalPages: 0
    })
    const [loading, setLoading] = useState(true);
    const [activePage, setActivePage] = useState(0);

    useEffect(() => {
        fetchOrganizations();
    }, [activePage]);

    const eventLine = JSON.parse(localStorage.getItem("event.line.assign"));
    if (eventLine === undefined || eventLine === null) return "";

    async function fetchOrganizations() {
        try {
            let result = await getBase("/organization?page=" + activePage);
            setOrganizationsPage(result)
            setLoading(false)
        } catch {
            toast({
                message: 'Something went wrong while trying to fetch organizations',
                type: 'is-danger'
            })
        }
    }

    function onPageChange(e) {
        setActivePage(e);
        setLoading(true);
        fetchOrganizations();
    }

    const RenderOrganizationsList = () => {
        if (loading) return <Spinner/>
        if (organizationsPage.content.length === 0) return <div className="panel-block">No organizations found!</div>
        return organizationsPage.content.map(org => {
            return <div className="panel-block columns" key={org.id}>
                <div className="column">{org.name}</div>
                <div className="column is-1"><button className="button is-primary" onClick={() => props.assignOrg(org.id, eventLine.id)}>Assign</button></div>
            </div>
        });
    }

    return <div>
        <div className="panel">
            <div className="panel-heading has-text-centered-mobile columns">
                <div className="column">
                    <h2 className="title is-3">Assign organization to line {eventLine.line.name}</h2>
                </div>
                <div className="column is-1">
                    <button onClick={() =>props.cancel()} className="button">
                        Cancel
                    </button>
                </div>
            </div>

            <RenderOrganizationsList/>
            {
                organizationsPage.content.length === 0 ? "" :
                    <div className="control">
                        <PageControls showButtons={true} pageSettings={organizationsPage}
                                      changePage={(e) => onPageChange(e)}/>
                    </div>
            }
        </div>
    </div>
}

export default EventLineAssignOrganization