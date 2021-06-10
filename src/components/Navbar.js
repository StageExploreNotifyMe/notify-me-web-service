import React from "react";
import {useHistory} from "react-router-dom";
import {AppBar, Button, Toolbar, Typography} from "@material-ui/core";
import {makeStyles} from "@material-ui/styles";
import {isClickable} from "../style/StyleUtils";

const Navbar = () => {
    const history = useHistory();
    const classes = useStyles();

    function navigateTo(url) {
        history.push(url);
    }

    const RenderAuthButtons = () => {
        if (localStorage.getItem("IsLoggedIn") === "true") {
            return <Button color="inherit" onClick={() => navigateTo("/logout")}>
                Log out
            </Button>

        }
        return <>
            <Button color="inherit" onClick={() => navigateTo("/register")}>
                <strong>Sign up</strong>
            </Button>
            <Button color="inherit" onClick={() => navigateTo("/login")}>
                Log in
            </Button>
        </>
    };

    return <>
        <AppBar position="static">
            <Toolbar>
                <Typography variant="h6" className={classes.title} onClick={() => navigateTo("/")}>
                    Notify Me
                </Typography>
                <RenderAuthButtons/>
            </Toolbar>
        </AppBar>
    </>
}

const useStyles = makeStyles((theme) => ({
    title: {flexGrow: 1, ...isClickable},
}));

export default Navbar;