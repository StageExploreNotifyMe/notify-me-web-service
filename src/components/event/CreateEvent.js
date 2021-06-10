import {useHistory} from "react-router-dom";
import React, {useState} from "react";
import {postBase} from "../../js/FetchBase";
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faExclamationTriangle} from '@fortawesome/free-solid-svg-icons'
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
    Typography,
} from "@material-ui/core";
import DateFnsUtils from '@date-io/date-fns';
import {KeyboardDateTimePicker, MuiPickersUtilsProvider} from '@material-ui/pickers';
import {makeStyles} from "@material-ui/styles";

const CreateEvent = () => {
    const {enqueueSnackbar} = useSnackbar();
    const history = useHistory();
    const classes = useStyles();
    const venue = JSON.parse(localStorage.getItem("venue"));

    let now = new Date()
    now.setUTCHours(now.getHours())

    const [eventDto, setEventDto] = useState({
        eventDateTime: now,
        eventDate: now.toISOString().split('T')[0],
        eventTime: now.toISOString().split('T')[1].substr(0, 5),
        name: "",
        venueId: venue.id
    })
    const [validationState, setValidationState] = useState({
        invalidDateTime: false,
        noName: false
    })

    function submitEvent(e) {
        e.preventDefault();

        if (eventDto.name === "") {
            setValidationState(prevState => ({
                ...prevState,
                noName: true
            }))
            return;
        }

        if (validationState.noName || validationState.invalidDateTime) return;

        postBase("/event", JSON.stringify({
            name: eventDto.name,
            venueId: eventDto.venueId,
            eventDateTime: eventDto.eventDateTime
        })).then(() => {
            history.push("/venue/events");
        }).catch(() => {
            enqueueSnackbar("Something went wrong while trying to create your event", {
                variant: 'error',
            });
        })
    }

    function setDateTime(value) {
        setEventDto(prevState => ({
            ...prevState,
            eventDateTime: value
        }))
        let dateInPast = value < new Date();
        setValidationState(prevState => ({
            ...prevState,
            invalidDateTime: dateInPast
        }))
    }

    return <Container maxWidth="md">
        <Typography gutterBottom variant="h3" component="h2">
            Create Event
        </Typography>

        <form>
            <Typography className={classes.margin} gutterBottom variant="body1" component="div" align="center">
                <FormControl fullWidth>
                    <InputLabel htmlFor="event-name-input">Event name</InputLabel>
                    <Input
                        id="event-name-input"
                        aria-describedby="event-name-validation"
                        type={'text'}
                        value={eventDto.name}
                        onChange={e => {
                            setEventDto(prevState => ({
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
                    <FormHelperText hidden={!validationState.noName} error={true} id="event-name-validation">
                        An event must have a name
                    </FormHelperText>
                </FormControl>
            </Typography>

            <Typography className={classes.margin} gutterBottom variant="body1" component="div" align="center">
                <FormControl fullWidth>
                    <MuiPickersUtilsProvider utils={DateFnsUtils}>
                        <KeyboardDateTimePicker
                            margin="normal"
                            id="date-picker-dialog"
                            label="Event Date & Time"
                            format="HH:mm - dd/MM/yyyy"
                            ampm={false}
                            disablePast={true}
                            value={eventDto.eventDateTime}
                            onChange={(e) => setDateTime(e, true)}
                            KeyboardButtonProps={{
                                'aria-label': 'change date',
                            }}
                            aria-describedby="event-name-validation"
                            invalidDateMessage={"Given date time format not recognized"}
                            minDateMessage={"Date cannot be in the past"}
                        />
                        <FormHelperText hidden={!validationState.invalidDateTime} error={true}
                                        id="event-date-validation">
                            Chosen date & time combination is invalid. Make sure the event is planned in the future and
                            the given input is valid.
                        </FormHelperText>
                    </MuiPickersUtilsProvider>
                </FormControl>
            </Typography>

            <Typography className={classes.margin} gutterBottom variant="body1" component="div" align="center">
                <ButtonGroup color="secondary" aria-label="contained primary button group">
                    <Button variant="contained" onClick={(e) => submitEvent(e)}
                            disabled={validationState.invalidDateTime || validationState.noName}>
                        Create
                    </Button>
                    <Button variant="outlined" onClick={() => history.goBack()}>Cancel</Button>
                </ButtonGroup>
            </Typography>
        </form>
    </Container>;
}

const useStyles = makeStyles((theme) => ({
    margin: {
        margin: theme.spacing(4),
    },
    paper: {
        width: 250,
        height: 350,
        overflow: 'auto',
    },
}));

export default CreateEvent