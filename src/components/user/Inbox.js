import React, {useState} from 'react';
import {Card, CardContent, Container, Grid, Tab, Tabs, Typography} from "@material-ui/core";


import {getBase} from "../../js/FetchBase";
import {dateArrayToDate} from "../../js/DateTime";
import PagedList from "../util/PagedList";
import {useSnackbar} from "notistack";
import {makeStyles} from "@material-ui/styles";

const Inbox = () => {
    const user = JSON.parse(localStorage.getItem("user"));
    let notificationDate = null;
    const [notification, setNotification] = useState(null)
    const [isDisplayingUrgent, setIsDisplayingUrgent] = useState(false)
    const {enqueueSnackbar} = useSnackbar();
    let forceUpdateFnc;
    const classes = useStyles();

    async function fetchNotifications(activePage) {
        try {
            return await getBase("/user/inbox/" + localStorage.getItem('user.id') + "/pending/" + activePage);
        } catch {
            enqueueSnackbar('Something went wrong while trying to fetch your notifications', {
                variant: 'error',
            });
        }
    }

    function confirmUrgent(urgent) {
        setIsDisplayingUrgent(urgent)
        if (forceUpdateFnc !== undefined) forceUpdateFnc();
    }

    const ShowFullNotification = () => {
        if (notification === null) {
            return <Card>
                <CardContent>
                    <Typography variant="h5">
                        No notification selected
                    </Typography>
                </CardContent>
            </Card>
        }
        let date = dateArrayToDate(notification.creationDate);
        notificationDate = date.toISOString().split('T')[0];
        return <Card>
            <CardContent>
                <Typography variant="h5">{notification.title}  </Typography>
                <Typography variant="subtitle1">
                    <p className="has-text-right">{notificationDate}</p>
                    <p>{notification.body}</p>
                </Typography>
            </CardContent>
        </Card>
    }

    const RenderNotifications = (props) => {
        forceUpdateFnc = props.update;
        const not = props.data;
        if (isDisplayingUrgent && not.urgency !== "URGENT") return "";

        return <Card  variant="outlined" key={props.key} onClick={() => {
            setNotification(not);
        }}>
            <CardContent>
                <Typography variant="body1">
                    <p>{not.title}</p>
                    <p>{not.body}</p>
                </Typography>
            </CardContent>
        </Card>
    }

    const RenderNoNotifications = () => <p>No notifications in your inbox</p>;

    return <article>
        <Typography variant="h4">{user.firstname}'s Inbox</Typography>
        <Grid container
              alignItems="baseline"
        >
            <Grid item xs={6} sm={3} className={classes.margin}>
                <Container>
                    <Tabs
                        indicatorColor="primary"
                        textColor="primary"
                        value={isDisplayingUrgent}
                        centered={true}
                    >
                        <Tab label="ALL" value={false} onClick={() => confirmUrgent(false)}/>
                        <Tab label="URGENT" value={true} onClick={() => confirmUrgent(true)}/>
                    </Tabs>
                </Container>
            </Grid>
            <Grid container
                  spacing={3}
                  alignItems="baseline"

            >
                <Grid item xs={3} sm={3}>
                    <Container>

                    <PagedList fetchDataFnc={fetchNotifications} RenderListItem={RenderNotifications}
                               IsEmptyComponent={RenderNoNotifications}
                               pageControls={{showButtons: false, sizeModifier: "is-small"}}/>
                    </Container>
                </Grid>

                <Grid item xs={9}
                      container
                      direction="row"
                      justify="flex-start"
                      alignItems="stretch"
                >
                    <Container>
                        <ShowFullNotification/>
                    </Container>

                </Grid>

            </Grid>
        </Grid>
    </article>
}

const useStyles = makeStyles((theme) => ({
    margin: {
        marginBottom: theme.spacing(1),
    },
}));

export default Inbox