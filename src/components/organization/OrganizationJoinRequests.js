import React, {useEffect, useState} from "react";
import Spinner from "../util/Spinner";
import {getBase} from "../../js/FetchBase";
import {toast} from "bulma-toast";
import PageControls from "../util/PageControls";
import OrganizationRequestUserDetail from "./OrganizationRequestUserDetail";
import {useParams} from "react-router-dom";

const OrganizationJoinRequests = () => {

    let {id} = useParams();

    const [joinPageRequest, setJoinPageRequest] = useState({
        content: [],
        number: 0,
        first: true,
        last: false,
        totalPages: 0
    })
    const [loading, setLoading] = useState(true);
    const [activePage, setActivePage] = useState(0);

    const [organizationState, setOrganizationState] = useState(null)

    async function fetchData(fetchOrganization = (organizationState === null)) {
        try {
            if (fetchOrganization) {
                let organizationData = await getBase("/organization/" + id);
                setOrganizationState(organizationData);
            }

            let requests = await getBase("/userorganization/requests/" + id + "/pending?page=" + activePage);
            setJoinPageRequest(requests)
            setLoading(false)
        } catch {
            toast({
                message: 'Something went wrong while trying to fetch the organization data',
                type: 'is-danger'
            })
        }
    }

    useEffect(() => {
        fetchData();
    }, [activePage]);


    const RenderJoinRequests = () => {
        if (loading) return <Spinner/>
        if (joinPageRequest.content.length === 0) return <div className="panel-block">No pending join requests for your
            organization!</div>

        return joinPageRequest.content.map(req => <OrganizationRequestUserDetail key={req.id} request={req}/>);
    }

    function onPageChange(e) {
        setActivePage(e);
        setLoading(true);
        fetchData();
    }

    return <div className="is-flex is-flex-direction-column is-align-self-center mx-4 mt-1">
        <h2 className="title is-2">Organization {organizationState === null ? "" : organizationState.name}</h2>
        <div className="panel">
            <div className="panel-heading has-text-centered-mobile">
                <h2 className=" title is-3">Open Join Requests</h2>
            </div>
            <RenderJoinRequests/>
            {
                joinPageRequest.content.length === 0 ? "" :
                    <div className="control">
                        <PageControls showButtons={true} pageSettings={joinPageRequest}
                                      changePage={(e) => onPageChange(e)}/>
                    </div>
            }
        </div>
    </div>

};

export default OrganizationJoinRequests;