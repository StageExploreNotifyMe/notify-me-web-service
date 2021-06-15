import React, {useState} from "react";
import {postBase} from "../../js/FetchBase";
import {faBan, faCheck} from '@fortawesome/free-solid-svg-icons'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {useSnackbar} from "notistack";
import {Button, ButtonGroup, TableCell, TableRow} from "@material-ui/core";

const OrganizationRequestUserDetail = (props) => {
    const [chosenOption, setChosenOption] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const {enqueueSnackbar} = useSnackbar();

    function confirmClicked(accepted) {
        let body = {
            userOrganizationId: props.request.id,
            accepted: accepted
        };
        setChosenOption(accepted)
        postBase("/userorganization/request/process", JSON.stringify(body)).then(() => {
            setSubmitted(true)
        }).catch(() => {
            enqueueSnackbar('Something went wrong while trying to save changes for ' + props.request.user.firstname + ' ' + props.request.user.lastname, {
                variant: 'error',
            });
            setSubmitted(false)
        })
    }

    const RenderRequestActions = () => {
        if (submitted) {
            return <>
                {
                    chosenOption ?
                        <span><FontAwesomeIcon icon={faCheck}/></span>
                        :
                        <span><FontAwesomeIcon icon={faBan}/></span>
                }
            </>
        }

        return <ButtonGroup color="secondary" aria-label="outlined primary button group">
            <Button onClick={() => confirmClicked(true)}>Accept</Button>
            <Button onClick={() => confirmClicked(false)}>Reject</Button>
        </ButtonGroup>;
    }

    return <TableRow key={props.request.user.id}>
        <TableCell>{props.request.user.firstname} {props.request.user.lastname}</TableCell>
        <TableCell><RenderRequestActions/></TableCell>
    </TableRow>
}

export default OrganizationRequestUserDetail