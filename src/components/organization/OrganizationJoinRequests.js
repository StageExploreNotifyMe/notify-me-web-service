import React from "react";
import {getBase} from "../../js/FetchBase";
import {toast} from "bulma-toast";
import OrganizationRequestUserDetail from "./OrganizationRequestUserDetail";
import PagedList from "../util/PagedList";

const OrganizationJoinRequests = () => {
    const org = JSON.parse(localStorage.getItem("organization"));
    const id = org.id;

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

    const RenderJoinRequests = (props) => {
       return <OrganizationRequestUserDetail key={props.id} request={props.data}/>
    }

    return <div className="is-flex is-flex-direction-column is-align-self-center mx-4 mt-1">
        <h2 className="title is-2">Organization {org.name}</h2>
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