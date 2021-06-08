import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faExclamationTriangle} from "@fortawesome/free-solid-svg-icons";
import React, {useState} from "react";
import {useHistory} from "react-router-dom";
import {patchBase, postBase} from "../../../js/FetchBase";
import {useSnackbar} from 'notistack';

const CreateLine = (props) => {
    const history = useHistory();
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

    return <div className="container mt-2">
        <div className="level">
            <div className="level-left"><h2 className="title is-2 level-item">{isCreating ? "Create" : "Edit"} Line</h2>
            </div>
        </div>
        <form>
            <div className="field">
                <label className="label">Name</label>
                <div className={`control ${validationState.noName ? 'has-icons-right' : ''}`}>
                    <input className={`input ${validationState.noName ? 'is-danger' : ''}`} type="text"
                           placeholder="Name of the line" value={lineDto.name}
                           onChange={e => {
                               setLineDto(prevState => ({
                                   ...prevState,
                                   name: e.target.value
                               }))
                               setValidationState(prevState => ({
                                   ...prevState,
                                   noName: e.target.value === ""
                               }))
                           }}/>
                    <span
                        className={`icon is-small is-right ${validationState.noName ? '' : 'is-hidden'}`}>
                            <FontAwesomeIcon icon={faExclamationTriangle}/>
                        </span>
                    <p className={`help is-danger ${validationState.noName ? '' : 'is-hidden'}`}>A line must have a
                        name</p>
                </div>
            </div>

            <div className="field">
                <label className="label">Description</label>
                <div className={`control`}>
                    <input className={`input`} type="text"
                           placeholder="Description of the line" value={lineDto.description}
                           onChange={e => {
                               setLineDto(prevState => ({
                                   ...prevState,
                                   description: e.target.value
                               }))
                           }}/>
                </div>
            </div>

            <div className="field">
                <label className="label">Number of required people</label>
                <div className={`control ${validationState.numberInvalid ? 'has-icons-right' : ''}`}>
                    <input className={`input ${validationState.numberInvalid ? 'is-danger' : ''}`} type="number"
                           placeholder="Number of required people for the line" value={lineDto.numberOfRequiredPeople}
                           onChange={e => {
                               setLineDto(prevState => ({
                                   ...prevState,
                                   numberOfRequiredPeople: parseInt(e.target.value)
                               }))
                               setValidationState(prevState => ({
                                   ...prevState,
                                   numberInvalid: parseInt(e.target.value) < 1
                               }))
                           }}/>
                    <span
                        className={`icon is-small is-right ${validationState.numberInvalid ? '' : 'is-hidden'}`}>
                            <FontAwesomeIcon icon={faExclamationTriangle}/>
                        </span>
                    <p className={`help is-danger ${validationState.numberInvalid ? '' : 'is-hidden'}`}>A line must have
                        at least 1 people required for it.</p>
                </div>
            </div>

            <div className="field is-grouped">
                <div className="control">
                    <button onClick={(e) => submitEvent(e)} className="button is-link"
                            disabled={validationState.noName}>
                        {isCreating ? "Create" : "Update"}
                    </button>
                </div>
                <div className="control">
                    <button onClick={() => history.goBack()} className="button is-link is-light">Cancel</button>
                </div>
            </div>
        </form>
    </div>;
};

export default CreateLine