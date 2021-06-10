import React from "react";
import {getBase, postBase} from "../../js/FetchBase";

import {dateArrayToDate} from "../../js/DateTime";
import PagedList from "../util/PagedList";
import {useSnackbar} from 'notistack';

const UserAssignedLines = () => {
    let userId = localStorage.getItem("user.id");
    const {enqueueSnackbar} = useSnackbar();

    async function fetchUserLines(activePage) {
        try {
            return await getBase("/user/" + userId + "/lines?page=" + activePage);
        } catch {
            enqueueSnackbar("Something went wrong while trying to fetch the lines you were assigned to", {
                variant: 'error',
            });
        }
    }

    function cancelAttendance(line, forceUpdateFnc) {
        let body = {eventLineId: line.id, memberId: userId};
        postBase("/line/" + line.id + "/cancel/member", JSON.stringify(body)).then(() => forceUpdateFnc()).catch(() =>
            enqueueSnackbar("Something went wrong while trying to cancel your attendance", {
                variant: "error"
            })
        )
    }

    const RenderNoContent = () => {
        return <div className="panel-block">
            You currently have no lines assigned to you.
        </div>
    }

    const RenderVenueLines = (props) => {
        const line = props.data;
        const eventDate = dateArrayToDate(line.event.date);
        return <div className="panel-block columns" key={line.id}>
            <p className="column">{line.event.name} {line.line.name} </p>
            <p className="column">{eventDate.toLocaleTimeString()} {eventDate.toLocaleDateString()}</p>
            <p className="column is-2">
                <button className="button is-danger" onClick={() => cancelAttendance(line, props.update)}>
                    Cancel attendance
                </button>
            </p>
        </div>
    }

    return <>
        <h2 className="title is-3">Your assigned lines:</h2>
        <PagedList fetchDataFnc={fetchUserLines} RenderListItem={RenderVenueLines} IsEmptyComponent={RenderNoContent}/>
    </>
}

export default UserAssignedLines