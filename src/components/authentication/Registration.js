import React, {useState} from "react";
import {postBase} from "../../js/FetchBase";
import {useHistory} from "react-router-dom";
import {useSnackbar} from 'notistack';
import {
    Button,
    Container,
    FormControl,
    IconButton,
    InputAdornment,
    Paper,
    TextField,
    Typography
} from "@material-ui/core";
import {makeStyles} from "@material-ui/styles";
import EmailIcon from "@material-ui/icons/Email";
import {AccountCircle, Visibility, VisibilityOff} from "@material-ui/icons";
import PhoneIcon from '@material-ui/icons/Phone';


const Registration = () => {
    const history = useHistory();
    const classes = useStyles();

    const [registerDto, setRegisterDto] = useState({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        password: "",
        confirmPassword: "",
        showPassword: false
    })
    const [validationState, setValidationState] = useState({
        isFullyValid: true,
        noFirstName: false,
        noLastName: false,
        noMail: false,
        noPhone: false,
        noPassword: false,
        passwordsDontMatch: false
    })
    const {enqueueSnackbar} = useSnackbar();

    function submitEvent(e) {
        e.preventDefault();
        if (!checkStateIsValid()) return;
        let body = {
            firstname: registerDto.firstName,
            lastname: registerDto.lastName,
            email: registerDto.email,
            mobileNumber: registerDto.phone,
            password: registerDto.password
        };
        postBase("/authentication/register", JSON.stringify(body)).then((resp) => {
            history.push("/register/confirmed");
            localStorage.setItem("user.id", resp.id);
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
            noFirstName: registerDto.firstName === "",
            noLastName: registerDto.lastName === "",
            noMail: !checkMailIsValid(registerDto.email),
            noPhone: registerDto.phone === "",
            noPassword: registerDto.password === "",
            passwordsDontMatch: registerDto.password !== registerDto.confirmPassword
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

    function checkMailIsValid(email) {
        if (email === "") return false;
        if (!email.includes("@")) return false;
        if (!email.includes(".")) return false;
        return true;
    }

    return <Container maxWidth={"sm"}>
        <Paper>
            <Typography gutterBottom variant="h4" component="h1" align="center" className={classes.margin}>
                Register now!
            </Typography>
            <Typography gutterBottom variant="body1" component="div" align="center">
                <FormControl className={classes.inputWidth}>
                    <TextField id="firstNameInput"
                               type="text"
                               label={"Firstname"}
                               onChange={e => {
                                   setRegisterDto(prevState => ({
                                       ...prevState,
                                       firstName: e.target.value
                                   }))
                                   setValidationState(prevState => ({
                                       ...prevState,
                                   noFirstName: e.target.value === "",
                                   isFullyValid: true
                               }))
                           }}
                           error={validationState.noFirstName}
                           helperText={validationState.noFirstName === false ? " " : "You cannot have an empty first name"}
                           InputProps={{
                               startAdornment: (
                                   <InputAdornment position="start">
                                       <AccountCircle/>
                                   </InputAdornment>
                               ),
                           }}
                />
            </FormControl>
        </Typography>
        <Typography gutterBottom variant="body1" component="div" align="center">
            <FormControl className={classes.inputWidth}>
                <TextField
                    id="lastNameInput"
                    label={"Lastname"}
                    type="text"
                    onChange={e => {
                        setRegisterDto(prevState => ({
                            ...prevState,
                            lastName: e.target.value
                        }))
                        setValidationState(prevState => ({
                            ...prevState,
                            noLastName: e.target.value === "",
                            isFullyValid: true
                        }))
                    }}
                    error={validationState.noLastName}
                    helperText={validationState.noLastName === false ? " " : "You cannot have an empty last name"}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <AccountCircle/>
                            </InputAdornment>
                        ),
                    }}
                />
            </FormControl>

        </Typography>
        <Typography gutterBottom variant="body1" component="div" align="center">
            <FormControl className={classes.inputWidth}>
                <TextField id="emailInput"
                           type="text"
                           label={"Email"}
                           value={registerDto.email}
                           onChange={e => {
                               setRegisterDto(prevState => ({
                                   ...prevState,
                                   email: e.target.value
                               }))
                               setValidationState(prevState => ({
                                   ...prevState,
                                   noMail: !checkMailIsValid(e.target.value),
                                   isFullyValid: true
                               }))
                           }
                           }
                           error={validationState.noMail}
                           helperText={validationState.noMail === false ? " " : "You cannot have an empty e-mail"}
                           InputProps={{
                               startAdornment: (
                                   <InputAdornment position="start">
                                       <EmailIcon/>
                                   </InputAdornment>
                               ),
                           }}
                />
            </FormControl>
        </Typography>


        <Typography gutterBottom variant="body1" component="div" align="center">

            <FormControl className={classes.inputWidth}>
                <TextField id="phoneInput"
                           type="text"
                           label={"Phone"}
                           value={registerDto.phone}
                           onChange={e => {
                               setRegisterDto(prevState => ({
                                   ...prevState,
                                   phone: e.target.value
                               }))
                               setValidationState(prevState => ({
                                   ...prevState,
                                   noPhone: e.target.value === "",
                                   isFullyValid: true
                               }))
                           }
                           }
                           error={validationState.noPhone}
                           helperText={validationState.noPhone === false ? " " : "You cannot have an empty phone number"}
                           InputProps={{
                               startAdornment: (
                                   <InputAdornment position="start">
                                       <PhoneIcon/>
                                   </InputAdornment>
                               ),
                           }}
                >
                </TextField>
            </FormControl>
        </Typography>
        <Typography gutterBottom variant="body1" component="div" align="center">
            <FormControl className={classes.inputWidth}>
                <TextField id="passwordInput"
                           label={"Password"}
                           type={`${registerDto.showPassword ? "text" : "password"}`}
                           value={registerDto.password}
                           onChange={e => {
                               setRegisterDto(prevState => ({
                                   ...prevState,
                                   password: e.target.value
                               }))
                               setValidationState(prevState => ({
                                   ...prevState,
                                   noPassword: e.target.value === "",
                                   passwordsDontMatch: e.target.value !== registerDto.password,
                                   isFullyValid: true
                               }))
                           }
                           }
                           error={validationState.noPassword}
                           helperText={validationState.noPassword === false ? " " : "You cannot have an empty password"}
                           InputProps={{
                               endAdornment: (
                                   <InputAdornment position="end">
                                       <IconButton
                                           id={"toggle-password-vis-icon-1"}
                                           aria-label="toggle password visibility"
                                           onClick={() => setRegisterDto(prevState => ({
                                               ...prevState,
                                               showPassword: !registerDto.showPassword
                                           }))}
                                       >
                                           {registerDto.showPassword ? <Visibility/> : <VisibilityOff/>}
                                       </IconButton>
                                   </InputAdornment>
                               )

                           }}>


                </TextField>

            </FormControl>
        </Typography>
        <Typography gutterBottom variant="body1" component="div" align="center">
            <FormControl className={classes.inputWidth}>
                <TextField id="passwordRepeatInput"
                           label={"Repeat Password"}
                           type={`${registerDto.showPassword ? "text" : "password"}`}
                           value={registerDto.confirmPassword}
                           onChange={e => {
                               setRegisterDto(prevState => ({
                                   ...prevState,
                                   confirmPassword: e.target.value
                               }))
                               setValidationState(prevState => ({
                                   ...prevState,
                                   passwordsDontMatch: e.target.value !== registerDto.password,
                                   isFullyValid: true
                               }))
                           }
                           }
                           error={validationState.passwordsDontMatch}
                           helperText={validationState.passwordsDontMatch === false ? " " : "Passwords do not match"}
                           InputProps={{
                               endAdornment: (
                                   <InputAdornment position="end">
                                       <IconButton
                                           id={"toggle-password-vis-icon-2"}
                                           aria-label="toggle password visibility"
                                           onClick={() => setRegisterDto(prevState => ({
                                               ...prevState,
                                               showPassword: !registerDto.showPassword
                                           }))}
                                       >
                                           {registerDto.showPassword ? <Visibility/> : <VisibilityOff/>}
                                       </IconButton>
                                   </InputAdornment>
                               )

                           }}>
                </TextField>
            </FormControl>
        </Typography>
            <Typography gutterBottom variant="body1" component="div" align="center">
                <FormControl>
                    <Button color={"secondary"} onClick={
                        (e) => submitEvent(e)
                    }
                            disabled={!validationState.isFullyValid}>
                        Register
                    </Button>
                </FormControl>
            </Typography>
        </Paper>
    </Container>
}


const useStyles = makeStyles((theme) => ({
    margin: {
        margin: theme.spacing(1),
    },
    inputWidth: {
        width: "90%",
    }
}));


export default Registration