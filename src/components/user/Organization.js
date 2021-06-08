import React, {useState} from 'react';
import {useSnackbar} from 'notistack';

const Organization = (props) => {

    const [joinedState, setJoinedState] = useState({
        joined: props.content.hasJoined,
        showConfirmButtons: false,
        disableCheckbox: (props.content.status === "PENDING" || props.content.status === "DECLINED")
    })
    const {enqueueSnackbar} = useSnackbar();

    function checkboxClicked(e) {
        let currVal = e.target.checked;
        setJoinedState(() => ({joined: currVal, showConfirmButtons: true}))
    }

    function confirmClicked(saved) {
        let joined = joinedState.joined;
        if (!saved) joined = !joined;
        setJoinedState(() => ({joined: joined, showConfirmButtons: false}))
        if (!saved) return;

        if (joined) {
            submitJoinRequest();
        } else {
            leaveOrganisation();
        }
    }

    function submitJoinRequest() {
        const requestOptions = {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({userId: localStorage.getItem('user.id'), organizationId: props.content.id})
        };

        fetch(process.env.REACT_APP_SERVER_URL + "/userorganization/request/join", requestOptions).then(resp => resp.json()).then(() => {
            enqueueSnackbar(`You've submitted a request to join ${props.content.name}!`, {
                variant: 'success',
            });
        }).catch(() => {
            setJoinedState((prev) => ({joined: !prev.joined, showConfirmButtons: false}))
            enqueueSnackbar('Something went wrong while trying to save your data', {
                variant: 'error',
            });
        })
    }

    function leaveOrganisation() {
        enqueueSnackbar('Not implemented yet!', {
            variant: 'error',
        });
    }

    return (
        <div className="panel-block">
            <div className="column">
                <input type="checkbox" disabled={joinedState.showConfirmButtons || joinedState.disableCheckbox}
                       checked={joinedState.joined} onChange={checkboxClicked}
                />
                {props.content.name}
            </div>
            <div
                className={(props.content.status === "PENDING" || props.content.status === "DECLINED") ? "column is-2" : "is-hidden"}>
                {props.content.status}
            </div>
            <div className={joinedState.showConfirmButtons ? "column is-2" : "is-hidden"}>
                <button className="button is-success is-small ml-2" onClick={() => confirmClicked(true)}>Save</button>
                <button className="button is-danger is-small ml-2" onClick={() => confirmClicked(false)}>Cancel</button>
            </div>

        </div>
    )
}

export default Organization