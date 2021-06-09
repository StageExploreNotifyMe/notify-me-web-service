import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faExclamationTriangle} from "@fortawesome/free-solid-svg-icons";
import React, {useState} from "react";
import {useHistory} from "react-router-dom";
import {patchBase, postBase} from "../../../js/FetchBase";
import {useSnackbar} from 'notistack';
import {
    Button,
    ButtonGroup,
    Container,
    FormControl,
    FormHelperText,
    Input,
    InputAdornment,
    InputLabel,
    Typography
} from "@material-ui/core";
import {makeStyles} from "@material-ui/styles";

const CreateLine = (props) => {
    const history = useHistory();
    const classes = useStyles();
    const {enqueueSnackbar} = useSnackbar();
    const venue = JSON.parse(localStorage.getItem("venue"));
    let isCreating = (props.action === "create");
    let editLine = {
        name: "",
        description: "",
        numberOfRequiredPeople: 0,
        venueId: venue.id
    };
    if (!isCreating) {
        editLine = JSON.parse(localStorage.getItem("editLine"));
        editLine = {
            ...editLine,
            venueId: editLine.venueDto.id
        };
    }

    const [lineDto, setLineDto] = useState(editLine)
    const [validationState, setValidationState] = useState({
        noName: false,
        numberInvalid: false
    })

    function isValidDto() {
        let noName = (lineDto.name === "");
        let numberInvalid = (lineDto.numberOfRequiredPeople < 1);
        setValidationState({
            noName: noName,
            numberInvalid: numberInvalid
        })
        return (!noName && !numberInvalid)
    }

    function submitEvent(e) {
        e.preventDefault();

        if (!isValidDto()) return;
        let remoteCall;
        if (isCreating) {
            remoteCall = postBase("/line/create", JSON.stringify(lineDto));
        } else {
            remoteCall = patchBase("/line/edit", JSON.stringify(lineDto));
        }

        remoteCall.then(() => history.goBack()).catch(() => {
            enqueueSnackbar('Something went wrong while trying to submitting your line', {
                variant: 'error',
            });
        });
    }

    return <Container maxWidth="lg">
        <Typography gutterBottom variant="h3" component="h2">
            {isCreating ? "Create" : "Edit"} Line
        </Typography>
        <form>
            <Typography className={classes.margin} gutterBottom variant="body1" component="div" align="center">
                <FormControl fullWidth>
                    <InputLabel htmlFor="line-name-input">Line name</InputLabel>
                    <Input
                        id="line-name-input"
                        aria-describedby="line-name-validation"
                        type={'text'}
                        value={lineDto.name}
                        onChange={e => {
                            setLineDto(prevState => ({
                                ...prevState,
                                name: e.target.value
                            }))
                            setValidationState(prevState => ({
                                ...prevState,
                                noName: e.target.value === ""
                            }))
                        }}
                        endAdornment={
                            validationState.noName ?
                                <InputAdornment position="end">
                                    <FontAwesomeIcon icon={faExclamationTriangle}/>
                                </InputAdornment> : ""
                        }
                        error={validationState.noName}
                    />
                    <FormHelperText hidden={!validationState.noName} error={true} id="line-name-validation">
                        A line must have a name
                    </FormHelperText>
                </FormControl>
            </Typography>

            <Typography className={classes.margin} gutterBottom variant="body1" component="div" align="center">
                <FormControl fullWidth>
                    <InputLabel htmlFor="line-name-description">Line Description</InputLabel>
                    <Input
                        id="line-name-description"
                        type={'text'}
                        value={lineDto.description}
                        onChange={e => {
                            setLineDto(prevState => ({
                                ...prevState,
                                description: e.target.value
                            }))
                        }}
                    />
                </FormControl>
            </Typography>
            <Typography className={classes.margin} gutterBottom variant="body1" component="div" align="center">
                <FormControl fullWidth>
                    <InputLabel htmlFor="line-numberOfPeople">Number of required people</InputLabel>
                    <Input
                        id="line-numberOfPeople"
                        aria-describedby="line-numberOfPeople-validation"
                        value={lineDto.numberOfRequiredPeople}
                        onChange={(e) => {
                            setLineDto(prevState => ({
                                ...prevState,
                                numberOfRequiredPeople: parseInt(e.target.value)
                            }))
                            setValidationState(prevState => ({
                                ...prevState,
                                numberInvalid: parseInt(e.target.value) < 1
                            }))
                        }}
                        endAdornment={
                            validationState.numberInvalid ?
                                <InputAdornment position="end">
                                    <FontAwesomeIcon icon={faExclamationTriangle}/>
                                </InputAdornment> : ""
                        }
                        error={validationState.numberInvalid}
                        inputProps={{
                            step: 1,
                            min: 1,
                            max: 100,
                            type: 'number',
                        }}
                    />
                    <FormHelperText hidden={!validationState.numberInvalid} error={true}
                                    id="line-numberOfPeople-validation">
                        A line must have at least 1 people required for it.
                    </FormHelperText>
                </FormControl>
            </Typography>
            <Typography className={classes.margin} gutterBottom variant="body1" component="div" align="center">
                <ButtonGroup color="secondary" aria-label="contained primary button group">
                    <Button variant="contained" onClick={(e) => submitEvent(e)} className="button is-link"
                            disabled={validationState.noName}>
                        {isCreating ? "Create" : "Update"}
                    </Button>
                    <Button variant="outlined" onClick={() => history.goBack()}
                            className="button is-link is-light">Cancel</Button>
                </ButtonGroup>
            </Typography>

        </form>
    </Container>;
};

const useStyles = makeStyles((theme) => ({
    margin: {
        margin: theme.spacing(4),
    }
}));

export default CreateLine