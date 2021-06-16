import PagedList from "../util/PagedList";
import React from "react";
import {getBase} from "../../js/FetchBase";

import {useHistory} from "react-router-dom";
import {useSnackbar} from "notistack";
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

const PickVenueToManage = () => {

    const history = useHistory();
    const {enqueueSnackbar} = useSnackbar();

    async function fetchPageData(activePage) {
        try {
            return await getBase("/venue/" + localStorage.getItem("user.id") + "?page=" + activePage);
        } catch {
            enqueueSnackbar('Something went wrong while trying to fetch all the venues you are a part of', {
                variant: 'error',
            });
        }
    }

    function onVenueManageClick(venue) {
        localStorage.setItem("venue", JSON.stringify(venue));
        history.push("/");
    }

    const RenderVenues = (props) => {
        let ev = props.data;
        return <TableRow className="panel-block columns" key={ev.id}>
            <TableCell>{ev.name}</TableCell>
            <TableCell align="right">
                <Button variant="contained" color="primary" onClick={() => onVenueManageClick(ev)}>Manage this
                    venue</Button>
            </TableCell>
        </TableRow>
    }

    return <Container maxWidth="xl">

        <Typography gutterBottom variant="h4" component="h2" align="center">
            Please select which venue you'd like to manage now:
        </Typography>
        <Container maxWidth="sm">
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableCell>Venue</TableCell>
                        <TableCell align="right">Manage</TableCell>
                    </TableHead>
                    <TableBody>
                        <PagedList fetchDataFnc={fetchPageData} RenderListItem={RenderVenues}
                                   IsEmptyComponent={() => <TableCell colSpan={2}>
                                       Something went wrong, you appear to not be a part of any venue
                                   </TableCell>}/>
                    </TableBody>
                </Table>
            </TableContainer>
        </Container>
    </Container>
};

export default PickVenueToManage;