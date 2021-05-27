import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faEnvelope, faEye, faLock} from "@fortawesome/free-solid-svg-icons";
import React, {useState} from "react";
import {postBase} from "../../js/FetchBase";
import {toast} from "bulma-toast";
import {useHistory} from "react-router-dom";

const Login = (props) => {

    const [showPassword, setShowPassword] = useState(false);
    const [loginDetails, setLoginDetails] = useState({id: '', password: ''});
    const history = useHistory();

    function performLogin(e) {
        e.preventDefault();
        postBase("/login", JSON.stringify(loginDetails)).then((resp) => {
            localStorage.setItem("Authorization", resp.jwt);
            localStorage.setItem("user.id", resp.userDto.id);
            localStorage.setItem("user", JSON.stringify(resp.userDto));
            localStorage.setItem("IsLoggedIn", "true");
            history.push("/");
            props.closeModal();
        }).catch(() => {
            toast({
                message: 'Something went wrong while trying to log in',
                type: 'is-danger'
            })
        })

    }

    return <div className="container">
        <h2 className="title is-2">Login</h2>

        <div className="field">
            <label className="label">Email</label>
            <div className="control has-icons-left">
                <input className="input" type="text"
                       placeholder="Email" value={loginDetails.id}
                       onChange={e => {
                           setLoginDetails(() => {
                               return {...loginDetails, id: e.target.value}
                           })
                       }}/>
                <span className="icon is-small is-left">
                    <FontAwesomeIcon icon={faEnvelope}/>
                </span>
            </div>
        </div>

        <div className="field">
            <label className="label">Password</label>

            <div className="control has-icons-left has-icons-right">
                <input className="input" type={`${showPassword ? "text" : "password"}`}
                       placeholder="Password" value={loginDetails.password}
                       onChange={e => {
                           setLoginDetails(() => {
                               return {...loginDetails, password: e.target.value}
                           })
                       }}/>
                <span className="icon is-small is-left">
                           <FontAwesomeIcon icon={faLock}/>
                </span>
                <span className="icon is-small is-right is-clickable" onClick={() => {
                    setShowPassword(!showPassword)
                }}>
                    <FontAwesomeIcon icon={faEye}/>
                </span>
            </div>
        </div>

        <div className="field">
            <div className="control">
                <button onClick={(e) => performLogin(e)} className="button is-link">
                    Log in
                </button>
            </div>
        </div>
    </div>
}

export default Login;