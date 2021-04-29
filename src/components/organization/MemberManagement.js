import React, {useEffect, useState} from "react";
import Spinner from "../util/Spinner";
import {getBase, postBase} from "../../js/FetchBase";
import {toast} from "bulma-toast";
import PageControls from "../util/PageControls";
import {useParams} from "react-router-dom";

const MemberManagement = () => {

    let {id} = useParams();

    const [usersPage, setUsersPage] = useState({
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

            let requests = await getBase("/userorganization/" + id + "/users?page=" + activePage);
            setUsersPage(requests)
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
        if (usersPage.content.length === 0) return <div className="panel-block">No users in your organization</div>

        return usersPage.content.map(organizationMember => <MemberDetails key={organizationMember.id}
                                                                          organizationMember={organizationMember}/>);
    }

    const MemberDetails = (props) => {
        let member = props.organizationMember;
        return <div className="panel-block columns">
            <div className="column">{member.user.firstname} {member.user.lastname}</div>
            <div className="column">{member.role}</div>
            <div className="column is-2"><RenderPromoteButtons organizationMember={member}/></div>
        </div>
    }

    function promoteMember(member, isDemotion) {
        let url = "/userorganization/" + member.id + "/" + (isDemotion ? "demote" : "promote")
        postBase(url, {}).then(() => onPageChange(activePage)).catch(() => {
            toast({
                message: 'Something went wrong while trying to promote/demote user',
                type: 'is-danger'
            })
        })
    }

    const RenderPromoteButtons = (props) => {
        if (props.organizationMember.role === "MEMBER") {
            return <button className="button is-success"
                           onClick={() => promoteMember(props.organizationMember, false)}>Promote</button>
        } else {
            return <button className="button is-danger"
                           onClick={() => promoteMember(props.organizationMember, true)}>Demote</button>
        }
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
                <h2 className=" title is-3">Member management</h2>
            </div>
            <RenderJoinRequests/>
            {
                usersPage.content.length === 0 ? "" :
                    <div className="control">
                        <PageControls showButtons={true} pageSettings={usersPage}
                                      changePage={(e) => onPageChange(e)}/>
                    </div>
            }
        </div>
    </div>

};

export default MemberManagement;