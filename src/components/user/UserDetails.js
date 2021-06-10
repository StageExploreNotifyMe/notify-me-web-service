import React from 'react';
import {useHistory} from "react-router-dom";
import UserAssignedLines from "./UserAssignedLines";
import UserPreferences from "./UserPreferences";
import UnlockAccess from "../authentication/UnlockAccess";
import {Button, Container, Grid, Typography} from "@material-ui/core";
import NotificationsIcon from '@material-ui/icons/Notifications';

const UserDetails = () => {
    const history = useHistory();
    const user = JSON.parse(localStorage.getItem("user"));

    return <Container>
        <Typography variant="h2">
            {user.firstname} {user.lastname}
        </Typography>
        <Grid container spacing={3}
              direction="row">
        <Grid item  alignContent={"flex-start"}>
                <Button color="secondary" onClick={() => history.push("/user/join/organization")}>
                    Join Organization
                </Button>
            </Grid>
            <Grid item>
                <UnlockAccess request={['ANY']}>
                    <Button color="secondary" onClick={() => history.push("/venue/select")}>Select other venue
                        to manage
                    </Button>
                </UnlockAccess>
            </Grid>
            <Grid item alignContent={'flex-end'}>
                <Button endIcon={<NotificationsIcon/>} color="secondary"
                        onClick={() => history.push("/user/inbox")}>Inbox</Button>
            </Grid>
        </Grid>
        <Grid container spacing={3}
              direction="column">
            <Grid item>
                <UserPreferences/>
            </Grid>
            <Grid item>
                <UnlockAccess request={['MEMBER']}>
                    <section className="section">
                        <UserAssignedLines/>
                    </section>
                </UnlockAccess>
            </Grid>
        </Grid>

    </Container>;

}

export default UserDetails