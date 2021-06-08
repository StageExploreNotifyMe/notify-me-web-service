import {useHistory} from "react-router-dom";
import {Button, Card, CardActions, CardContent, Grid, Typography} from "@material-ui/core";
import UnlockAccess from "./authentication/UnlockAccess";
import {makeStyles} from "@material-ui/styles";

const Home = () => {
    const history = useHistory();
    const classes = useStyles();

    const NavigationCard = (props) => {
        return (<UnlockAccess request={props.cardData.request}>
            <Grid item xs={4}>
                <Card>
                    <CardContent>
                        <Typography gutterBottom variant="h5" component="h2">
                            {props.cardData.title}
                        </Typography>
                    </CardContent>
                    <CardActions>
                        <Button size="small" color="secondary" onClick={(e) => {
                            e.preventDefault();
                            history.push(props.cardData.url)
                        }}>
                            Open
                        </Button>
                    </CardActions>
                </Card>
            </Grid>
        </UnlockAccess>);
    };

    return <Grid
        container
        direction="row"
        justify="flex-start"
        alignItems="flex-start"
        spacing={2}
        className={classes.root}
    >
        <NavigationCard cardData={{title: "User details", url: "/user", request: ['ANY']}}/>
        <NavigationCard cardData={{
            title: "Organization details",
            url: "/organizations",
            request: ['MEMBER', 'ORGANIZATION_LEADER']
        }}/>
        <NavigationCard
            cardData={{
                title: "Event Management",
                url: "/venue/events",
                request: ['VENUE_MANAGER', 'LINE_MANAGER']
            }}/>
        <NavigationCard cardData={{title: "Line Management", url: "/venue/lines", request: ['VENUE_MANAGER']}}/>
        <NavigationCard cardData={{title: "Admin Page", url: "/admin", request: ['ADMIN']}}/>
        <NavigationCard cardData={{title: "Log in", url: "/login", request: ['NONE']}}/>
    </Grid>
}
const useStyles = makeStyles((theme) => ({
    root: {
        margin: "0.5%",
        maxWidth: "99%"
    }
}));

export default Home