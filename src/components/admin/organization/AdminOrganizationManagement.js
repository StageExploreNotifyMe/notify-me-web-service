import PagedList from "../../util/PagedList";
import React, {useState} from "react";
import {useHistory} from "react-router-dom";
import {getBase, patchBase} from "../../../js/FetchBase";
import {toast} from "bulma-toast";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faEdit} from "@fortawesome/free-solid-svg-icons";

const AdminOrganizationManagement = () => {
    const history = useHistory();
    const createOrgLink = "/admin/organizationManagement/create";

    const [editingValues, setEditingValues] = useState({
        openModal: false,
        organization: {
            id: "",
            name: ""
        }
    })

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
            <div className="column">{org.name}</div>
            <div className="column is-1">
                <span className="icon is-clickable" onClick={() => {
                    setEditingValues({openModal: true, organization: org, updateFnc: props.update})
                }}>
                    <FontAwesomeIcon icon={faEdit}/>
                </span>
            </div>
        </div>
    }

    const RenderNoOrganizations = () => {
        return <div className="panel-block">
            No organizations known in the system yet. Create the first one now by clicking&nbsp;
            <span className="has-text-link is-clickable" onClick={() => history.push(createOrgLink)}>
                here
            </span>
            !
        </div>
    };

    function closeModal() {
        setEditingValues({...editingValues, openModal: false})
    }

    function updateOrganization() {
        patchBase("/organization", JSON.stringify({
            id: editingValues.organization.id,
            name: editingValues.organization.name
        })).then(() => {
            editingValues.updateFnc();
            closeModal();
        }).catch(() => {
            toast({
                message: 'Something went wrong while trying to update this organization',
                type: 'is-danger'
            })
        })
    }

    return <article className="container mt-2">
        <section className="level">
            <div className="level-left"><h2 className="title is-2 level-item">Organization Management</h2></div>
            <div className="level-right">
                <button onClick={() => {
                    history.push(createOrgLink)
                }} className="button is-link level-item">
                    Create Organization
                </button>
            </div>
        </section>
        <section className="panel">
            <div className="panel-heading has-text-centered-mobile">
                <h2 className="title is-3">Organizations</h2>
            </div>
            <PagedList fetchDataFnc={fetchPageData} RenderListItem={RenderOrganizations}
                       IsEmptyComponent={RenderNoOrganizations}/>
        </section>
        <section className={`modal ${editingValues.openModal ? "is-active" : ""}`}>
            <div className="modal-background" onClick={closeModal}/>
            <div className="modal-content">
                <div className="card">
                    <div className="card-header"><h2 className="title is-3 p-2">Rename Organization</h2></div>
                    <div className="card-content">
                        <input className="input" value={editingValues.organization.name}
                               onChange={(e) => setEditingValues({
                                   ...editingValues,
                                   organization: {
                                       ...editingValues.organization,
                                       name: e.target.value
                                   }
                               })}/>
                    </div>
                    <div className="card-footer">
                        <button className="button is-success card-footer-item mx-1" onClick={updateOrganization}>Save
                        </button>
                        <button className="button is-danger card-footer-item mx-1" onClick={closeModal}>Cancel</button>
                    </div>
                </div>
            </div>
            <button className="modal-close is-large" aria-label="close" onClick={closeModal}/>

        </section>
    </article>;
};

export default AdminOrganizationManagement