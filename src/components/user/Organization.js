import React, {useState} from 'react';
import {toast} from 'bulma-toast';

const Organization = (props) => {

    const [joinedState, setJoinedState] = useState({joined: props.content.hasJoined, showConfirmButtons: false})

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
            body: JSON.stringify({user: {id: localStorage.getItem('user.id')}, organization: {id: props.content.id}})
        };

        fetch(process.env.REACT_APP_SERVER_URL + "/userorganization/request/join", requestOptions).then(resp => resp.json()).then(() => {
            toast({
                message: `You've submitted a request to join ${props.content.name}!`,
                type: 'is-success',
            })
        }).catch(() => {
            setJoinedState((prev) => ({joined: !prev.joined, showConfirmButtons: false}))
            toast({
                message: 'Something went wrong while trying to save your data',
                type: 'is-danger'
            })
        })
    }

    function leaveOrganisation() {
        toast({
            message: 'Not implemented yet!',
            type: 'is-danger'
        })
    }

    return (
        <label className="panel-block">
            <div className="column">
                <input type="checkbox" disabled={joinedState.showConfirmButtons} checked={joinedState.joined}
                       onChange={checkboxClicked}/>
                {props.content.name}
            </div>

            <div className={joinedState.showConfirmButtons ? "column is-2" : "is-hidden"}>
                <button className="button is-success is-small ml-2" onClick={() => confirmClicked(true)}>Save</button>
                <button className="button is-danger is-small ml-2" onClick={() => confirmClicked(false)}>Cancel</button>
            </div>

        </label>
    )
}

export default Organization