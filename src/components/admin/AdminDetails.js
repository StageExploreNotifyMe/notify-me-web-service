import {useHistory} from "react-router-dom";

import React from 'react';
import {Button, Card, CardActions, CardContent, Grid, Typography} from "@material-ui/core";
import {makeStyles} from "@material-ui/styles";

const AdminDetails = () => {

    const history = useHistory();
    const classes = useStyles();


    const AdminNavCard = (props) => {
        return (<Grid item xs={4}>
            <Card>
                <CardContent>
                    <Typography gutterBottom variant="h5" component="h2">
                        {props.card.title}
                    </Typography>
                    <Typography variant={"body1"}>
                        {props.card.body}
                    </Typography>
                </CardContent>
                <CardActions>
                    <Button size="small" color="secondary" onClick={(e) => {
                        e.preventDefault();
                        history.push(props.card.link)
                    }}>
                        Open
                    </Button>
                </CardActions>
            </Card>
        </Grid>);
    }

    return<div>
        <Typography gutterBottom variant="h5" component="h2">Admin Details</Typography>
    <Grid
        container
        direction="row"
        justify="flex-start"
        alignItems="flex-start"
        spacing={2}
        className={classes.root}>

        <AdminNavCard card={{
            title: "Notification details",
            link: "/admin/NotificationOverview",
            body: "See all the information about all the notifications that have been send"
        }}/>

        <AdminNavCard card={{
            title: "Organization Management",
            body: "Manage the organizations known in the system",
            link: "/admin/organizationManagement"
        }}/>
        <AdminNavCard card={{
            title: "Venue Management",
            body: "Manage the venues known in the system",
            link: "/admin/venueManagement"
        }}/>
        <AdminNavCard card={{
            title: "Sent notifications overview",
            body: "See how many messages have been sent via which channels",
            link: "/admin/channels"
        }}/>

    </Grid>
    </div>
}
    const useStyles = makeStyles((theme) => ({
        root: {
            margin: "0.5%",
            maxWidth: "99%"
        }
    }));


export default AdminDetails