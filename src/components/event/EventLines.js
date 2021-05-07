import React, {useState} from "react";
import {getBase, postBase} from "../../js/FetchBase";
import {toast} from "bulma-toast";
import {useHistory, useParams} from "react-router-dom";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faEdit} from "@fortawesome/free-solid-svg-icons";
import EventLineAssignOrganization from "./EventLineAssignOrganization";
import PagedList from "../util/PagedList";

const EventLines = () => {
    let {id} = useParams();
    const history = useHistory();
    let forceUpdateFnc = null;

    const [assigningOrg, setAssigningOrg] = useState(false);

    async function fetchEventLines() {
        try {
            return await getBase("/line/event/" + id);
        } catch {
            toast({
                message: 'Something went wrong while trying to fetch open join requests',
                type: 'is-danger'
            })
        }
    }

    function assignOrganizationToLine(eventLine) {
        localStorage.setItem("event.line.assign", JSON.stringify(eventLine));
        setAssigningOrg(true);
    }

    const RenderEventLines = (props) => {
        const eventLine = props.data;
        forceUpdateFnc = props.update;
        return <div className="panel-block columns" key={eventLine.id}>
            <div className="column">{eventLine.line.name}</div>
            <div className="column">Organization: {eventLine.organization === null ?
                <span className="is-clickable" onClick={() => assignOrganizationToLine(eventLine)}>Unassigned
                        <span className="icon"><FontAwesomeIcon icon={faEdit}/></span>
                    </span>
                : eventLine.organization.name}</div>
            <div className="column">People assigned: {eventLine.assignedUsers.length}</div>
        </div>
    }

    function assignOrganization(orgId, eventLineId) {
        postBase("/line/" + eventLineId + "/assign/organization", JSON.stringify({
            eventLineId: eventLineId,
            organizationId: orgId
        })).then(() => {
            setAssigningOrg(false)
            forceUpdateFnc();
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
        <div className={assigningOrg ? "" : "is-hidden"}>
            <EventLineAssignOrganization
                assignOrg={(orgId, eventLineId) => {
                    assignOrganization(orgId, eventLineId)
                }}
                cancel={() => {
                    setAssigningOrg(false)
                }}
            />
        </div>
        <div className={assigningOrg ? "is-hidden" : ""}>
            <PagedList fetchDataFnc={fetchEventLines} RenderListItem={RenderEventLines}
                       IsEmptyComponent={() => <p>No lines assigned to this event.</p>}/>
        </div>
    </div>
};

export default EventLines;