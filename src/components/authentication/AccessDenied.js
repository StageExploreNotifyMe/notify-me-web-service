import {Button, Container, Typography} from "@material-ui/core";
import KeyboardBackspaceIcon from '@material-ui/icons/KeyboardBackspace';
import {useHistory} from "react-router-dom";

const AccessDenied = () => {

    const history = useHistory();
    return <Container>
        <Typography align={"center"} gutterBottom variant="h1" component="h2">403 Access denied</Typography>
        <Typography align={"center"} gutterBottom variant="subtitle1">You don't have permission to access this page, go
            to the home page
            and browse other pages</Typography>
        <Typography align={"center"}>
            <Button onClick={() => {
                history.push("/")
            }} color={"primary"} variant={"contained"}
                    startIcon={<KeyboardBackspaceIcon/>}
            >
                Go back
            </Button>
        </Typography>
    </Container>
};

export default AccessDenied