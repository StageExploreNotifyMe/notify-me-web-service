import {useHistory} from "react-router-dom";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faExclamationTriangle} from "@fortawesome/free-solid-svg-icons";
import React, {useState} from "react";
import {getBase, patchBase, postBase} from "../../js/FetchBase";

import PagedList from "../util/PagedList";
import {useSnackbar} from "notistack";
import {
    Button,
    ButtonGroup,
    Container,
    FormControl,
    FormHelperText,
    Grid,
    Input,
    InputAdornment,
    InputLabel,
    List,
    ListItem,
    ListSubheader,
    Paper,
    Typography
} from "@material-ui/core";
import {makeStyles} from "@material-ui/styles";

const CreateVenue = (props) => {
    const isCreating = props.action === 'create'
    const history = useHistory();
    const classes = useStyles();
    const [validationState, setValidationState] = useState({
        noName: false,
        noUser: false
    })
    let editDto = {
        id: "",
        name: "",
        venueManagerIds: "",
        users: []
    }
    const {enqueueSnackbar} = useSnackbar();

    if (!isCreating) {
        let toEdit = JSON.parse(localStorage.getItem("editVenue"));
        editDto = {
            id: toEdit.id,
            name: toEdit.name,
            venueManagerIds: toEdit.venueManagers.map(manager => manager.id),
            users: toEdit.venueManagers
        };
    }
    const [venueDto, setVenueDto] = useState(editDto)

    function submitVenue(e) {
        e.preventDefault()
        if (venueDto.name === "") {
            setValidationState(prev => ({
                ...prev, noName: true
            }))
            return;
        }
        let call;
        if (isCreating) {
            call = postBase("/admin/venue/create", JSON.stringify({
                name: venueDto.name,
                venueManagerIds: venueDto.venueManagerIds
            }))
        } else {
            call = patchBase("/admin/venue/edit", JSON.stringify({
                name: venueDto.name,
                id: venueDto.id,
                venueManagers: venueDto.users
            }))
        }
        call.then(() => history.push("/admin/venueManagement")).catch((error) => {
            if (error.info && error.info.status === 409) {
                enqueueSnackbar('There is already a venue with the name ' + venueDto.name, {
                    variant: 'error',
                });
            } else {
                enqueueSnackbar('Something went wrong while trying to create your venue', {
                    variant: 'error',
                });
            }
        })
    }

    async function fetchUsers(activePage) {
        try {
            return await getBase("/user?page=" + activePage);
        } catch {
            enqueueSnackbar('Something went wrong while fetching all users', {
                variant: 'error',
            });
        }
    }

    const RenderUsers = (props) => {
        const user = props.data;
        if (venueDto.users.filter(u => u.id === user.id).length !== 0) return "";

        return <ListItem key={props.key} role="listitem" divider={true} button
                         onClick={() => {
                             setVenueDto(prevState => ({
                                 ...prevState,
                                 venueManagerIds: [...venueDto.venueManagerIds, user.id],
                                 users: [...venueDto.users, user]
                             }))
                         }}>
            {user.firstname} {user.lastname}
        </ListItem>
    }

    const RenderSelectedUsers = () => {
        if (venueDto.users.length === 0) {
            return <ListItem key="none-selected">
                Please select a user to be the venue manager
            </ListItem>
        }

        return venueDto.users.map(user => {
            if (!venueDto.users.includes(user)) return <ListItem key={user.id + "-duplicate"}></ListItem>

            return <ListItem key={user.id} divider={true} button onClick={() => removeUser(user)}>
                <p>{user.firstname} {user.lastname}</p>
            </ListItem>
        })
    }

    function removeUser(user) {
        let users = venueDto.users.filter(v => v !== user);
        setVenueDto({...venueDto, users: users})
        if (users.length === 0) {
            setValidationState({...validationState, noUser: true})
        }
    }

    return <Container maxWidth="lg">
        <Typography gutterBottom variant="h3" component="h2">
            {isCreating ? 'Create' : 'Edit'} Venue
        </Typography>
        <Container maxWidth="md">
            <form>
                <Typography className={classes.margin} gutterBottom variant="body1" component="div" align="center">
                    <FormControl fullWidth>
                        <InputLabel htmlFor="venue-name-input">Venue name</InputLabel>
                        <Input
                            id="venue-name-input"
                            aria-describedby="venue-name-validation"
                            type={'text'}
                            value={venueDto.name}
                            onChange={e => {
                                setVenueDto(prevState => ({
                                    ...prevState,
                                    name: e.target.value
                                }))
                                setValidationState(prevState => ({
                                    ...prevState,
                                    noName: e.target.value === ""
                                }))
                            }}
                            endAdornment={
                                validationState.noName ?
                                    <InputAdornment position="end">
                                        <FontAwesomeIcon icon={faExclamationTriangle}/>
                                    </InputAdornment> : ""
                            }
                            error={validationState.noName}
                        />
                        <FormHelperText hidden={!validationState.noName} error={true} id="venue-name-validation">
                            A venue must have a name
                        </FormHelperText>
                    </FormControl>
                </Typography>

                <Grid container spacing={2} justify="center" alignItems="center">
                    <Grid item>
                        <Paper className={classes.paper}>
                            <List dense component="div" role="list" subheader={
                                <ListSubheader component="li" id="select-list-subheader">
                                    Select venueManagers
                                </ListSubheader>
                            }>
                                <PagedList fetchDataFnc={fetchUsers} RenderListItem={RenderUsers}
                                           IsEmptyComponent={() => <ListItem id="empty">No users found</ListItem>}
                                           pageControls={{showButtons: true, sizeModifier: "is-small"}}/>
                            </List>
                        </Paper>
                    </Grid>
                    <Grid item>
                        <Paper className={classes.paper}>
                            <List dense component="div" role="list" subheader={
                                <ListSubheader component="li" id="selected-list-subheader">
                                    Selected venueManagers
                                </ListSubheader>
                            }>
                                <RenderSelectedUsers/>
                            </List>
                        </Paper>
                    </Grid>
                </Grid>
                <Typography className={classes.margin} gutterBottom variant="body1" component="div" align="center">
                    <ButtonGroup color="secondary" aria-label="contained primary button group">
                        <Button variant="contained" onClick={(e) => submitVenue(e)}
                                disabled={validationState.noName || validationState.noUser}>
                            {isCreating ? "Create" : "Update"}
                        </Button>
                        <Button variant="outlined" onClick={() => history.goBack()}>Cancel</Button>
                    </ButtonGroup>
                </Typography>

            </form>
        </Container>
    </Container>
}

const useStyles = makeStyles((theme) => ({
    margin: {
        margin: theme.spacing(4),
    },
    paper: {
        width: 250,
        height: 350,
        overflow: 'auto',
    },
}));

export default CreateVenue