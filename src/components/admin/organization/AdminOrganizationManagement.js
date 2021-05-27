import PagedList from "../../util/PagedList";
import React from "react";
import {useHistory} from "react-router-dom";
import {getBase} from "../../../js/FetchBase";
import {toast} from "bulma-toast";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faEdit} from "@fortawesome/free-solid-svg-icons";

const AdminOrganizationManagement = () => {

    const history = useHistory();
    const createOrgLink = "/admin/organizationManagement/create";

    async function fetchPageData(activePage) {
        try {
            return await getBase("/organization?page=" + activePage);
        } catch {
            toast({
                message: 'Something went wrong while trying to fetch organizations',
                type: 'is-danger'
            })
        }
    }

    const RenderOrganizations = (props) => {
        let org = props.data;
        return <div className="panel-block columns" key={org.id}>

            <div className="column"> {org.name}</div>
            <div className="column is-1">
                <span className="icon is-clickable" onClick={() => history.push("/admin/organizationManagement/" + org.id + "/edit")}>
                    <FontAwesomeIcon icon={faEdit}/>
                </span>
            </div>
        </div>
    }

    const RenderNoOrganizations = () => {
        return <div className="panel-block">
            No organizations known in the system yet.  Create the first one now by clicking&nbsp;
            <span className="has-text-link is-clickable" onClick={() => history.push(createOrgLink)}>
                here
            </span>
            !
        </div>
    };


    return <div className="container mt-2">
        <div className="level">
            <div className="level-left"><h2 className="title is-2 level-item">Organization Management</h2></div>
            <div className="level-right">
                <button onClick={() => {
                    history.push(createOrgLink)
                }} className="button is-link level-item">
                    Create Organization
                </button>
            </div>
        </div>
        <div className="panel">
            <div className="panel-heading has-text-centered-mobile">
                <h2 className="title is-3">Organizations</h2>
            </div>
            <PagedList fetchDataFnc={fetchPageData} RenderListItem={RenderOrganizations}
                       IsEmptyComponent={RenderNoOrganizations}/>
        </div>
    </div>;
};

export default AdminOrganizationManagement