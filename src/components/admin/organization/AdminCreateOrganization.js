import React, {useState} from "react";
import {useHistory} from "react-router-dom";
import {getBase, postBase} from "../../../js/FetchBase";
import {useSnackbar} from 'notistack';
import PagedList from "../../util/PagedList";
import {Button, ButtonGroup, Container, List, ListItem, Paper, TextField, Typography} from "@material-ui/core";
import {makeStyles} from "@material-ui/styles";

const AdminCreateOrganization = () => {
    const history = useHistory();
    const {enqueueSnackbar} = useSnackbar();
    const [organization, setOrganization] = useState({
        name: "",
        userId: "",
        user: {}
    })
    const [validationState, setValidationState] = useState({
        noUser: false,
        noName: false
    })
    const classes = useStyles();

    function isValidState() {
        let noName = organization.name === "";
        let noUser = organization.userId === "";

        setValidationState(prevState => ({
            ...prevState,
            noName: noName,
            noUser: noUser
        }))

        return (!noName && !noUser);
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
        return <ListItem button onClick={() => setOrganization(prevState => ({
            ...prevState,
            userId: user.id,
            user: user
        }))}
        >                {user.firstname} {user.lastname}

        </ListItem>
    }

    function submitEvent(e) {
        e.preventDefault();
        if (!isValidState()) return;

        postBase("/organization/create", JSON.stringify({
            organizationName: organization.name,
            userId: organization.userId
        })).then(() => {
            history.goBack();
        }).catch((error) => {
            if (error.info.status === 409) {
                enqueueSnackbar('There is already an organization with the name ' + organization.name, {
                    variant: 'error',
                });
            } else {
                enqueueSnackbar('Something went wrong while trying to create your organization', {
                    variant: 'error',
                });
            }
        })
    }

    return <Container>
        <Typography gutterBottom variant="h4" component="h2">Create Organization</Typography>
        <TextField
            className={classes.margin}
            error={validationState.noName}
            helperText={validationState.noName === false ? "" : "An organization must have a name"}
            label={"Organization name"}
            value={organization.name}
            onChange={e => {
                setOrganization(prevState => ({
                    ...prevState,
                    name: e.target.value
                }))
                setValidationState(prevState => ({
                    ...prevState,
                    noName: e.target.value === ""
                }))
            }}>
        </TextField>

        <Typography className={classes.margin} gutterBottom variant="h5" component="h2">Select the organization
            leader{organization.user.firstname !== undefined ? (": " + organization.user.firstname + " " + organization.user.lastname) : ""}</Typography>
        <Paper>
            <List>
                <PagedList fetchDataFnc={fetchUsers} RenderListItem={RenderUsers}
                           IsEmptyComponent={() => <ListItem>No users found</ListItem>}
                           pageControls={{showButtons: true, sizeModifier: "is-small"}}/>
            </List>
        </Paper>
        <p className={`help is-danger ${validationState.noUser ? '' : 'is-hidden'}`}>
            Please select a user to be the organization leader
        </p>

        <ButtonGroup>
            <Button color={"secondary"} variant={"contained"} onClick={
                (e) => submitEvent(e)
            }
                    disabled={validationState.noUser || validationState.noName}> Submit
            </Button>
            <Button color={"secondary"} onClick={
                () => history.goBack()
            }
                    className="button is-link is-light"> Cancel
            </Button>
        </ButtonGroup>
    </Container>;
}

const useStyles = makeStyles((theme) => ({
    margin: {
        marginTop: theme.spacing(1),
        marginBottom: theme.spacing(1)
    }
}));

export default AdminCreateOrganization