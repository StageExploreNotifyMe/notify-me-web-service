import {useParams} from "react-router-dom";

import React, {useState, useEffect} from 'react';
import {getBase} from "../../js/fetch/FetchBase";
import {toast} from "bulma-toast";

import Spinner from "../util/Spinner";
import OrganizationJoinRequests from "./OrganizationJoinRequests"

const OrganizationDetails = () => {
    let {id} = useParams();

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

    return <div className="is-flex is-flex-direction-column is-align-self-center mx-4 mt-1">
        <h2 className="title is-2">Organization {organizationState.name}</h2>
        <OrganizationJoinRequests organization={organizationState}/>
    </div>;
}

export default OrganizationDetails