import React, {useState} from "react";
import {getBase, postBase} from "../../js/FetchBase";

import {useHistory, useParams} from "react-router-dom";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faEdit} from "@fortawesome/free-solid-svg-icons";
import EventLineAssignOrganization from "./EventLineAssignOrganization";
import PagedList from "../util/PagedList";
import {useSnackbar} from 'notistack';

const EventLines = () => {
    let {id} = useParams();
    const {enqueueSnackbar} = useSnackbar();
    const history = useHistory();
    let forceUpdateFnc = null;

    const [assigningOrg, setAssigningOrg] = useState(false);
    const [modal, setModal] = useState({
        isActive: false,
        eventLine: {organization: {name: ""}}
    });
    const [staffingReminderText, setStaffingReminderText] = useState("");

    async function fetchEventLines() {
        try {
            return await getBase("/line/event/" + id);
        } catch {
            enqueueSnackbar("Something went wrong while trying to fetch open join requests", {
                variant: 'error',
            });
        }
    }

    function assignOrganizationToLine(eventLine) {
        localStorage.setItem("event.line.assign", JSON.stringify(eventLine));
        setAssigningOrg(true);
    }

    function setEventLineState(eventLine) {
        postBase("/line/" + eventLine.id + "/cancel", {}).then(() => forceUpdateFnc()).catch(() => {
            enqueueSnackbar("Something went wrong while trying to cancel the eventLine", {
                variant: 'error',
            });
        })
    }

    function openModal(eventLine) {
        setModal({eventLine: eventLine, isActive: true});
    }

    const RenderEventLines = (props) => {
        const eventLine = props.data;
        forceUpdateFnc = props.update;

        if (eventLine.eventLineStatus === "CANCELED") return "";

        return <div className="panel-block columns" key={eventLine.id}>
            <div className="column is-3">{eventLine.line.name}</div>
            <div className="column is-3">Organization: {eventLine.organization === null ?
                <span className="is-clickable" onClick={() => assignOrganizationToLine(eventLine)}>Unassigned
                        <span className="icon"><FontAwesomeIcon icon={faEdit}/></span>
                    </span>
                : eventLine.organization.name}</div>
            <div className="column is-2">People assigned: {eventLine.assignedUsers.length}</div>
            <div className="column is-4">
                <button className="button is-primary mr-1" onClick={() => openModal(eventLine)}>Send staffing
                    reminder
                </button>
                <button className="button is-danger" onClick={() => setEventLineState(eventLine)}>Cancel</button>
            </div>
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
            enqueueSnackbar("Something went wrong while assigning organization", {
                variant: 'error',
            });
        })
    }

    function closeModal() {
        setModal(() => ({isActive: false, eventLine: {organization: {name: ""}}}))
    }

    function sendReminder() {
        let customText = null;
        if (staffingReminderText !== "") customText = staffingReminderText;

        postBase("/line/" + modal.eventLine.id + "/staffingreminder", JSON.stringify({
            eventLineId: modal.eventLine.id,
            customText: customText
        })).then(() => {
            enqueueSnackbar("The reminder has been sent", {
                variant: "success"
            });
        }).catch(() => {
            enqueueSnackbar("Something went wrong while trying to send your reminder", {
                variant: 'error',
            });
        });
        closeModal();
    }

    return <>
        <div className={`modal ${modal.isActive ? "is-active" : ""}`}>
            <div className="modal-background"
                 onClick={() => closeModal()}/>
            <div className="modal-content">
                <div className="card">
                    <div className="card-header"><h2 className="title is-3 p-2">Send reminder
                        to {modal.eventLine.organization.name} to continue staffing</h2></div>
                    <div className="card-content">
                        <h3>Custom message:</h3>
                        <div>
                            <p>Enter a custom message or leave blank if you want to send the default reminder.</p>
                            <textarea className="textarea" value={staffingReminderText}
                                      onChange={(e) => setStaffingReminderText(e.target.value)}/>
                        </div>
                    </div>
                    <div className="card-footer p-1">
                        <button className="card-footer-item button is-danger mr-1" onClick={() => sendReminder()}>
                            Send
                        </button>
                        <button className="card-footer-item button is-primary" onClick={() => closeModal()}>
                            Cancel
                        </button>
                    </div>
                </div>
            </div>
            <button className="modal-close is-large" aria-label="close"
                    onClick={() => closeModal()}/>
        </div>
        <div className="panel">
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
    </>
};

export default EventLines;