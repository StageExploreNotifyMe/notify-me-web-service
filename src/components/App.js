import UserDetails from './user/UserDetails';
import OrganizationDetails from "./organization/OrganizationDetails";
import Home from './Home';

import '../style/App.scss';
import {BrowserRouter as Router, Route, Switch} from "react-router-dom";
import EventManagement from "./venue/EventManagement";
import CreateEvent from "./event/CreateEvent";

function App() {
    return (
        <div className="App">
            <Router>
                <Switch>
                    <Route path="/user"> <UserDetails/> </Route>
                    <Route path="/organization/:id"> <OrganizationDetails/> </Route>
                    <Route path="/venue/events"> <EventManagement/> </Route>
                    <Route path="/event/create"> <CreateEvent/> </Route>
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
