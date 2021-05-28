import React from "react";
import {useHistory} from "react-router-dom";

const Navbar = () => {
    const history = useHistory();

    function navigateTo(url) {
        history.push(url);
    }

    const RenderAuthButtons = () => {
        if (localStorage.getItem("IsLoggedIn") === "true") {
            return <a className="button is-light" onClick={() => navigateTo("/logout")}>
                    Log out
                </a>

        }
        return <>
            <a className="button is-primary" onClick={() => navigateTo("/register")}>
                <strong>Sign up</strong>
            </a>
            <a className="button is-light" onClick={() => navigateTo("/login")}>
                Log in
            </a>
        </>
    };

    return <>
        <nav className="navbar is-primary" role="navigation" aria-label="main navigation">
            <div id="navbarBasicExample" className="navbar-menu">
                <div className="navbar-start">
                    <a className="navbar-item is-primary" onClick={() => navigateTo("/")}>
                        Notify Me
                    </a>
                </div>
            </div>
            <div className="navbar-end">
                <div className="navbar-item">
                    <div className="buttons">
                        <RenderAuthButtons/>
                    </div>
                </div>
            </div>
        </nav>
    </>
}

export default Navbar;