import UserDetails from './user/UserDetails';
import OrganizationDetails from "./organization/OrganizationDetails";
import Home from './Home';
import Inbox from "./user/Inbox";


import '../style/App.scss';
import {BrowserRouter as Router, Route, Switch} from "react-router-dom";
import OrganizationJoinRequests from "./organization/OrganizationJoinRequests";
import MemberManagement from "./organization/MemberManagement";
import EventManagement from "./venue/EventManagement";
import CreateEvent from "./event/CreateEvent";
import EventDetails from "./event/EventDetails";
import AddEventLines from "./event/AddEventLines";

function App() {
    return (
        <div className="App">
            <Router>
                <Switch>
                    <Route path="/user"> <UserDetails/> </Route>
                    <Route path="/inbox"> <Inbox/> </Route>
                    <Route path="/organization/:id/pendingrequests"> <OrganizationJoinRequests/> </Route>
                    <Route path="/organization/:id/membermanagement"> <MemberManagement/> </Route>
                    <Route path="/organization/:id"> <OrganizationDetails/> </Route>
                    <Route path="/venue/events/create"> <CreateEvent/> </Route>
                    <Route path="/venue/events/:id/lines"> <AddEventLines/> </Route>
                    <Route path="/venue/events/:id"> <EventDetails/> </Route>
                    <Route path="/venue/events"> <EventManagement/> </Route>
                    <Route exact path="/"> <Home/> </Route>
                    <Route path="*">
                        <div>404 placeholder</div>
                    </Route>
                </Switch>
            </Router>
        </div>
    );
}


export default App;
