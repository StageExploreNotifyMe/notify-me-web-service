import PagedList from "../util/PagedList";
import React from "react";
import {useHistory} from "react-router-dom";
import {getBase} from "../../js/FetchBase";
import EditIcon from '@material-ui/icons/Edit';
import {useSnackbar} from 'notistack';
import {
    Button,
    Container,
    IconButton, makeStyles,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
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
        return <TableContainer component={Paper}>
            <Table aria-label="simple table">
                <TableBody>
                    <TableCell>{venue.name}</TableCell>
                    <TableCell align={"right"}>
                        <IconButton onClick={() => {
                            localStorage.setItem("editVenue", JSON.stringify(venue));
                            history.push("/admin/venue/edit")
                        }}>
                            <EditIcon color={"secondary"}/>
                        </IconButton>
                    </TableCell>
                </TableBody>
            </Table>
        </TableContainer>


    }

    const RenderNoVenues = () => {
        return <TableContainer component={Paper}>
            <Table aria-label="simple table">
                <TableBody>
                    <TableCell> No venues known in the system yet. Create the first one now by clicking&nbsp;
                        <span className={classes.clickable} onClick={() => history.push(createVenueLink)}>
                here
            </span>
                        !
                    </TableCell>
                </TableBody>
            </Table>
        </TableContainer>

    };


    return <Container>
        <Typography gutterBottom variant="h5" component="h2">Venue Management</Typography>
        <Button color={"secondary"} onClick={() => {
            history.push(createVenueLink)
        }}>
            Create venue
        </Button>

        <Typography gutterBottom variant="h6" component="h2">Venues</Typography>
        <PagedList fetchDataFnc={fetchPageData} RenderListItem={RenderVenues}
                   IsEmptyComponent={RenderNoVenues}/>
    </Container>;
};


const useStyles = makeStyles((theme) => ({
    clickable: {...isClickable}
}));

export default AdminVenueManagement