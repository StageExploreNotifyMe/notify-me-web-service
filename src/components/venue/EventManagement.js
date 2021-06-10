import {useHistory} from "react-router-dom";
import React from "react";
import {getBase} from "../../js/FetchBase";

import PagedList from "../util/PagedList";
import VenueEvent from "./VenueEvent";
import UnlockAccess from "../authentication/UnlockAccess";
import {useSnackbar} from "notistack";
import {
    Button,
    Container,
    Grid,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    Typography
} from "@material-ui/core";

const EventManagement = () => {
    const venue = JSON.parse(localStorage.getItem("venue"));
    const history = useHistory();
    const {enqueueSnackbar} = useSnackbar();

    async function fetchPageData(activePage) {
        try {
            return await getBase("/event/venue/" + venue.id + "?page=" + activePage);
        } catch {
            enqueueSnackbar('Something went wrong while trying to fetch events', {
                variant: 'error',
            });
        }
    }

    const RenderEventItems = (props) => {
        return <VenueEvent event={props.data}/>
    }

    const RenderNoEvents = () => {
        return <TableCell colSpan={4}>
            No events scheduled yet.
            <UnlockAccess request={['VENUE_MANAGER']}>Schedule an event now by clicking&nbsp;
                <span className="has-text-link is-clickable" onClick={() => history.push("/venue/events/create")}>
                    here
                </span>
                !
            </UnlockAccess>
        </TableCell>

    };

    return <Container maxWidth="lg">
        <Grid
            container
            direction="row"
            justify="flex-start"
            alignItems="center"
        >
            <Grid item xs={7} sm={10}>
                <Typography variant="h3" component="h1">
                    Events
                </Typography>
            </Grid>
            <Grid item xs={5} sm={2}>
                <UnlockAccess request={['VENUE_MANAGER']}>
                    <Button variant="contained" color="primary" onClick={() => {
                        history.push("/venue/events/create")
                    }} className="button is-link level-item">
                        Create Event
                    </Button>
                </UnlockAccess>
            </Grid>
        </Grid>

        <Typography variant="h5" component="h2">
            Venue {venue.name}
        </Typography>

        <TableContainer component={Paper}>
            <Table>
                <TableHead>
                    <TableCell>Event</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Date</TableCell>
                    <TableCell width={100} align="center">Edit</TableCell>
                </TableHead>
                <TableBody>
                    <PagedList fetchDataFnc={fetchPageData} RenderListItem={RenderEventItems}
                               IsEmptyComponent={RenderNoEvents}/>
                </TableBody>
            </Table>
        </TableContainer>
    </Container>;
};

export default EventManagement