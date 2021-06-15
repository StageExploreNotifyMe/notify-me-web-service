import {Button, FormControl, TextField, Typography} from "@material-ui/core";
import React, {useState} from "react";
import {postBase} from "../../js/FetchBase";
import {useHistory} from "react-router-dom";
import {useSnackbar} from 'notistack';

const ConfirmRegistration = () => {
    const history = useHistory();
    const {enqueueSnackbar} = useSnackbar();

    const [authenticationCodeDto, setAuthenticationCodeDto] = useState({
        email: "",
        sms: "",
        userId: localStorage.getItem("user.id")
    })
    const [validationState, setValidationState] = useState({
        isFullyValid: true,
        noEmail: false,
        noSms: false
    })


    function submitEvent(e) {
        e.preventDefault();
        if (!checkStateIsValid()) return;
        let body = {
            emailCode: authenticationCodeDto.email,
            smsCode: authenticationCodeDto.sms,
            userId : authenticationCodeDto.userId
        };
        postBase("/authentication/confirmed", JSON.stringify(body)).then(() => {
            history.push("/");
            enqueueSnackbar("You have been successfully registered", {
                severity: "success"
            });
        }).catch(() => {
            enqueueSnackbar("Something went wrong while trying to register you", {
                variant: 'error',
            });
        })
        }

        function checkStateIsValid() {
            let validState = {
                noEmail: authenticationCodeDto.email === "",
                noSms: authenticationCodeDto.sms === "",

            };
            let isFullyValid = true;
            Object.keys(validState).forEach(key => {
                if (validState[key]) {
                    isFullyValid = false;
                }
            });
            validState.isFullyValid = isFullyValid;
            setValidationState(validState);
            return isFullyValid;
        }

        return <>
            <Typography gutterBottom variant="body1" component="div" align="center">Confirm your
                registration</Typography>
            <Typography gutterBottom variant="body1" component="div" align="center">
                <FormControl>
                    <TextField id="emailCode"
                        type="text"
                        label={"Email Code"}
                        onChange={e => {
                        setAuthenticationCodeDto(prevState => ({
                            ...prevState,
                            email: e.target.value
                        }))
                        setValidationState(prevState => ({
                            ...prevState,
                            noEmail: e.target.value === "",
                            isFullyValid: true
                        }))
                    }}
                        error={validationState.noEmail}
                        helperText={validationState.noEmail === false ? " " : "You cannot have an empty email code"}>
                    </TextField>
                </FormControl>
            </Typography>
            <Typography gutterBottom variant="body1" component="div" align="center">

                <FormControl>
                    <TextField id="smsCode"
                        type="text"
                        label={"Sms Code"}
                        onChange={e => {
                        setAuthenticationCodeDto(prevState => ({
                            ...prevState,
                            sms: e.target.value
                        }))
                        setValidationState(prevState => ({
                            ...prevState,
                            noSms: e.target.value === "",
                            isFullyValid: true
                        }))
                    }}
                        error={validationState.noSms}
                        helperText={validationState.noSms === false ? " " : "You cannot have an empty email code"}>
                    </TextField>
                </FormControl>
            </Typography>
            <Typography gutterBottom variant="body1" component="div" align="center">
                <Button color={"secondary"} onClick={
                    (e) => submitEvent(e)
                }
                        disabled={!validationState.isFullyValid}>Confirm
                </Button>
            </Typography>
        </>


    }
    export default ConfirmRegistration