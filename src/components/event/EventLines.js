import React, {useEffect, useState} from "react";
import {getBase, postBase} from "../../js/FetchBase";
import {toast} from "bulma-toast";
import {useHistory, useParams} from "react-router-dom";
import PageControls from "../util/PageControls";
import Spinner from "../util/Spinner";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faEdit} from "@fortawesome/free-solid-svg-icons";
import EventLineAssignOrganization from "./EventLineAssignOrganization";

const EventLines = () => {
    let {id} = useParams();
    const history = useHistory();

    const [eventLinesPage, setEventLinesPage] = useState({
        content: [],
        number: 0,
        first: true,
        last: false,
        totalPages: 0
    })
    const [loading, setLoading] = useState(true);
    const [activePage, setActivePage] = useState(0);
    const [assigningOrg, setAssigningOrg] = useState(false);

    async function fetchEventLines() {
        try {
            let result = await getBase("/line/event/" + id);
            setEventLinesPage(result)
            setLoading(false)
        } catch {
            toast({
                message: 'Something went wrong while trying to fetch open join requests',
                type: 'is-danger'
            })
        }
    }

    useEffect(() => {
        fetchEventLines();
    }, [activePage]);

    function onPageChange(e) {
        setActivePage(e);
        setLoading(true);
        fetchEventLines();
    }

    function assignOrganizationToLine(eventLine) {
        localStorage.setItem("event.line.assign", JSON.stringify(eventLine));
        setAssigningOrg(true);
    }

    const RenderEventLines = () => {
        if (loading) return <Spinner/>
        if (eventLinesPage.content.length === 0) return <div className="panel-block">No lines assigned to this
            event.</div>
        return <> {eventLinesPage.content.map(eventLine => <div className="panel-block columns" key={eventLine.id}>
                <div className="column">{eventLine.line.name}</div>
                <div className="column">Organization: {eventLine.organization === null ?
                    <span className="is-clickable" onClick={() => assignOrganizationToLine(eventLine)}>Unassigned
                        <span className="icon"><FontAwesomeIcon icon={faEdit}/></span>
                    </span>
                    : eventLine.organization.name}</div>
                <div className="column">People assigned: {eventLine.assignedUsers.length}</div>
            </div>
        )}
            <div className="control">
                <PageControls showButtons={true} pageSettings={eventLinesPage} changePage={(e) => onPageChange(e)}/>
            </div>
        </>
    }

    function assignOrganization(orgId, eventLineId) {
        postBase("/line/" + eventLineId + "/assign/organization", JSON.stringify({eventLineId: eventLineId, organizationId: orgId})).then(() => {
            setAssigningOrg(false)
            onPageChange(activePage)
        }).catch(() => {
            toast({
                message: 'Something went wrong while assigning organization',
                type: 'is-danger'
            })
        })
    }

    return <div className="panel">
        <div className={`panel-heading columns ${assigningOrg ? "is-hidden" : ""}`}>
            <div className="column"><h2 className="title is-3">Lines for this event</h2></div>
            <div className="column is-1">
                <button onClick={() => history.push("/venue/events/" + id + "/lines")}
                        className="button is-primary">Add
                </button>
            </div>
        </div>
        <div className={assigningOrg ? "" : "is-hidden"}><EventLineAssignOrganization assignOrg={(orgId, eventLineId) => {assignOrganization(orgId, eventLineId)}} cancel={() => {setAssigningOrg(false)}}/></div>
        <div className={assigningOrg ? "is-hidden" : ""}><RenderEventLines/></div>
    </div>
};

export default EventLines;