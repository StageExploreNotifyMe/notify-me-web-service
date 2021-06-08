import {useHistory} from "react-router-dom";
import {Button, Container, Typography} from "@material-ui/core";
import React from "react";

const Logout = (props) => {
    localStorage.setItem("Authorization", "");
    localStorage.setItem("user.id", "");
    localStorage.setItem("user", JSON.stringify({}));
    localStorage.setItem("userorganization", JSON.stringify({}));
    localStorage.setItem("organization", JSON.stringify({}));
    localStorage.setItem("IsLoggedIn", "false");

    const history = useHistory();
    return <Container>
        <Typography gutterBottom variant="h3" component="h1" align="center">
            You have been logged out
        </Typography>
        <Typography gutterBottom variant="subtitle2" component="p" align="center">
            You've been successfully logged out.
        </Typography>

        <Typography gutterBottom variant="body1" component="p" align="center">
            <Button variant="contained" color="primary" onClick={() => {
                if (props.onSuccess) props.onSuccess(Math.random())
                history.push("/");
            }}>
                Go Home
            </Button>
        </Typography>
    </Container>
}

export default Logout;