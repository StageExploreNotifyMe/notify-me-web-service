import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faEnvelope} from "@fortawesome/free-solid-svg-icons";
import React, {useState} from "react";
import {postBase} from "../../js/FetchBase";
import {makeStyles} from "@material-ui/styles";
import {useHistory} from "react-router-dom";
import {useSnackbar} from 'notistack';
import {Button, FormControl, IconButton, Input, InputAdornment, InputLabel, Typography} from "@material-ui/core";
import {Visibility, VisibilityOff} from "@material-ui/icons";

const Login = (props) => {
    const [showPassword, setShowPassword] = useState(false);
    const [loginDetails, setLoginDetails] = useState({id: '', password: ''});
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

    function performLogin(e) {
        e.preventDefault();
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

    return <>
        <Typography gutterBottom variant="h3" component="h1" align="center" className={classes.margin}>
            Log in
        </Typography>

        <Typography gutterBottom variant="body1" component="div" align="center">
            <FormControl>
                <InputLabel htmlFor="standard-adornment-email">Email</InputLabel>
                <Input
                    id="standard-adornment-email"
                    type={'text'}
                    value={loginDetails.id}
                    onChange={e => {
                        setLoginDetails(() => {
                            return {...loginDetails, id: e.target.value}
                        })
                    }}
                    endAdornment={
                        <InputAdornment position="end">
                            <FontAwesomeIcon icon={faEnvelope}/>
                        </InputAdornment>
                    }
                />
            </FormControl>
        </Typography>
        <Typography gutterBottom variant="body1" component="div" align="center">
            <FormControl>
                <InputLabel htmlFor="standard-adornment-password">Password</InputLabel>
                <Input
                    id="standard-adornment-password"
                    type={showPassword ? 'text' : 'password'}
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
        <Typography gutterBottom variant="body1" component="div" align="center">
            <Button className={classes.margin} onClick={(e) => performLogin(e)}>
                Log in
            </Button>
        </Typography>
    </>
}

const useStyles = makeStyles((theme) => ({
    margin: {
        margin: theme.spacing(1),
    }
}));

export default Login;