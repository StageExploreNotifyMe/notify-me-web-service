import PagedList from "../util/PagedList";
import React from "react";
import {useHistory} from "react-router-dom";
import {getBase} from "../../js/FetchBase";
import EditIcon from '@material-ui/icons/Edit';
import {useSnackbar} from 'notistack';
import {
    Button,
    Container,
    Grid,
    IconButton,
    makeStyles,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography
} from "@material-ui/core";
import {isClickable} from "../../style/StyleUtils";

const AdminVenueManagement = () => {

    const classes = useStyles();
    const history = useHistory();
    const createVenueLink = "/admin/venue/create";
    const {enqueueSnackbar} = useSnackbar();

    async function fetchPageData(activePage) {
        try {
            return await getBase("/admin/venue?page=" + activePage);
        } catch {
            enqueueSnackbar("Something went wrong while trying to fetch venues", {
                variant: 'error',
            });
        }
    }

    const RenderVenues = (props) => {
        let venue = props.data;
        return <TableRow>
            <TableCell>{venue.name}</TableCell>
            <TableCell align={"right"}>
                <IconButton onClick={() => {
                    localStorage.setItem("editVenue", JSON.stringify(venue));
                    history.push("/admin/venue/edit")
                }}>
                    <EditIcon color={"secondary"}/>
                </IconButton>
            </TableCell>
        </TableRow>
    }

    const RenderNoVenues = () => {
        return <TableRow>
            <TableCell> No venues known in the system yet. Create the first one now by clicking&nbsp;
                <span className={classes.clickable} onClick={() => history.push(createVenueLink)}>
                here
            </span>
                !
            </TableCell>
        </TableRow>

    };


    return <Container maxWidth={"md"}>
        <Grid container spacing={2} className={classes.margin}>
            <Grid item xs={10}>
                <Typography gutterBottom variant="h4" component="h2">Venue Management</Typography>
            </Grid>
            <Grid item xs={2}>
                <Typography variant="body1" component="div" align={"right"}>
                    <Button variant={"outlined"} color={"secondary"} onClick={() => {
                        history.push(createVenueLink)
                    }}> Create venue
                    </Button>
                </Typography>
            </Grid>
        </Grid>
        <TableContainer component={Paper} className={classes.margin}>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>Venue Name</TableCell>
                        <TableCell> </TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    <PagedList fetchDataFnc={fetchPageData} RenderListItem={RenderVenues}
                               IsEmptyComponent={RenderNoVenues}/>
                </TableBody>
            </Table>
        </TableContainer>
    </Container>;
};


const useStyles = makeStyles((theme) => ({
    clickable: {...isClickable},
    margin: {
        marginTop: theme.spacing(1),

    }
}));

export default AdminVenueManagement