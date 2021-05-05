import {useHistory} from "react-router-dom";
import UserAssignedLines from "./UserAssignedLines";

const UserDetails = () => {
    const history = useHistory();

    return <div className="is-flex is-flex-direction-column is-align-self-center mx-4 mt-1">
        <h1 className="title is-1">User Details</h1>
        <div className="columns">
            <div className="column">
                <button className="button" onClick={() => history.push("/user/join/organization")}>
                    Join Organization
                </button>
            </div>
            <div className="column is-1">
                <button className="button is-warning" onClick={() => history.push("/user/inbox")}>Inbox</button>
            </div>
        </div>
        <section className="section">
            <UserAssignedLines/>
        </section>

    </div>;

}

export default UserDetails