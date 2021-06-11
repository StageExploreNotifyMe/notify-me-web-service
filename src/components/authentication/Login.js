import React, {useState} from "react";
import {postBase} from "../../js/FetchBase";
import {makeStyles} from "@material-ui/styles";
import {useHistory} from "react-router-dom";
import {useSnackbar} from 'notistack';
import {
    Button,
    Container,
    FormControl,
    IconButton,
    Input,
    InputAdornment,
    InputLabel,
    Paper,
    Typography
} from "@material-ui/core";
import {Visibility, VisibilityOff} from "@material-ui/icons";
import EmailIcon from '@material-ui/icons/Email';

const Login = (props) => {
    const [showPassword, setShowPassword] = useState(false);
    const [loginStep, setLoginStep] = useState(1);
    const [loginDetails, setLoginDetails] = useState({id: '', password: '', authCode: ''});

    const {enqueueSnackbar} = useSnackbar();
    const history = useHistory();
    const classes = useStyles();

    function onLogin(resp) {
        let route = "/";
        localStorage.setItem("Authorization", resp.jwt);
        let user = resp.userDto;
        localStorage.setItem("user.id", user.id);
        localStorage.setItem("user", JSON.stringify(user));
        localStorage.setItem("IsLoggedIn", "true");

        if (user.roles.includes("LINE_MANAGER") || user.roles.includes("VENUE_MANAGER") || user.roles.includes("ADMIN")) {
            route = "/venue/select"
        }

        return route;
    }

    function onClick(e) {
        e.preventDefault();

        if (loginStep === 1) {
            postBase("/authentication/login", JSON.stringify(loginDetails)).then(() => {
            }).catch(() => {
                enqueueSnackbar("Something went wrong while trying to send you your 2FA code", {
                    variant: 'error',
                });
            })
            setLoginStep(2)
        } else {
            postBase("/login", JSON.stringify(loginDetails)).then((resp) => {
                let route = onLogin(resp);
                if (props.onSuccess) {
                    props.onSuccess(Math.random());
                }
                history.push(route);
            }).catch(() => {
                enqueueSnackbar("Something went wrong while trying to log in", {
                    variant: 'error',
                });
            })
        }

    }

    return <Container maxWidth={"sm"}>
        <Typography gutterBottom variant="h3" component="h1" align="center" className={classes.margin}>
            Log in
        </Typography>
        <Paper>
            <Typography gutterBottom variant="body1" component="div" align="center"
                        className={loginStep === 1 ? "" : classes.isHidden}>
                <FormControl className={loginStep === 1 ? classes.inputWidth : classes.isHidden}>
                    <InputLabel htmlFor="standard-adornment-email">Email</InputLabel>
                    <Input
                        id="standard-adornment-email"
                        type={'text'}
                        fullWidth={true}
                        value={loginDetails.id}
                        onChange={e => {
                            setLoginDetails(() => {
                                return {...loginDetails, id: e.target.value}
                            })
                        }}
                        endAdornment={
                            <InputAdornment position="end"><EmailIcon/></InputAdornment>
                        }
                    />
                </FormControl>
            </Typography>
            <Typography gutterBottom variant="body1" component="div" align="center"
                        className={loginStep === 1 ? "" : classes.isHidden}>
                <FormControl className={loginStep === 1 ? classes.inputWidth : classes.isHidden}>
                    <InputLabel htmlFor="standard-adornment-password">Password</InputLabel>
                    <Input
                        id="standard-adornment-password"
                        type={showPassword ? 'text' : 'password'}
                        fullWidth={true}
                        value={loginDetails.password}
                        onChange={e => {
                            setLoginDetails(() => {
                                return {...loginDetails, password: e.target.value}
                            })
                        }}
                        endAdornment={
                            <InputAdornment position="end">
                                <IconButton
                                    aria-label="toggle password visibility"
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? <Visibility/> : <VisibilityOff/>}
                                </IconButton>
                            </InputAdornment>
                        }
                    />
                </FormControl>
            </Typography>
            <Typography gutterBottom variant="body1" component="div" align="center"
                        className={loginStep === 2 ? "" : classes.isHidden}>
                <FormControl className={loginStep === 2 ? classes.inputWidth : classes.isHidden}>
                    <InputLabel htmlFor="standard-adornment-2fa">2 Factor Authentication Code</InputLabel>
                    <Input
                        id="standard-adornment-2fa"
                        type={'text'}
                        fullWidth={true}
                        value={loginDetails.authCode}
                        onChange={e => {
                            setLoginDetails(() => {
                                return {...loginDetails, authCode: e.target.value}
                            })
                        }}
                    />
                </FormControl>
            </Typography>
            <Typography gutterBottom variant="body1" component="div" align="center">
                <Button id={"loginButton"} className={classes.margin} onClick={onClick}>
                    {loginStep === 1 ? "Log in" : ""}
                    {loginStep === 2 ? "Verify code" : ""}
                </Button>
            </Typography>
        </Paper>
    </Container>
}

const useStyles = makeStyles((theme) => ({
    margin: {
        margin: theme.spacing(1),
    },
    isHidden: {
        display: "none"
    },
    inputWidth: {
        width: "90%",
    }
}));

export default Login;