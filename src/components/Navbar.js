import React, {useState} from "react";
import {useHistory} from "react-router-dom";
import Login from "./authentication/Login";
import Logout from "./authentication/Logout";

const Navbar = () => {
    const history = useHistory();

    const [showLoginModal, setShowLoginModal] = useState(false);
    const [showLogoutModal, setShowLogoutModal] = useState(false);

    function navigateTo(url) {
        if (url === "/login") {
            setShowLoginModal(true)
            return;
        }
        if (url === "/logout") {
            setShowLogoutModal(true)
            return;
        }
        history.push(url);
    }

    function closeModals() {
        setShowLogoutModal(false)
        setShowLoginModal(false)
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

    const RenderLoginModal = () => {
        if (!showLoginModal) return "";
        return <div className="modal is-active">
            <div className="modal-background"
                 onClick={() => closeModals()}/>
            <div className="modal-content">
                <div className="card">
                    <div className="card-content">
                        <Login closeModal={closeModals}/>
                    </div>
                </div>
            </div>
            <button className="modal-close is-large" aria-label="close" onClick={() => closeModals()}/>
        </div>
    }

    const RenderLogOutModal = () => {
        if (!showLogoutModal) return "";
        return <div className="modal is-active">
            <div className="modal-background"
                 onClick={() => closeModals()}/>
            <div className="modal-content">
                <div className="card">
                    <div className="card-content">
                        <Logout closeModal={closeModals}/>
                    </div>
                </div>
            </div>
            <button className="modal-close is-large" aria-label="close" onClick={() => closeModals()}/>
        </div>
    }

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
        <RenderLoginModal/>
        <RenderLogOutModal/>
    </>
}

export default Navbar;