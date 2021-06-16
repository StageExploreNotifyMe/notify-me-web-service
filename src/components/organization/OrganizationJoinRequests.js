import React from "react";
import {getBase} from "../../js/FetchBase";

import OrganizationRequestUserDetail from "./OrganizationRequestUserDetail";
import PagedList from "../util/PagedList";
import {useSnackbar} from "notistack";
import {
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

const OrganizationJoinRequests = () => {
    const {enqueueSnackbar} = useSnackbar();
    const org = JSON.parse(localStorage.getItem("organization"));
    const id = org.id;

    async function fetchData(activePage) {
        try {
            return await getBase("/userorganization/requests/" + id + "/pending?page=" + activePage);
        } catch {
            enqueueSnackbar('Something went wrong while trying to fetch the organization data', {
                variant: 'error',
            });
        }
    }

    const RenderJoinRequests = (props) => {
        return <OrganizationRequestUserDetail key={props.id} request={props.data}/>
    }

    return <Container maxWidth="lg">
        <Typography gutterBottom variant="h4" component="h2">
            Open Join Requests {org.name}
        </Typography>

        <TableContainer component={Paper}>
            <Table aria-label="simple table">
                <TableHead>
                    <TableRow>
                        <TableCell width={150}>Member</TableCell>
                        <TableCell width={50}>Actions</TableCell>
                    </TableRow>
                    </TableHead>
                    <TableBody>
                        <PagedList fetchDataFnc={fetchData} RenderListItem={RenderJoinRequests}
                                   IsEmptyComponent={() => <TableCell colSpan={2}>No pending join requests for your organization!</TableCell>}/>
                    </TableBody>
                </Table>
            </TableContainer>
    </Container>

};

export default OrganizationJoinRequests;