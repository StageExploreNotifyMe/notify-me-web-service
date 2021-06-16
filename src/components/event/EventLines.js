import React, {useState} from "react";
import {getBase, postBase} from "../../js/FetchBase";

import {useHistory} from "react-router-dom";
import EventLineAssignOrganization from "./EventLineAssignOrganization";
import PagedList from "../util/PagedList";
import {useSnackbar} from 'notistack';
import {
    Button,
    ButtonGroup,
    Dialog,
    DialogActions,
    DialogTitle,
    Grid,
    IconButton,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TextField,
    Typography
} from "@material-ui/core";
import {makeStyles} from "@material-ui/styles";
import EditIcon from "@material-ui/icons/Edit";

const EventLines = () => {
    const event = JSON.parse(localStorage.getItem("currentEvent"));

    const {enqueueSnackbar} = useSnackbar();
    const history = useHistory();
    let forceUpdateFnc = null;
    const classes = useStyles();

    const [assigningOrg, setAssigningOrg] = useState(false);
    const [modal, setModal] = useState({
        isActive: false,
        eventLine: {organization: {name: ""}}
    });

    async function fetchEventLines() {
        try {
            return await getBase("/line/event/" + event.id);
        } catch {
            enqueueSnackbar("Something went wrong while trying to fetch open join requests", {
                variant: 'error',
            });
        }
    }

    function assignOrganizationToLine(eventLine) {
        localStorage.setItem("event.line.assign", JSON.stringify(eventLine));
        setAssigningOrg(true);
    }

    function setEventLineState(eventLine) {
        postBase("/line/" + eventLine.id + "/cancel", {}).then(() => forceUpdateFnc()).catch(() => {
            enqueueSnackbar("Something went wrong while trying to cancel the eventLine", {
                variant: 'error',
            });
        })
    }

    function openModal(eventLine) {
        setModal({eventLine: eventLine, isActive: true});
    }

    const RenderEventLines = (props) => {
        const eventLine = props.data;
        forceUpdateFnc = props.update;
        if (eventLine.eventLineStatus === "CANCELED") return "";

        return <TableRow key={eventLine.id}>
            <TableCell className="column is-3">{eventLine.line.name}</TableCell>
            <TableCell className="column is-3">{
                eventLine.organization === null ?
                    <>
                        Unassigned
                        <IconButton color={"secondary"} onClick={() => assignOrganizationToLine(eventLine)}>
                            <EditIcon/>
                        </IconButton>
                    </>
                    : eventLine.organization.name}
            </TableCell>
            <TableCell className="column is-2">{eventLine.assignedUsers.length}</TableCell>
            <TableCell align={"right"} className="column is-4">
                <ButtonGroup>
                    <Button variant={"outlined"} onClick={() => openModal(eventLine)}>Send staffing
                        reminder
                    </Button>
                    <Button variant={"outlined"} onClick={() => setEventLineState(eventLine)}>Cancel</Button>
                </ButtonGroup>

            </TableCell>
        </TableRow>
    }

    function assignOrganization(orgId, eventLineId) {
        postBase("/line/" + eventLineId + "/assign/organization", JSON.stringify({
            eventLineId: eventLineId,
            organizationId: orgId
        })).then(() => {
            setAssigningOrg(false)
            forceUpdateFnc();
        }).catch(() => {
            enqueueSnackbar("Something went wrong while assigning organization", {
                variant: 'error',
            });
        })
    }

    function closeModal() {
        setModal(() => ({isActive: false, eventLine: {organization: {name: ""}}}))
    }

    function sendReminder(send, text) {
        closeModal();
        if (!send) return;

        postBase("/line/" + modal.eventLine.id + "/staffingreminder", JSON.stringify({
            eventLineId: modal.eventLine.id,
            customText: text === "" ? null : text
        })).then(() => {
            enqueueSnackbar("The reminder has been sent", {
                variant: "success"
            });
        }).catch(() => {
            enqueueSnackbar("Something went wrong while trying to send your reminder", {
                variant: 'error',
            });
        });
    }

    return <>
        <StaffingReminderDialog onClose={sendReminder} open={modal.isActive} eventLine={modal.eventLine}/>
        <Typography className={assigningOrg ? classes.hidden : ""} gutterBottom variant="body1" component="div">
            <Grid container spacing={2}>
                <Grid item xs={10}>
                    <Typography gutterBottom variant="h4" component="h2">
                        Lines for {event.name}
                    </Typography>
                </Grid>
                <Grid item xs={2}>
                    <Typography align={"right"} gutterBottom variant="body1" component="div">
                        <Button color={"secondary"} variant="outlined" onClick={() => history.push("/venue/event/lines")}>
                            Add
                        </Button>
                    </Typography>

                </Grid>
            </Grid>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableCell>Line</TableCell>
                        <TableCell>Organization</TableCell>
                        <TableCell>Assigned people</TableCell>
                        <TableCell> </TableCell>
                    </TableHead>
                    <TableBody>
                        <PagedList fetchDataFnc={fetchEventLines} RenderListItem={RenderEventLines}
                                   IsEmptyComponent={() => <TableCell colSpan={4}>No lines assigned to this event.</TableCell>}/>
                    </TableBody>
                </Table>
            </TableContainer>
        </Typography>

        <Typography className={assigningOrg ? "" : classes.hidden} gutterBottom variant="body1" component="div">
            <EventLineAssignOrganization
                assignOrg={(orgId, eventLineId) => {
                    assignOrganization(orgId, eventLineId)
                }}
                cancel={() => {
                    setAssigningOrg(false)
                }}
            />
        </Typography>
    </>
};

function StaffingReminderDialog(props) {
    const classes = useStyles();
    const {onClose, open, eventLine} = props;
    const [staffingReminderText, setStaffingReminderText] = useState("");

    return (
        <Dialog onClose={() => onClose(false)} aria-labelledby="eventStatus-diag-title" open={open}>
            <DialogTitle id="eventStatus-diag-title">
                Send reminder to {eventLine.organization.name} to continue staffing
            </DialogTitle>


            <Typography className={classes.margin} gutterBottom variant="subtitle1" component="p">
                Enter a custom message or leave blank if you want to send the default reminder.
            </Typography>
            <TextField
                className={classes.margin}
                id="staffingreminder-text-area"
                label="Custom Reminder Message"
                multiline
                rows={4}
                variant="outlined"
                value={staffingReminderText}
                onChange={(e) => setStaffingReminderText(e.target.value)}
            />

            <DialogActions>
                <ButtonGroup>
                    <Button color="secondary" variant={"contained"} className="card-footer-item button is-danger mr-1"
                            onClick={() => onClose(true, staffingReminderText)}>
                        Send
                    </Button>
                    <Button color="secondary" variant={"outlined"} className="card-footer-item button is-primary"
                            onClick={() => onClose(false)}>
                        Cancel
                    </Button>
                </ButtonGroup>
            </DialogActions>
        </Dialog>
    );
}

const useStyles = makeStyles((theme) => ({
    hidden: {
        display: "none"
    },
    margin: {
        marginLeft: theme.spacing(2),
        marginRight: theme.spacing(2)
    }
}));

export default EventLines;