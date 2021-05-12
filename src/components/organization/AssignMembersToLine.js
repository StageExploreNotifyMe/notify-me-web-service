import {useParams} from "react-router-dom";
import {getBase, postBase} from "../../js/FetchBase";
import {toast} from "bulma-toast";
import React, {useState} from "react";
import {dateArrayToDate} from "../../js/DateTime";
import PagedList from "../util/PagedList";

const AssignMembersToLine = () => {
    let {id} = useParams();


    const [line, setLine] = useState(JSON.parse(localStorage.getItem("organization.memberassignment.line")))

    async function fetchData(activePage) {
        try {
            let lineProm = getBase("/line/" + line.id);
            let usersProm = getBase("/userorganization/" + id + "/users?page=" + activePage)
            let fetchedLine = await lineProm
            setLine(fetchedLine);
            let users = await usersProm;
            users.content.map(user => {
                user.alreadyAssigned = (fetchedLine.assignedUsers.find(assignedUser => assignedUser.id === user.id) !== undefined);
                return user
            });

            return users;
        } catch {
            toast({
                message: 'Something went wrong while trying to fetch the users in your organization',
                type: 'is-danger'
            })
        }
    }

    const RenderJoinRequests = (props) => {
        const user = props.data;
        return <div className="columns" key={user.id}>
            <input className="column is-1" type="checkbox" checked={user.alreadyAssigned}
                   onChange={() => assignUser(user, props.update)}/>
            <p className="column">{user.user.firstname} {user.user.lastname}</p>
        </div>
    }

    function assignUser(user, forceUpdateFnc) {
        if (user.alreadyAssigned) {
            toast({
                message: 'Not implemented',
                type: 'is-danger'
            })
            return;
        }

        postBase("/line/" + line.id + "/assign/member", JSON.stringify({
            eventLineId: line.id,
            memberId: user.user.id
        })).then(() => forceUpdateFnc()).catch(() =>
            toast({
                message: 'Something went wrong while trying to assign member to line',
                type: 'is-danger'
            })
        )
    }

    return <div className="is-flex is-flex-direction-column is-align-self-center mx-4 mt-1">
        <h2 className="title is-2">Assign members</h2>
        <p className="subtitle">{line.event.name} - {line.line.name} - {dateArrayToDate(line.event.date).toISOString()}</p>
        <div className="panel">
            <div className="panel-heading has-text-centered-mobile">
                <h2 className=" title is-3">Users</h2>
            </div>
            <PagedList fetchDataFnc={fetchData} RenderListItem={RenderJoinRequests}
                       IsEmptyComponent={() => <p>No users in your organization</p>}/>
        </div>
    </div>
}

export default AssignMembersToLine