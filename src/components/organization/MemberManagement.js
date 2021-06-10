import React from "react";
import {getBase, postBase} from "../../js/FetchBase";
import {toast} from "bulma-toast";
import PagedList from "../util/PagedList";

const MemberManagement = () => {
    const org = JSON.parse(localStorage.getItem("organization"));
    const id = org.id;

    async function fetchData(activePage) {
        try {
            return await getBase("/userorganization/" + id + "/users?page=" + activePage);
        } catch {
            toast({
                message: 'Something went wrong while trying to fetch the organization data',
                type: 'is-danger'
            })
        }
    }

    const MemberDetails = (props) => {
        let member = props.data;
        return <div className="panel-block columns">
            <div className="column">{member.user.firstname} {member.user.lastname}</div>
            <div className="column">{member.role}</div>
            <div className="column is-2"><RenderPromoteButtons organizationMember={member} update={props.update}/></div>
        </div>
    }

    const RenderPromoteButtons = (props) => {
        if (props.organizationMember.role === "MEMBER") {
            return <button className="button is-success"
                           onClick={() => promoteMember(props.organizationMember, false, props.update)}>Promote</button>
        } else {
            return <button className="button is-danger"
                           onClick={() => promoteMember(props.organizationMember, true, props.update)}>Demote</button>
        }
    }

    function promoteMember(member, isDemotion, updateFnc) {
        let url = "/userorganization/" + member.id + "/" + (isDemotion ? "demote" : "promote")
        postBase(url, {}).then(() => updateFnc()).catch(() => {
            toast({
                message: 'Something went wrong while trying to promote/demote user',
                type: 'is-danger'
            })
        })
    }

    return <div className="is-flex is-flex-direction-column is-align-self-center mx-4 mt-1">
        <h2 className="title is-2">Organization {org.name}</h2>
        <div className="panel">
            <div className="panel-heading has-text-centered-mobile">
                <h2 className=" title is-3">Member management</h2>
            </div>
            <PagedList fetchDataFnc={fetchData} RenderListItem={MemberDetails}
                       IsEmptyComponent={() => <p>No users in your organization</p>}/>
        </div>
    </div>

};

export default MemberManagement;