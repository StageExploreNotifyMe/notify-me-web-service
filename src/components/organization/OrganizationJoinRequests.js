import React, {useEffect, useState} from "react";
import {getBase} from "../../js/FetchBase";
import {toast} from "bulma-toast";
import OrganizationRequestUserDetail from "./OrganizationRequestUserDetail";
import {useParams} from "react-router-dom";
import PagedList from "../util/PagedList";

const OrganizationJoinRequests = () => {
    let {id} = useParams();

    const [loading, setLoading] = useState(true);
    const [organizationState, setOrganizationState] = useState(null)

    async function fetchData(activePage) {
        try {
            return await getBase("/userorganization/requests/" + id + "/pending?page=" + activePage);
        } catch {
            toast({
                message: 'Something went wrong while trying to fetch the organization data',
                type: 'is-danger'
            })
        }
    }

    async function fetchOrg() {
        try {

            let organizationData = await getBase("/organization/" + id);
            setOrganizationState(organizationData);
            setLoading(false)
        } catch {
            toast({
                message: 'Something went wrong while trying to fetch the organization data',
                type: 'is-danger'
            })
        }
    }

    useEffect(() => {
        fetchOrg();
    }, [loading]);

    const RenderJoinRequests = (props) => {
       return <OrganizationRequestUserDetail key={props.id} request={props.data}/>
    }

    return <div className="is-flex is-flex-direction-column is-align-self-center mx-4 mt-1">
        <h2 className="title is-2">Organization {organizationState === null ? "" : organizationState.name}</h2>
        <div className="panel">
            <div className="panel-heading has-text-centered-mobile">
                <h2 className=" title is-3">Open Join Requests</h2>
            </div>
            <PagedList fetchDataFnc={fetchData} RenderListItem={RenderJoinRequests}
                       IsEmptyComponent={() => <p>No pending join requests for your organization!</p>}/>
        </div>
    </div>

};

export default OrganizationJoinRequests;