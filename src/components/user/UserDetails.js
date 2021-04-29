import JoinOrganization from "./JoinOrganization";
import {useHistory} from "react-router-dom";


const UserDetails = () => {
    return <div className="is-flex is-flex-direction-column is-align-self-center mx-4 mt-1">
        <h1 className="title is-1">User Details Placeholder</h1>
        <JoinOrganization/>
        <div className="column is-one-fifth">
            <InboxButton/>
        </div>
    </div>;

}


function InboxButton() {
    const history = useHistory();

    function handleClick() {
        history.push("/inbox")
    }

    return (<button className="button is-warning" onClick={handleClick}>Inbox</button>);
}

export default UserDetails