import {useParams} from "react-router-dom";
import {getBase, postBase} from "../../js/FetchBase";
import {toast} from "bulma-toast";
import PageControls from "../util/PageControls";
import Spinner from "../util/Spinner";
import React, {useEffect, useState} from "react";
import {dateArrayToDate} from "../../js/DateTime";

const AssignMembersToLine = () => {
    let {id} = useParams();

    const [userPage, setUserPage] = useState({
        content: [],
        number: 0,
        first: true,
        last: false,
        totalPages: 0
    })
    const [line, setLine] = useState(JSON.parse(localStorage.getItem("organization.memberassignment.line")))
    const [loading, setLoading] = useState(true);
    const [activePage, setActivePage] = useState(0);

    async function fetchData() {
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

            setUserPage(users)
            setLoading(false)
        } catch {
            toast({
                message: 'Something went wrong while trying to fetch the users in your organization',
                type: 'is-danger'
            })
        }
    }

    useEffect(() => {
        fetchData();
    }, [activePage]);

    function onPageChange(e) {
        setActivePage(e);
        setLoading(true);
        fetchData();
    }

    const RenderJoinRequests = () => {
        if (loading) return <Spinner/>
        if (userPage.content.length === 0) return <div className="panel-block">
            No users in your organization
        </div>

        return userPage.content.map(user => <div className="columns" key={user.id}>
            <input className="column is-1" type="checkbox" checked={user.alreadyAssigned}
                                              onChange={() => assignUser(user)}/>
            <p className="column">{user.user.firstname} {user.user.lastname}</p>
        </div>);
    }

    function assignUser(user) {
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
        })).then(() => onPageChange(activePage)).catch(() => toast({
            message: 'Something went wrong while trying to assign member to line',
            type: 'is-danger'
        }))
    }

    return <div className="is-flex is-flex-direction-column is-align-self-center mx-4 mt-1">
        <h2 className="title is-2">Assign members</h2>
        <p className="subtitle">{line.event.name} - {line.line.name} - {dateArrayToDate(line.event.date).toISOString()}</p>
        <div className="panel">
            <div className="panel-heading has-text-centered-mobile">
                <h2 className=" title is-3">Users</h2>
            </div>
            <RenderJoinRequests/>
            {
                userPage.content.length === 0 ? "" :
                    <div className="control">
                        <PageControls showButtons={true} pageSettings={userPage}
                                      changePage={(e) => onPageChange(e)}/>
                    </div>
            }
        </div>
    </div>
}

export default AssignMembersToLine