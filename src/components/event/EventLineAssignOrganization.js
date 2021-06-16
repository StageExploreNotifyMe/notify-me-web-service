import {getBase} from "../../js/FetchBase";

import React from "react";
import PagedList from "../util/PagedList";
import {useSnackbar} from 'notistack';
import {
    Button,
    Grid,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography
} from "@material-ui/core";

const EventLineAssignOrganization = (props) => {
    const {enqueueSnackbar} = useSnackbar();

    const eventLine = JSON.parse(localStorage.getItem("event.line.assign"));
    if (eventLine === undefined || eventLine === null) return "";

    const assignOrgFnc = props.assignOrg;

    async function fetchOrganizations(activePage) {
        try {
            return await getBase("/organization?page=" + activePage);
        } catch {
            enqueueSnackbar("Something went wrong while trying to fetch organizations", {
                variant: 'error',
            });
        }
    }

    const RenderOrganizationsList = (props) => {
        const org = props.data;

        return <TableRow key={org.id}>
            <TableCell>{org.name}</TableCell>
            <TableCell>
                <Button variant="contained" color="secondary" onClick={() => assignOrgFnc(org.id, eventLine.id)}>
                    Assign
                </Button>
            </TableCell>
        </TableRow>
    }

    return <>
        <Grid container spacing={2}>
            <Grid item xs={10}>
                <Typography gutterBottom variant="h4" component="h2">
                    Assign organization to line {eventLine.line.name}
                </Typography>
            </Grid>
            <Grid item xs={2}>
                <Typography align={"right"} gutterBottom variant="body1" component="div">
                    <Button variant={"outlined"} color={"secondary"} onClick={() => props.cancel()}>
                        Cancel
                    </Button>
                </Typography>

            </Grid>
        </Grid>
        <TableContainer component={Paper}>
            <Table>
                <TableHead>
                    <TableCell>Organization</TableCell>
                    <TableCell>Actions</TableCell>
                </TableHead>
                <TableBody>
                    <PagedList fetchDataFnc={fetchOrganizations} RenderListItem={RenderOrganizationsList}
                               IsEmptyComponent={() => <p>No organizations found!</p>}/>
                </TableBody>
            </Table>
        </TableContainer>
    </>
}

export default EventLineAssignOrganization