import '../style/App.scss';
import {BrowserRouter as Router, Route, Switch} from "react-router-dom";

import UserDetails from './user/UserDetails';
import OrganizationDetails from "./organization/OrganizationDetails";
import Home from './Home';
import Inbox from "./user/Inbox";
import OrganizationJoinRequests from "./organization/OrganizationJoinRequests";
import MemberManagement from "./organization/MemberManagement";
import EventManagement from "./venue/EventManagement";
import CreateEvent from "./event/CreateEvent";
import EventDetails from "./event/EventDetails";
import AddEventLines from "./event/AddEventLines";
import OrganizationLines from "./organization/OrganizationLines";
import AssignMembersToLine from "./organization/AssignMembersToLine";
import JoinOrganization from "./user/JoinOrganization";
import NotificationOverview from "./admin/NotificationOverview";
import Registration from "./authentication/Registration";
import AdminDetails from "./admin/AdminDetails";
import AdminCreateOrganization from "./admin/organization/AdminCreateOrganization";
import ChannelOverview from "./admin/ChannelOverview";
import AdminVenueManagement from "./admin/AdminVenueManagement";
import CreateVenue from "./venue/CreateVenue";
import AdminOrganizationManagement from "./admin/AdminOrganizationManagement";
import ManageLines from "./venue/lines/ManageLines";
import CreateLine from "./venue/lines/CreateLine";
import Navbar from "./Navbar";
import Login from "./authentication/Login";
import Logout from "./authentication/Logout";

function App() {
    return (
        <div className="App">
            <Router>
                <Navbar/>
                <Switch>
                    <Route path="/user/join/organization"> <JoinOrganization/> </Route>
                    <Route path="/user/inbox"> <Inbox/> </Route>
                    <Route path="/user"> <UserDetails/> </Route>
                    <Route path="/admin/channels"> <ChannelOverview/> </Route>
                    <Route path="/admin/organizationManagement/create"> <AdminCreateOrganization/> </Route>
                    <Route path="/admin/organizationManagement"> <AdminOrganizationManagement/> </Route>
                    <Route path="/admin/NotificationOverview"> <NotificationOverview/> </Route>
                    <Route path="/admin/venueManagement"> <AdminVenueManagement/> </Route>
                    <Route path="/admin/venue/create"> <CreateVenue action={'create'}/> </Route>
                    <Route path="/admin/venue/edit"> <CreateVenue action={'edit'}/> </Route>
                    <Route path="/admin"> <AdminDetails/> </Route>
                    <Route path="/organization/:id/pendingrequests"> <OrganizationJoinRequests/> </Route>
                    <Route path="/organization/:id/membermanagement"> <MemberManagement/> </Route>
                    <Route path="/organization/:id/memberassignment/assign"> <AssignMembersToLine/> </Route>
                    <Route path="/organization/:id/linemanagement"> <OrganizationLines/> </Route>
                    <Route path="/organization/:id"> <OrganizationDetails/> </Route>
                    <Route path="/venue/events/create"> <CreateEvent/> </Route>
                    <Route path="/venue/events/:id/lines"> <AddEventLines/> </Route>
                    <Route path="/venue/events/:id"> <EventDetails/> </Route>
                    <Route path="/venue/events"> <EventManagement/> </Route>
                    <Route path="/venue/lines/edit"> <CreateLine action={"edit"}/> </Route>
                    <Route path="/venue/lines/create"> <CreateLine  action={"create"}/> </Route>
                    <Route path="/venue/lines"> <ManageLines/> </Route>
                    <Route path="/register"> <Registration/> </Route>
                    <Route path="/logout"> <Logout/> </Route>
                    <Route path="/login"> <Login/> </Route>
                    <Route path="/register"> <Registration/> </Route>
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
