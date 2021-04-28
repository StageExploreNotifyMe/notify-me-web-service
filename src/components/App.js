import UserDetails from './user/UserDetails';
import OrganizationDetails from "./organization/OrganizationDetails";
import Home from './Home';

import '../style/App.scss';
import {BrowserRouter as Router, Route, Switch} from "react-router-dom";
import OrganizationJoinRequests from "./organization/OrganizationJoinRequests";
import MemberManagement from "./organization/MemberManagement";

function App() {
    return (
        <div className="App">
            <Router>
                <Switch>
                    <Route path="/user"> <UserDetails/> </Route>
                    <Route path="/organization/:id/pendingrequests"> <OrganizationJoinRequests/> </Route>
                    <Route path="/organization/:id/membermanagement"> <MemberManagement/> </Route>
                    <Route path="/organization/:id"> <OrganizationDetails/> </Route>
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
