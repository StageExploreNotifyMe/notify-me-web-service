import {getBase, postBase} from "../../js/FetchBase";

import React, {useState} from "react";
import {dateArrayToDate} from "../../js/DateTime";
import PagedList from "../util/PagedList";
import {useSnackbar} from 'notistack';
import {
    Container,
    Paper,
    Switch,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography
} from "@material-ui/core";

const AssignMembersToLine = () => {
    const org = JSON.parse(localStorage.getItem("organization"));
    const id = org.id;

    const {enqueueSnackbar} = useSnackbar();
    const [line, setLine] = useState(JSON.parse(localStorage.getItem("organization.memberassignment.line")))

    async function fetchData(activePage) {
        try {
            let lineProm = getBase("/line/" + line.id);
            let usersProm = getBase("/userorganization/" + id + "/users?page=" + activePage)
            let fetchedLine = await lineProm
            setLine(fetchedLine);
            let users = await usersProm;
            users.content.map(uo => {
                uo.alreadyAssigned = (fetchedLine.assignedUsers.find(assignedUser => assignedUser.id === uo.user.id) !== undefined);
                return uo
            });

            return users;
        } catch {
            enqueueSnackbar("Something went wrong while trying to fetch the users in your organization", {
                variant: 'error',
            });
        }
    }

    const RenderJoinRequests = (props) => {
        const user = props.data;
        return <TableRow className="columns" key={user.id}>
            <TableCell width={140}>
                <Switch
                    checked={user.alreadyAssigned}
                    onChange={() => assignUser(user, props.update)}
                    name={user.firstname + user.lastname + "-switch"}
                    inputProps={{'aria-label': 'secondary checkbox'}}
                />
            </TableCell>
            <TableCell>{user.user.firstname} {user.user.lastname}</TableCell>
        </TableRow>
    }

    function assignUser(user, forceUpdateFnc) {
        if (user.alreadyAssigned) {
            enqueueSnackbar("Not implemented", {
                variant: "warning"
            });
            return;
        }

        postBase("/line/" + line.id + "/assign/member", JSON.stringify({
            eventLineId: line.id,
            memberId: user.user.id
        })).then(() => forceUpdateFnc()).catch(() => enqueueSnackbar("Something went wrong while trying to assign member to line", {
            variant: "error"
        }))
    }

    return <Container maxWidth="xl">
        <Typography gutterBottom variant="h3" component="h2">
            Assign members
        </Typography>

        <Container>
            <Typography variant="subtitle2" component="p">
                {line.event.name} - {line.line.name}
            </Typography>
            <Typography variant="subtitle1" component="p" align="right">
                {dateArrayToDate(line.event.date).toLocaleDateString()} {dateArrayToDate(line.event.date).toLocaleTimeString()}
            </Typography>

            <TableContainer component={Paper}>
                <Table className="panel">
                    <TableHead>
                        <TableCell>Is Assigned</TableCell>
                        <TableCell>Member</TableCell>
                    </TableHead>
                    <TableBody>
                        <PagedList fetchDataFnc={fetchData} RenderListItem={RenderJoinRequests}
                                   IsEmptyComponent={() => <TableCell colSpan={2}>No users in your organization</TableCell>}/>
                    </TableBody>
                </Table>
            </TableContainer>
        </Container>
    </Container>
}

export default AssignMembersToLine