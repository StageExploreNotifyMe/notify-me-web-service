import React from "react";
import {postBase} from "../../js/fetch/FetchBase";

const OrganizationRequestUserDetail = (props) => {

    function confirmClicked(accepted) {
        let body = {
            userOrganizationId: props.request.id,
            accepted: accepted
        };
        console.log(body);
        postBase("/userorganisation/request/process", JSON.stringify(body)).then(() => {
            console.log("success")
        }).catch((e) => {
            console.error("failed")
            console.error(e)
        })
    }

    return <div className="panel-block columns" key={props.request.user.id}>
        <div className="column">{props.request.user.firstname} {props.request.user.lastname}</div>
        <div className="column is-2">
            <button className="button is-success is-small ml-2" onClick={() => confirmClicked(true)}>Accept</button>
            <button className="button is-danger is-small ml-2" onClick={() => confirmClicked(false)}>Reject</button>
        </div>

    </div>
}

export default OrganizationRequestUserDetail