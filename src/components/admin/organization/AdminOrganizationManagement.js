import PagedList from "../../util/PagedList";
import React, {useState} from "react";
import {useHistory} from "react-router-dom";
import {getBase, patchBase} from "../../../js/FetchBase";

import EditIcon from '@material-ui/icons/Edit';
import {useSnackbar} from "notistack";
import {
    Button,
    Card,
    Container,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Grid,
    IconButton,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TextField,
    Typography
} from "@material-ui/core";
import {makeStyles} from "@material-ui/styles";

const AdminOrganizationManagement = () => {
    const history = useHistory();
    const createOrgLink = "/admin/organizationManagement/create";
    const {enqueueSnackbar} = useSnackbar();
    const classes = useStyles();

    const [editingValues, setEditingValues] = useState({
        openModal: false,
        organization: {
            id: "",
            name: ""
        }
    })

    async function fetchPageData(activePage) {
        try {
            return await getBase("/organization?page=" + activePage);
        } catch {
            enqueueSnackbar('Something went wrong while trying to fetch organizations', {
                variant: 'error',
            });
        }
    }

    const RenderOrganizations = (props) => {
        let org = props.data;
        return <TableRow key={org.id}>
            <TableCell>{org.name}</TableCell>
            <TableCell align={"right"}>
                <IconButton size={"small"} color={"secondary"} onClick={() => {
                    setEditingValues({openModal: true, organization: org, updateFnc: props.update})
                }}>
                    <EditIcon/>
                </IconButton>
            </TableCell>

        </TableRow>
    }

    const RenderNoOrganizations = () => {
         return <TableContainer component={Paper}>
            <Table aria-label="simple table">
                <TableBody>
                    <TableCell> No organizations known in the system yet. Create the first one now by clicking&nbsp;
                        <span className="has-text-link is-clickable" onClick={() => history.push(createOrgLink)}>
                here
            </span>
                        !
                    </TableCell>
                </TableBody>
            </Table>
        </TableContainer>
    };

    function closeModal() {
        setEditingValues({...editingValues, openModal: false})
    }

    function updateOrganization() {
        patchBase("/organization", JSON.stringify({
            id: editingValues.organization.id,
            name: editingValues.organization.name
        })).then(() => {
            editingValues.updateFnc();
            closeModal();
        }).catch(() => {
            enqueueSnackbar('Something went wrong while trying to update this organization', {
                variant: 'error',
            });
        })
    }

    return <>
        <Container maxWidth={"md"}>
            <Grid container spacing={2} className={classes.margin}>
                <Grid item xs={9}>
                    <Typography variant="h4" component="h2">Organization Management</Typography>
                </Grid>
                <Grid item xs={3}>
                    <Typography variant="body1" component="div" align={"right"}>
                        <Button variant={"outlined"} color={"secondary"} onClick={() => {
                            history.push(createOrgLink)
                        }} className="button is-link level-item">
                            Create Organization
                        </Button>
                    </Typography>
                </Grid>
            </Grid>
            <TableContainer component={Paper} className={classes.margin}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Organization Name</TableCell>
                            <TableCell> </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        <PagedList fetchDataFnc={fetchPageData} RenderListItem={RenderOrganizations}
                                   IsEmptyComponent={RenderNoOrganizations}/>
                    </TableBody>
                </Table>
            </TableContainer>
        </Container>

        <section className={`modal ${editingValues.openModal ? "is-active" : ""}`}>
            <Dialog open={editingValues.openModal}
                    onClose={closeModal}>
                <div>
                    <DialogTitle><Typography gutterBottom variant="h5" component="h2">Rename
                        Organization</Typography></DialogTitle>
                    <DialogContent>
                        <TextField id={"editOrg"} value={editingValues.organization.name}
                               onChange={(e) => setEditingValues({
                                   ...editingValues,
                                   organization: {
                                       ...editingValues.organization,
                                       name: e.target.value
                                   }
                               })}/>

                    </DialogContent>
                    <DialogActions>
                        <Card>
                            <Button variant="contained" color={"primary"}  onClick={updateOrganization}>Save
                            </Button>
                            <Button color={"secondary"} onClick={closeModal}>Cancel</Button>
                        </Card>


                        <Button className="modal-close is-large" aria-label="close" onClick={closeModal}/>
                    </DialogActions>
                </div>
            </Dialog>
        </section>
    </>
};

const useStyles = makeStyles((theme) => ({
    margin: {
        marginTop: theme.spacing(1),
        marginBottom: theme.spacing(1)
    }
}));

export default AdminOrganizationManagement