import {useEffect, useState} from "react";
import Spinner from "../util/Spinner";
import {getBase} from "../../js/fetch/FetchBase";
import {toast} from "bulma-toast";
import PageControls from "../util/PageControls";
import OrganizationRequestUserDetail from "./OrganizationRequestUserDetail";

const OrganizationJoinRequests = (props) => {

    const [joinPageRequest, setJoinPageRequest] = useState({
        content: [],
        number: 0,
        first: true,
        last: false,
        totalPages: 0
    })
    const [loading, setLoading] = useState(true);
    const [activePage, setActivePage] = useState(0);

    async function fetchJoinRequests() {
        try {
            let result = await getBase("/userorganisation/requests/" + props.organization.id + "/pending/" + activePage);
            setJoinPageRequest(result)
            setLoading(false)
        } catch {
            toast({
                message: 'Something went wrong while trying to fetch open join requests',
                type: 'is-danger'
            })
        }
    }

    useEffect(() => {
        fetchJoinRequests();
    }, [activePage]);


    const RenderJoinRequests = () => {
        if (loading) return <Spinner/>
        return joinPageRequest.content.map(req => <OrganizationRequestUserDetail key={req.id} request={req}/> );
    }

    function onPageChange(e) {
        setActivePage(e);
        setLoading(true);
        fetchJoinRequests();
    }

    return <div className="panel">
        <div className="panel-heading has-text-centered-mobile">
            <h2 className=" title is-3">Open Join Requests</h2>
        </div>
        <RenderJoinRequests/>
        <div className="control ">
            <PageControls showButtons={true} pageSettings={joinPageRequest}
                          changePage={(e) => onPageChange(e)}/>
        </div>
    </div>

};

export default OrganizationJoinRequests;