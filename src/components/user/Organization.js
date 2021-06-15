import React, {useState} from 'react';
import {useSnackbar} from 'notistack';
import {Button, ButtonGroup, Checkbox, TableCell, TableRow} from "@material-ui/core";

const Organization = (props) => {

    const [joinedState, setJoinedState] = useState({
        joined: props.content.hasJoined,
        showConfirmButtons: false,
        disableCheckbox: (props.content.status === "PENDING" || props.content.status === "DECLINED")
    })
    const {enqueueSnackbar} = useSnackbar();

    function checkboxClicked(e) {
        let currVal = e.target.checked;
        setJoinedState(() => ({joined: currVal, showConfirmButtons: true}))
    }

    function confirmClicked(saved) {
        let joined = joinedState.joined;
        if (!saved) joined = !joined;
        setJoinedState(() => ({joined: joined, showConfirmButtons: false}))
        if (!saved) return;

        if (joined) {
            submitJoinRequest();
        } else {
            leaveOrganisation();
        }
    }

    function submitJoinRequest() {
        const requestOptions = {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({userId: localStorage.getItem('user.id'), organizationId: props.content.id})
        };

        fetch(process.env.REACT_APP_SERVER_URL + "/userorganization/request/join", requestOptions).then(resp => resp.json()).then(() => {
            enqueueSnackbar(`You've submitted a request to join ${props.content.name}!`, {
                variant: 'success',
            });
        }).catch(() => {
            setJoinedState((prev) => ({joined: !prev.joined, showConfirmButtons: false}))
            enqueueSnackbar('Something went wrong while trying to save your data', {
                variant: 'error',
            });
        })
    }

    function leaveOrganisation() {
        enqueueSnackbar('Not implemented yet!', {
            variant: 'error',
        });
    }

    return (<TableRow>
            <TableCell padding="checkbox">
                <Checkbox color="secondary"
                          disabled={joinedState.showConfirmButtons || joinedState.disableCheckbox}
                          checked={joinedState.joined} onChange={checkboxClicked}
                />
            </TableCell>
            <TableCell width={350}>
                {props.content.name}
            </TableCell>
            <TableCell width={350}>
                {props.content.status}
            </TableCell>
            <TableCell>
                <ButtonGroup>
                    <Button disabled={!joinedState.showConfirmButtons} color="secondary" variant={"contained"}
                            onClick={() => confirmClicked(true)}>Save</Button>
                    <Button disabled={!joinedState.showConfirmButtons} color="secondary"
                            onClick={() => confirmClicked(false)}>Cancel</Button>
                </ButtonGroup>
            </TableCell>
        </TableRow>
    )
}

export default Organization