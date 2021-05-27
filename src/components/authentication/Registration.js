import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faEnvelope, faExclamationTriangle, faEye, faLock, faPhone} from "@fortawesome/free-solid-svg-icons";
import React, {useState} from "react";
import {postBase} from "../../js/FetchBase";
import {useHistory} from "react-router-dom";
import {toast} from "bulma-toast";

const Registration = () => {
    const history = useHistory();

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
        postBase("/authentication/register", JSON.stringify(body)).then(() => {
            history.push("/");
            toast({
                message: 'You have been successfully registered',
                type: 'is-success'
            })
        }).catch(() => {
            toast({
                message: 'Something went wrong while trying to register you',
                type: 'is-danger'
            })
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
            if (validState[key]) {isFullyValid = false;}
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

    return <article className="container mt-2">
        <h1 className="title is-1">Register now!</h1>
        <section>
            <form>
                <label className="label">Name</label>
                <div className="field is-grouped">
                    <div className={`control ${validationState.noFirstName ? 'has-icons-right' : ''}`}>
                        <input id="firstNameInput" className={`input ${validationState.noFirstName ? 'is-danger' : ''}`} type="text"
                               placeholder="First name" value={registerDto.firstName}
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
                               }}/>
                        <span
                            className={`icon is-small is-right ${validationState.noFirstName ? '' : 'is-hidden'}`}>
                            <FontAwesomeIcon icon={faExclamationTriangle}/>
                        </span>
                        <p className={`help is-danger ${validationState.noFirstName ? '' : 'is-hidden'}`}>You cannot
                            have an empty first name</p>
                    </div>

                    <div className={`control ${validationState.noLastName ? 'has-icons-right' : ''}`}>
                        <input id="lastNameInput" className={`input ${validationState.noLastName ? 'is-danger' : ''}`} type="text"
                               placeholder="Last name" value={registerDto.lastName}
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
                               }}/>
                        <span
                            className={`icon is-small is-right ${validationState.noLastName ? '' : 'is-hidden'}`}>
                            <FontAwesomeIcon icon={faExclamationTriangle}/>
                        </span>
                        <p className={`help is-danger ${validationState.noLastName ? '' : 'is-hidden'}`}>You cannot have
                            an empty last name</p>
                    </div>
                </div>

                <div className="field">
                    <label className="label">Email</label>
                    <div className={`control has-icons-left ${validationState.noMail ? 'has-icons-right' : ''}`}>
                        <input id="emailInput" className={`input ${validationState.noMail ? 'is-danger' : ''}`} type="text"
                               placeholder="Email" value={registerDto.email}
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
                               }}/>
                        <span className="icon is-small is-left">
                            <FontAwesomeIcon icon={faEnvelope}/>
                        </span>
                        <span
                            className={`icon is-small is-right ${validationState.noMail ? '' : 'is-hidden'}`}>
                            <FontAwesomeIcon icon={faExclamationTriangle}/>
                        </span>
                        <p className={`help is-danger ${validationState.noMail ? '' : 'is-hidden'}`}>That is not a valid
                            email</p>
                    </div>
                </div>

                <div className="field">
                    <label className="label">Mobile Number</label>
                    <div className={`control has-icons-left ${validationState.noPhone ? 'has-icons-right' : ''}`}>
                        <input id="phoneInput" className={`input ${validationState.noPhone ? 'is-danger' : ''}`} type="text"
                               placeholder="Mobile Number" value={registerDto.phone}
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
                               }}/>
                        <span className="icon is-small is-left">
                            <FontAwesomeIcon icon={faPhone}/>
                        </span>
                        <span
                            className={`icon is-small is-right ${validationState.noPhone ? '' : 'is-hidden'}`}>
                            <FontAwesomeIcon icon={faExclamationTriangle}/>
                        </span>
                        <p className={`help is-danger ${validationState.noPhone ? '' : 'is-hidden'}`}>Phone number
                            cannot be empty</p>
                    </div>
                </div>

                <div className="field">

                    <label className="label">
                        Password
                        <span id="togglePwVisibilitySpan" className="icon is-small is-clickable ml-2" onClick={() => {
                            setRegisterDto(prevState => ({
                                ...prevState,
                                showPassword: !registerDto.showPassword,
                            }))
                        }}>
                            <FontAwesomeIcon icon={faEye}/>
                        </span>
                    </label>

                    <div className={`control has-icons-left ${validationState.noPassword ? 'has-icons-right' : ''}`}>
                        <input id="passwordInput" className={`input ${validationState.noPassword ? 'is-danger' : ''}`}
                               type={`${registerDto.showPassword ? "text" : "password"}`}
                               placeholder="Password" value={registerDto.password}
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
                               }}/>
                        <span className="icon is-small is-left">
                            <FontAwesomeIcon icon={faLock}/>
                        </span>
                        <span
                            className={`icon is-small is-right ${registerDto.noPassword ? '' : 'is-hidden'}`}>
                            <FontAwesomeIcon icon={faExclamationTriangle}/>
                        </span>
                        <p className={`help is-danger ${validationState.noPassword ? '' : 'is-hidden'}`}>Password cannot
                            be empty</p>
                    </div>
                    <p className="help">Re-enter your password</p>
                    <div
                        className={`control has-icons-left ${validationState.passwordsDontMatch ? 'has-icons-right' : ''}`}>
                        <input id="passwordRepeatInput" className={`input ${validationState.passwordsDontMatch ? 'is-danger' : ''}`}
                               type={`${registerDto.showPassword ? "text" : "password"}`} placeholder="Password"
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
                               }}/>
                        <span className="icon is-small is-left">
                            <FontAwesomeIcon icon={faLock}/>
                        </span>
                        <span
                            className={`icon is-small is-right ${validationState.passwordsDontMatch ? '' : 'is-hidden'}`}>
                            <FontAwesomeIcon icon={faExclamationTriangle}/>
                        </span>
                        <p className={`help is-danger ${validationState.passwordsDontMatch ? '' : 'is-hidden'}`}>Passwords
                            do not match</p>
                    </div>
                </div>

                <div className="field">
                    <div className="control">
                        <button onClick={(e) => submitEvent(e)} className="button is-link"
                                disabled={!validationState.isFullyValid}>
                            Register
                        </button>
                    </div>
                </div>
            </form>
        </section>
    </article>
}

export default Registration