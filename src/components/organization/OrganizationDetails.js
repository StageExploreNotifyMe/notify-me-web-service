import {useHistory} from "react-router-dom";

import React from 'react';
import UnlockAccess from "../authentication/UnlockAccess";
import {Button, Card, CardActions, CardContent, Container, Grid, Typography} from "@material-ui/core";
import {makeStyles} from "@material-ui/styles";

const OrganizationDetails = () => {
    const history = useHistory();
    const classes = useStyles();
    const org = JSON.parse(localStorage.getItem("organization"));
    if (org.id === undefined) {
        history.push("/organizations");
    }

    const OrganizationNavCard = (props) => {
        return (<Grid item xs={4}><Card>
            <CardContent>
                <Typography gutterBottom variant="h6" component="h3">{props.card.title} </Typography>
                {props.card.body}
            </CardContent>
            <CardActions>
                <Button size="small" color="secondary"
                        onClick={(e) => {
                            e.preventDefault();
                            history.push(props.card.link)
                        }}>
                    Open
                </Button>
            </CardActions>
        </Card></Grid>);
    }

    function changeOrg() {
        localStorage.setItem("userorganization", JSON.stringify({}));
        localStorage.setItem("organization", JSON.stringify({}));
        history.push('/organizations');
    }

    return <Container maxWidth="xl">
        <Typography gutterBottom variant="h3" component="h2">
            Organization {org.name}
        </Typography>
        <Button color="secondary" variant="contained" onClick={() => changeOrg()} className="button is-link">
            Change Organization
        </Button>


        <UnlockAccess request={['ORGANIZATION_LEADER']}>
            <Grid
                container
                direction="row"
                justify="flex-start"
                alignItems="flex-start"
                spacing={2}
                className={classes.gridContainer}
            >
                <OrganizationNavCard card={{
                    title: "Line management",
                    body: "Manage the lines assigned to your organization",
                    link: "/organization/linemanagement"
                }}/>
                <OrganizationNavCard card={{
                    title: "Member Management",
                    body: "Promote and demote members",
                    link: "/organization/membermanagement"
                }}/>
                <OrganizationNavCard card={{
                    title: "Join Requests",
                    body: "See all the pending join requests for your organization",
                    link: "/organization/pendingrequests"
                }}/>
            </Grid>
        </UnlockAccess>
    </Container>
}

const useStyles = makeStyles((theme) => ({
    gridContainer: {
        marginTop: "0.5%"
    }
}));

export default OrganizationDetails