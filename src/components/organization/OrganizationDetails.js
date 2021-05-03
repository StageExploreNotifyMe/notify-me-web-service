import {useHistory, useParams} from "react-router-dom";

import React, {useEffect, useState} from 'react';
import {getBase} from "../../js/FetchBase";
import {toast} from "bulma-toast";

import Spinner from "../util/Spinner";

const OrganizationDetails = () => {
    let {id} = useParams();
    const history = useHistory();

    const [organizationState, setOrganizationState] = useState(null)

    async function fetchOrganizationData() {
        try {
            let result = await getBase("/organization/" + id);
            setOrganizationState(result);
        } catch {
            toast({
                message: 'Something went wrong while trying to fetch the organization data',
                type: 'is-danger'
            })
        }
    }

    useEffect(() => {
        fetchOrganizationData();
    }, []);

    if (organizationState === null) {
        return <div className="is-flex is-flex-direction-column is-align-self-center mx-4 mt-1">
            <Spinner/>
        </div>;
    }

    const JoinRequestsCard = () => {
        return (<div className="card">
            <header className="card-header">
                <p className="card-header-title">Join Requests</p>
            </header>
            <div className="card-content">
                See all the pending join requests for your organization
            </div>
            <footer className="card-footer">
                <button className="card-footer-item button is-link"
                   onClick={(e) => {
                       e.preventDefault();
                       history.push("/organization/" + id + "/pendingrequests")
                   }}>Open</button>
            </footer>
        </div>);
    };
    const MemberManagementCard = () => {
        return (<div className="card">
            <header className="card-header">
                <p className="card-header-title">Member Management</p>
            </header>
            <div className="card-content">
                Promote and demote members
            </div>
            <footer className="card-footer">
                <button className="card-footer-item button is-link"
                        onClick={(e) => {
                            e.preventDefault();
                            history.push("/organization/" + id + "/membermanagement")
                        }}>Open</button>
            </footer>
        </div>);
    };


    return <div className="is-flex is-flex-direction-column is-align-self-center mx-4 mt-1">
        <h2 className="title is-2">Organization {organizationState.name}</h2>
        <div className="columns is-multiline">
            <div className="column is-4 is-12-mobile"> <JoinRequestsCard /></div>
            <div className="column is-4 is-12-mobile"> <MemberManagementCard /></div>
        </div>
    </div>

}

export default OrganizationDetails