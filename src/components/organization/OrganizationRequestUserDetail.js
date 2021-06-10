import React, {useState} from "react";
import {postBase} from "../../js/FetchBase";
import {toast} from "bulma-toast";
import Spinner from "../util/Spinner";
import {faBan, faCheck} from '@fortawesome/free-solid-svg-icons'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'

const OrganizationRequestUserDetail = (props) => {
    const [submitting, setSubmitting] = useState(false);
    const [chosenOption, setChosenOption] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    function confirmClicked(accepted) {
        let body = {
            userOrganizationId: props.request.id,
            accepted: accepted
        };
        setChosenOption(accepted)

        postBase("/userorganization/request/process", JSON.stringify(body)).then(() => {
            setSubmitted(true)
        }).catch(() => {
            toast({
                message: 'Something went wrong while trying to save changes for ' + props.request.user.firstname + ' ' + props.request.user.lastname,
                type: 'is-danger'
            })
            setSubmitting(false);
        })
    }

    const RenderRequestActions = () => {
        if (submitting) {
            return <div className="column is-2"><Spinner/></div>
        }
        if (submitted) {
            return <div className="column is-2">
                {
                    chosenOption ?
                        <span className="icon has-text-success"><FontAwesomeIcon icon={faCheck} /></span>
                        :
                        <span className="icon has-text-danger"><FontAwesomeIcon icon={faBan} /></span>
                }
            </div>
        }

        return <div className="column is-2">
            <button className="button is-success is-small ml-2" onClick={() => confirmClicked(true)}>Accept</button>
            <button className="button is-danger is-small ml-2" onClick={() => confirmClicked(false)}>Reject</button>
        </div>;
    }

    return <div className="panel-block columns" key={props.request.user.id}>
        <div className="column">{props.request.user.firstname} {props.request.user.lastname}</div>
        <RenderRequestActions/>
    </div>
}

export default OrganizationRequestUserDetail