import React from 'react';
import {useHistory} from "react-router-dom";
import UserAssignedLines from "./UserAssignedLines";
import UserPreferences from "./UserPreferences";
import UnlockAccess from "../authentication/UnlockAccess";

const UserDetails = () => {
    const history = useHistory();
    const user = JSON.parse(localStorage.getItem("user"));

    return <div className="is-flex is-flex-direction-column is-align-self-center mx-4 mt-1">
        <h1 className="title is-1">{user.firstname} {user.lastname}</h1>
        <div className="columns">
            <div className="column">
                <button className="button" onClick={() => history.push("/user/join/organization")}>
                    Join Organization
                </button>
            </div>
            <UnlockAccess request={['ANY']}>
                <div className="column is-2">
                    <button className="button is-link" onClick={() => history.push("/venue/select")}>Select other venue
                        to manage
                    </button>
                </div>
            </UnlockAccess>
            <div className="column is-1">
                <button className="button is-warning" onClick={() => history.push("/user/inbox")}>Inbox</button>
            </div>
        </div>

        <UserPreferences/>
        <UnlockAccess request={['MEMBER']}>
            <section className="section">
                <UserAssignedLines/>
            </section>
        </UnlockAccess>
    </div>;

}

export default UserDetails