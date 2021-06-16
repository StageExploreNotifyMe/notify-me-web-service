import React from 'react';
import {useHistory} from "react-router-dom";
import UserAssignedLines from "./UserAssignedLines";
import UserPreferences from "./UserPreferences";
import UnlockAccess from "../authentication/UnlockAccess";
import {Button, Container, Grid, Typography} from "@material-ui/core";
import NotificationsIcon from '@material-ui/icons/Notifications';
import {getRole} from "../../js/UserUtilFunctions";

const UserDetails = () => {
    const history = useHistory();
    const user = JSON.parse(localStorage.getItem("user"));

    return <Container>
        <Grid container spacing={3}
              direction="row"
              alignItems="center"
        >
            <Grid item sm={6}>
                <Typography variant="h2">
                    {user.firstname} {user.lastname}
                </Typography>
            </Grid>
            <Grid item sm={6}>
                <Typography align={"right"} variant="h4">
                    {getRole(user)}
                </Typography>
            </Grid>
        </Grid>

        <Grid container spacing={3}
              direction="row">
            <Grid item sm={8}>
                <Typography align={"left"} variant="body1" component={"div"}>
                    <Button color="secondary" variant={"outlined"} onClick={() => history.push("/user/join/organization")}>
                        Join Organization
                    </Button>
                    <UnlockAccess request={['VENUE_MANAGER', 'LINE_MANAGER']}>
                        &nbsp;
                        <Button color="secondary" variant={"outlined"} onClick={() => history.push("/venue/select")}>Select
                            other venue
                            to manage
                        </Button>
                    </UnlockAccess>
                </Typography>
            </Grid>
            <Grid item sm={4}>
                <Typography align={"right"} variant="body1" component={"div"}>
                    <Button endIcon={<NotificationsIcon/>} color="secondary" variant={"outlined"}
                            onClick={() => history.push("/user/inbox")}>Inbox</Button>
                </Typography>
            </Grid>
        </Grid>
        <Grid container spacing={3}
              direction="column">
            <Grid item>
                <UserPreferences/>
            </Grid>
            <Grid item>
                <UnlockAccess request={['MEMBER', 'ORGANIZATION_LEADER']}>
                    <section className="section">
                        <UserAssignedLines/>
                    </section>
                </UnlockAccess>
            </Grid>
        </Grid>

    </Container>;

}

export default UserDetails