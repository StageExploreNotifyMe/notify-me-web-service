import '../style/App.scss';
import {BrowserRouter as Router, Route, Switch} from "react-router-dom";
import React, {useState} from "react";

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
import Login from "./authentication/Login";
import Logout from "./authentication/Logout";
import LoggedInBasedRouting from "./authentication/LoggedInBasedRouting";
import Navbar from "./Navbar";

function App() {
    const [, forceUpdate] = useState(0);

    return (
        <>
            <Router>
                <Navbar/>
                <Switch>
                    <LoggedInBasedRouting path="/user/join/organization" component={JoinOrganization}/>
                    <LoggedInBasedRouting path="/user/inbox" component={Inbox}/>
                    <LoggedInBasedRouting path="/user" component={UserDetails}/>
                    <LoggedInBasedRouting path="/admin/channels" roles={['ADMIN']} component={ChannelOverview}/>
                    <LoggedInBasedRouting path="/admin/organizationManagement/create" roles={['ADMIN']} component={AdminCreateOrganization}/>
                    <LoggedInBasedRouting path="/admin/organizationManagement" roles={['ADMIN']} component={AdminOrganizationManagement}/>
                    <LoggedInBasedRouting path="/admin/NotificationOverview" roles={['ADMIN']} component={NotificationOverview}/>
                    <LoggedInBasedRouting path="/admin/venueManagement" roles={['ADMIN']} component={AdminVenueManagement}/>
                    <LoggedInBasedRouting path="/admin/venue/create" roles={['ADMIN']} component={CreateVenue} action={'create'}/>
                    <LoggedInBasedRouting path="/admin/venue/edit" roles={['ADMIN']} component={CreateVenue} action={'edit'}/>
                    <LoggedInBasedRouting path="/admin" roles={['ADMIN']} component={AdminDetails}/>
                    <LoggedInBasedRouting path="/organization/:id/pendingrequests" component={OrganizationJoinRequests}/>
                    <LoggedInBasedRouting path="/organization/:id/membermanagement" component={MemberManagement}/>
                    <LoggedInBasedRouting path="/organization/:id/memberassignment/assign" component={AssignMembersToLine}/>
                    <LoggedInBasedRouting path="/organization/:id/linemanagement" component={OrganizationLines}/>
                    <LoggedInBasedRouting path="/organization/:id" component={OrganizationDetails}/>
                    <LoggedInBasedRouting path="/venue/events/create" component={CreateEvent}/>
                    <LoggedInBasedRouting path="/venue/events/:id/lines" component={AddEventLines}/>
                    <LoggedInBasedRouting path="/venue/events/:id" component={EventDetails}/>
                    <LoggedInBasedRouting path="/venue/events" component={EventManagement}/>
                    <LoggedInBasedRouting path="/venue/lines/edit" component={CreateLine} action={"edit"}/>
                    <LoggedInBasedRouting path="/venue/lines/create" component={CreateLine} action={"create"}/>
                    <LoggedInBasedRouting path="/venue/lines" component={ManageLines}/>
                    <LoggedInBasedRouting path="/register" component={Registration}/>
                    <LoggedInBasedRouting path="/logout" component={Logout} onSuccess={forceUpdate}/>
                    <Route path="/login"><Login onSuccess={forceUpdate}/></Route>
                    <Route path="/register"><Registration/></Route>
                    <Route exact path="/"><Home/></Route>
                    <Route path="*">
                        <div>404 placeholder</div>
                    </Route>
                </Switch>
            </Router>
        </>
    );
}

export default App;
