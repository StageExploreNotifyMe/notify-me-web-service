import React from "react";
import {getBase, postBase} from "../../js/FetchBase";

import PagedList from "../util/PagedList";
import {useSnackbar} from 'notistack';
import {
    Button,
    Container,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography
} from "@material-ui/core";

const MemberManagement = () => {
    const org = JSON.parse(localStorage.getItem("organization"));
    const {enqueueSnackbar} = useSnackbar();
    const id = org.id;

    async function fetchData(activePage) {
        try {
            return await getBase("/userorganization/" + id + "/users?page=" + activePage);
        } catch {
            enqueueSnackbar("Something went wrong while trying to fetch the organization data", {
                variant: 'error',
            });
        }
    }

    const MemberDetails = (props) => {
        let member = props.data;
        return <TableRow>
            <TableCell>{member.user.firstname} {member.user.lastname}</TableCell>
            <TableCell>{member.role}</TableCell>
            <TableCell><RenderPromoteButtons organizationMember={member} update={props.update}/></TableCell>
        </TableRow>
    }

    const RenderPromoteButtons = (props) => {
        if (props.organizationMember.role === "MEMBER") {
            return <Button variant="contained" color="secondary"
                onClick={() => promoteMember(props.organizationMember, false, props.update)}>Promote</Button>
        } else {
            return <Button variant="outlined" color="secondary"
                onClick={() => promoteMember(props.organizationMember, true, props.update)}>Demote</Button>
        }
    }

    function promoteMember(member, isDemotion, updateFnc) {
        let url = "/userorganization/" + member.id + "/" + (isDemotion ? "demote" : "promote")
        postBase(url, {}).then(() => updateFnc()).catch(() => {
            enqueueSnackbar("Something went wrong while trying to promote/demote user", {
                variant: 'error',
            });
        })
    }

    return <Container maxWidth="lg">
        <Typography gutterBottom variant="h4" component="h2">
            Member Management {org.name}
        </Typography>

        <TableContainer component={Paper}>
            <Table aria-label="simple table">
                <TableHead>
                    <TableRow>
                        <TableCell width={150}>Member</TableCell>
                        <TableCell width={250}>Function</TableCell>
                        <TableCell width={50}>Actions</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    <PagedList fetchDataFnc={fetchData} RenderListItem={MemberDetails}
                               IsEmptyComponent={() => <TableCell colSpan={3}>No users in your organization</TableCell>}/>
                </TableBody>
            </Table>
        </TableContainer>
    </Container>
};

export default MemberManagement;