import {getBase} from "../../js/FetchBase";
import PagedList from "../util/PagedList";
import React, {useEffect, useState} from "react";
import {dateArrayToDate} from "../../js/DateTime";
import {useSnackbar} from 'notistack';
import {
    Button,
    Container,
    Dialog,
    DialogContent,
    DialogContentText,
    DialogTitle,
    FormControl,
    InputLabel,
    MenuItem,
    Paper,
    Select,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography
} from "@material-ui/core";

const NotificationOverview = () => {
    const [modal, setModal] = useState({
        isActive: false,
        title: "",
        body: "",
        creationDate: "",
        creationTime: "",
        type: "",
        urgency: "",
        usedChannel: "",
        userId: "",
        eventId: "",
        price: "",
        priceCurrency: "",


    });
    const [notificationType, setNotificationType] = useState([])
    const [event, setEvent] = useState([])
    const [chosenType, setChosenType] = useState('ALL')
    const [chosenEvent, setChosenEvent] = useState('ALL')
    const [loadingEvents, setLoadingEvents] = useState(true)
    const [loadingType, setLoadingType] = useState(true)
    const {enqueueSnackbar} = useSnackbar();
    let forceRerender = () => {
    };

    async function fetchNotifications(activePage) {
        try {
            if (chosenType !== 'ALL' && chosenEvent === 'ALL') {
                return await getBase("/admin/notifications/type/" + chosenType + "?page=" + activePage);
            }
            if (chosenEvent !== 'ALL' && chosenType === 'ALL') {
                return await getBase("/admin/notifications/event/" + chosenEvent + "?page=" + activePage)
            }
            if (chosenType !== 'ALL' && chosenEvent !== 'ALL') {
                return await getBase("/admin/notifications/type/" + chosenType + "/event/" + chosenEvent + "?page=" + activePage)
            }
            return await getBase("/admin/notifications?page=" + activePage);
        } catch {
            enqueueSnackbar("Something went wrong while fetching all notifications", {
                variant: 'error',
            });
        }
    }

    async function fetchNotificationTypes() {
        const result = await getBase("/admin/notificationTypes")
        result.notificationTypes.unshift("ALL")
        setNotificationType(result);
        setLoadingType(false)
        return result;
    }

    async function fetchEvents() {
        const result = await getBase("/admin/eventId")
        let set = [...new Set(result.event)]
        set = set.filter(s => s !== null)
        set.unshift("ALL")
        setEvent(set)
        setLoadingEvents(false)
        return result
    }

    useEffect(() => {
        fetchNotificationTypes();
    }, [loadingType]);

    useEffect(() => {
        fetchEvents();
    }, [loadingEvents]);

    useEffect(() => {
        forceRerender();
    }, [chosenType]);

    useEffect(() => {
        forceRerender();
    }, [chosenEvent]);

    const RenderNotificationType = () => {
        if (loadingType) return <MenuItem>Notification Types</MenuItem>
        return <TableCell  >
            <FormControl>
                <InputLabel>NotificationType</InputLabel>
                <Select
                    value={chosenType}
                    onChange={e => {
                        setChosenType(e.target.value)
                        console.log(e)
                    }}
                >
                    {notificationType.notificationTypes.map(t =>
                        <MenuItem value={t}>{t}</MenuItem>
                    )}
                </Select>
            </FormControl>
        </TableCell>

    }

    const RenderEvents = () => {
        if (loadingEvents) return <MenuItem>Events</MenuItem>
        return <TableCell width={150} >
            <FormControl>
                <InputLabel>Event</InputLabel>
                <Select
                    value={chosenEvent}
                    onChange={e => {
                        setChosenEvent(e.target.value)
                    }}
                >
                    {event.map(t =>
                        <MenuItem value={t}>{t}</MenuItem>
                    )}
                </Select>
            </FormControl>
        </TableCell>

    }
    const RenderNotifications = (props) => {
        const not = props.data;
        forceRerender = props.update
        let date = dateArrayToDate(not.creationDate).toLocaleDateString();
        let time = dateArrayToDate(not.creationDate).toLocaleTimeString();
        let price = '-'
        if (not.price !== null){
            price = not.price
        }
        return <TableRow>
            <TableCell width={150}>{date}</TableCell>

            <TableCell width={250} align={"left"}>{not.title}</TableCell>

            <TableCell width={100}>{not.userId}</TableCell>

            <TableCell width={150}>{not.eventId}</TableCell>

            <TableCell>{not.type}</TableCell>

            <TableCell>{not.usedChannel}</TableCell>
            <TableCell> <Button color={"secondary"}
                                onClick={() => setModal(() => ({
                                    title: not.title,
                                    body: not.body,
                                    creationDate: date,
                                    creationTime: time,
                                    type: not.type,
                                    urgency: not.urgency,
                                    usedChannel: not.usedChannel,
                                    userId: not.userId,
                                    eventId: not.eventId,
                                    price: price,
                                    priceCurrency: not.priceCurrency,
                                    isActive: true
                                }))}>Details
            </Button>
            </TableCell>
        </TableRow>
    }

    function closeModal() {
        setModal({...modal, isActive: false})
    }

    const RenderDetailsModal = () => {
        if (!modal.isActive) return "";
        return <Dialog
            open={modal.isActive}
            onClose={closeModal}>
            <DialogTitle>
                <Typography variant={"h5"}>{modal.title}</Typography>
            </DialogTitle>
            <DialogContent>
                <DialogContentText>
                    <Typography variant={"body2"}>
                        <p><b>Date:</b> {modal.creationDate} <b>Time: </b>{modal.creationTime}</p>
                        <p><b>UserId: </b>{modal.userId}</p>
                        <p><b>EventId: </b>{modal.eventId}</p>
                        <p><b>Type: </b>{modal.type}</p>
                        <p><b>Urgency: </b>{modal.urgency}</p>
                        <p><b>Channel: </b>{modal.usedChannel}</p>
                        <p><b>Message: </b>{modal.body}</p></Typography>
                    <p><b>Price: </b>{modal.priceCurrency} {modal.price}</p>

                </DialogContentText>
            </DialogContent>
        </Dialog>
    }

    const RenderNoNotifications = (props) => {
        forceRerender = props.update
        return <TableBody>
            <TableRow>
        <TableCell>No notifications in your overview</TableCell>
            </TableRow>
        </TableBody>
    }


    return <Container>
        <Typography gutterBottom variant="h5" component="h2">
            Overview Notifications</Typography>
        <TableContainer component={Paper}>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell width={150}>Date</TableCell>
                        <TableCell width={250}>Title</TableCell>
                        <TableCell width={100}>UserId</TableCell>

                        <RenderEvents/>
                        <RenderNotificationType/>
                        <TableCell width={150}>Channel</TableCell>
                        <TableCell width={150}>Details</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    <RenderDetailsModal/>

                    <PagedList fetchDataFnc={fetchNotifications} RenderListItem={RenderNotifications}
                               IsEmptyComponent={RenderNoNotifications}
                               pageControls={{showButtons: false, sizeModifier: "is-medium"}}/>
                </TableBody>
            </Table>
        </TableContainer>
    </Container>
};
export default NotificationOverview
