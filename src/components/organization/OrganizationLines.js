import {useHistory} from "react-router-dom";
import {getBase} from "../../js/FetchBase";

import React from "react";
import PagedList from "../util/PagedList";
import DateDiv from "../util/DateDiv";
import {useSnackbar} from "notistack";
import {
    Container,
    IconButton,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Tooltip,
    Typography
} from "@material-ui/core";
import EditIcon from "@material-ui/icons/Edit";

const OrganizationLines = () => {
    const org = JSON.parse(localStorage.getItem("organization"));
    const id = org.id;
    const history = useHistory();
    const {enqueueSnackbar} = useSnackbar();

    async function fetchData(activePage) {
        try {
            return await getBase("/line/organization/" + id + "?page=" + activePage);
        } catch {
            enqueueSnackbar('Something went wrong while trying to fetch the lines your organization was assigned to', {
                variant: 'error',
            });
        }
    }

    function assignLine(line) {
        localStorage.setItem("organization.memberassignment.line", JSON.stringify(line));
        history.push("/organization/linemanagement/memberassign")
    }

    const RenderJoinRequests = (props) => {
        const line = props.data;

        return <TableRow key={props.key}>
            <TableCell>{line.event.name}</TableCell>
            <TableCell>
                <Tooltip title={<span>{line.line.description}</span>}>
                    <span>{line.line.name}</span>
                </Tooltip>
            </TableCell>
            <TableCell><DateDiv date={line.event.date}/></TableCell>
            <TableCell>
                <Tooltip title={<span>{line.assignedUsers.length}/{line.line.numberOfRequiredPeople}</span>}>
                    <span>{Math.round((line.assignedUsers.length / line.line.numberOfRequiredPeople) * 100)}%</span>
                </Tooltip>
            </TableCell>
            <TableCell>
                <IconButton color={"secondary"} onClick={() => assignLine(line)}>
                    <EditIcon/>
                </IconButton>
            </TableCell>
        </TableRow>;
    }

    return <Container maxWidth="xl">
        <Typography gutterBottom variant="h3" component="h2">
            Manage Lines {org.name}
        </Typography>
        <TableContainer component={Paper}>
            <Table aria-label="simple table">
                <TableHead>
                    <TableRow>
                        <TableCell>Event</TableCell>
                        <TableCell>Line</TableCell>
                        <TableCell>Date</TableCell>
                        <TableCell>Current assigned members</TableCell>
                        <TableCell>Assign Member</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    <PagedList fetchDataFnc={fetchData} RenderListItem={RenderJoinRequests}
                               IsEmptyComponent={() => <TableCell colSpan={5}>No lines assigned to your organization</TableCell>}/>
                </TableBody>
            </Table>
        </TableContainer>
    </Container>
};

export default OrganizationLines