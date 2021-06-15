import PagedList from "../../util/PagedList";
import React from "react";
import {useHistory} from "react-router-dom";
import {getBase} from "../../../js/FetchBase";
import {useSnackbar} from 'notistack';
import {
    Button,
    Container,
    Grid, IconButton,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Tooltip,
    Typography
} from "@material-ui/core";
import {makeStyles} from "@material-ui/styles";
import {isClickable} from "../../../style/StyleUtils";
import EditIcon from "@material-ui/icons/Edit";

const ManageLines = () => {

    const history = useHistory();
    const createLineLink = "/venue/lines/create";
    const venue = JSON.parse(localStorage.getItem("venue"));
    const {enqueueSnackbar} = useSnackbar();
    const classes = useStyles();

    async function fetchPageData(activePage) {
        try {
            return await getBase("/line/venue/" + venue.id + "?page=" + activePage);
        } catch {
            enqueueSnackbar('Something went wrong while trying to fetch your lines', {
                variant: 'error',
            });
        }
    }

    const RenderLines = (props) => {
        let line = props.data;
        return <TableRow key={line.id}>
            <TableCell>
                <Tooltip title={line.description}>
                    <p>{line.name}</p>
                </Tooltip>
            </TableCell>
            <TableCell>Required people: {line.numberOfRequiredPeople}</TableCell>
            <TableCell width={100} align="center">
                <IconButton className={classes.clickable} onClick={() => {
                    localStorage.setItem("editLine", JSON.stringify(line));
                    history.push("/venue/lines/edit");
                }}>
                   <EditIcon color={"secondary"}/>
                </IconButton>
            </TableCell>
        </TableRow>
    }

    const RenderNoLines = () => {
        return <TableCell colSpan={3}>
            No lines for your venue yet. Create the first one now by clicking&nbsp;
            <span className={classes.clickable} onClick={() => history.push(createLineLink)}>
                here
            </span>
            !
        </TableCell>
    };

    return <Container maxWidth="lg">
        <Grid
            container
            direction="row"
            justify="flex-start"
            alignItems="center"
        >
            <Grid item xs={7} sm={10}>
                <Typography gutterBottom variant="h3" component="h2">
                    Line Management
                </Typography>
            </Grid>
            <Grid item xs={5} sm={2}>
                <Button variant="contained" color="primary" onClick={() => {
                    history.push(createLineLink)
                }} className="button is-link level-item">
                    Create Line
                </Button>
            </Grid>
        </Grid>


        <TableContainer component={Paper}>
            <Table>
                <TableHead>
                    <TableCell>Name</TableCell>
                    <TableCell>Required people</TableCell>
                    <TableCell width={100} align="center">Edit</TableCell>
                </TableHead>
                <TableBody>
                    <PagedList fetchDataFnc={fetchPageData} RenderListItem={RenderLines}
                               IsEmptyComponent={RenderNoLines}/>
                </TableBody>
            </Table>
        </TableContainer>

    </Container>
};

const useStyles = makeStyles((theme) => ({
    clickable: {...isClickable}
}));

export default ManageLines