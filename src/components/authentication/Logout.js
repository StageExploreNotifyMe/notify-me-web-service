import {useHistory} from "react-router-dom";

const Logout = (props) => {
    localStorage.setItem("Authorization", "");
    localStorage.setItem("user.id", "");
    localStorage.setItem("user", JSON.stringify({}));
    localStorage.setItem("IsLoggedIn", "false");

    const history = useHistory();
    return <div className="container">
        <h1 className="title">You have been logged out</h1>
        <p>You've been successfully logged out.</p>
        <button className="button is-link" onClick={() => {
            history.push("/");
            if (props.closeModal) {
                props.closeModal()
            }
        }}>
            Go Home
        </button>
    </div>
}

export default Logout;