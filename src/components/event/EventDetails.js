import {getBase, postBase} from "../../js/FetchBase";
import {dateArrayToDate, getRelativeTime} from "../../js/DateTime"
import React, {useEffect, useState} from "react";
import Spinner from "../util/Spinner";
import EventLines from "./EventLines";
import UnlockAccess from "../authentication/UnlockAccess";
import {useSnackbar} from 'notistack';
import {
    Button,
    Container,
    Dialog,
    DialogTitle,
    Grid,
    List,
    ListItem,
    ListItemText,
    Typography
} from "@material-ui/core";


const EventDetails = () => {
    const [event, setEvent] = useState(JSON.parse(localStorage.getItem("currentEvent")))
    const [loading, setLoading] = useState(true);
    const [openEventStatusDiag, setOpenEventStatusDiag] = useState(false);
    const {enqueueSnackbar} = useSnackbar();

    async function fetchEvent() {
        try {
            let result = await getBase("/event/" + event.id);
            setEvent(result)
            setLoading(false)
        } catch {
            enqueueSnackbar("Something went wrong while trying to fetch the details of this event", {
                variant: 'error',
            });
        }
    }

    useEffect(() => {
        fetchEvent();
    }, [loading]);

    function setEventState(update, value) {
        setOpenEventStatusDiag(false);
        if (!update) return;
        setLoading(true);
        postBase("/event/" + event.id + "/" + value, {}).then(() => setLoading(true)).catch(() => {
            enqueueSnackbar("Something went wrong while trying to update the status of your event", {
                variant: 'error',
            });
        })
    }

    if (loading) return <Spinner/>

    return <Container maxWidth="xl">
        <Grid container spacing={2} component="h1" alignItems="center">
            <Grid item>
                <Typography gutterBottom variant="h4" component="span">
                    Manage event -
                </Typography>
            </Grid>
            <Grid item>
                <Typography gutterBottom variant="h4" component="span">
                    {event.name}
                </Typography>
            </Grid>
        </Grid>

        <Typography gutterBottom variant="subtitle1" component="h2">
            {dateArrayToDate(event.date).toLocaleDateString()} - {getRelativeTime(dateArrayToDate(event.date))}
        </Typography>


        <UnlockAccess request={['VENUE_MANAGER']}>
            <Typography gutterBottom variant="body1" component="p">
                Event Status <Button variant="outlined" color={"secondary"} size={"small"}
                                     onClick={() => setOpenEventStatusDiag(true)}>{event.eventStatus}</Button>
                <EventStatusDialog selectedValue={event.eventStatus} open={openEventStatusDiag}
                                   onClose={setEventState}/>
            </Typography>
        </UnlockAccess>

        <section>
            <EventLines/>
        </section>
    </Container>
}

function EventStatusDialog(props) {
    const {onClose, selectedValue, open} = props;

    const handleListItemClick = (value) => {
        onClose(true, value);
    };

    return (
        <Dialog onClose={() => onClose(false)} aria-labelledby="eventStatus-diag-title" open={open}>
            <DialogTitle id="eventStatus-diag-title">Set event Status</DialogTitle>
            <List>
                <ListItem selected={selectedValue === "PRIVATE"} button onClick={() => handleListItemClick('private')}
                          key="private">
                    <ListItemText primary="Private"/>
                </ListItem>
                <ListItem selected={selectedValue === "PUBLIC"} button onClick={() => handleListItemClick('publish')}
                          key="public">
                    <ListItemText primary="Public"/>
                </ListItem>
                <ListItem selected={selectedValue === "CANCELED"} button onClick={() => handleListItemClick('cancel')}
                          key="cancel">
                    <ListItemText primary="Cancel"/>
                </ListItem>
            </List>
        </Dialog>
    );
}

export default EventDetails