import {useHistory} from "react-router-dom";
import {getBase} from "../../js/FetchBase";

import React from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faEdit} from "@fortawesome/free-solid-svg-icons";
import PagedList from "../util/PagedList";
import DateDiv from "../util/DateDiv";
import {useSnackbar} from "notistack";
import {Tooltip} from "@material-ui/core";

const OrganizationLines = () => {
    const org = JSON.parse(localStorage.getItem("organization"));
    const id = org.id;
    const history = useHistory();
    const {enqueueSnackbar} = useSnackbar();

    async function fetchData(activePage) {
        try {
            return await getBase("/line/organization/" + id + "?page=" + activePage);
        } catch {
            enqueueSnackbar('Something went wrong while trying to fetch the lines your organization was assigned to', {
                variant: 'error',
            });
        }
    }

    function assignLine(line) {
        localStorage.setItem("organization.memberassignment.line", JSON.stringify(line));
        history.push("/organization/memberassignment/assign")
    }

    const RenderJoinRequests = (props) => {
        const line = props.data;

        return <div className="columns panel-block" key={props.key}>
            <div className="column is-2">{line.event.name}</div>
            <div className="column is-2">
                <Tooltip title={<span>{line.line.description}</span>}>
                    <span>{line.line.name}</span>
                </Tooltip>
            </div>
            <div className="column is-2"><DateDiv date={line.event.date}/></div>
            <div className="column is-3" data-tip="" data-for={"line-staffing-%-" + props.key}>
                <Tooltip title={<span>{line.assignedUsers.length}/{line.line.numberOfRequiredPeople}</span>}>
                    <span>{Math.round((line.assignedUsers.length / line.line.numberOfRequiredPeople) * 100)}%</span>
                </Tooltip>
            </div>
            <div className="column is-2">
                <span className="is-clickable" onClick={() => assignLine(line)}>
                    <span className="icon"><FontAwesomeIcon icon={faEdit}/></span>
                </span>
            </div>
        </div>;
    }

    return <div className="is-flex is-flex-direction-column is-align-self-center mx-4 mt-1">
        <h2 className="title is-2">Manage lines</h2>
        <div className="panel">
            <div className="panel-heading has-text-centered-mobile">
                <div className="columns panel-block is-active">
                    <p className="column is-2"><span className="title is-4">Event</span></p>
                    <p className="column is-2"><span className="title is-4">Line</span></p>
                    <p className="column is-2"><span className="title is-4">Date</span></p>
                    <p className="column is-3"><span className="title is-4">Current assigned members</span></p>
                    <p className="column is-2"><span className="title is-4">Assign Member</span></p>
                </div>
            </div>
            <PagedList fetchDataFnc={fetchData} RenderListItem={RenderJoinRequests}
                       IsEmptyComponent={() => <p>No lines assigned to your organization</p>}/>
        </div>
    </div>
};

export default OrganizationLines