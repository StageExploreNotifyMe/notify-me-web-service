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
import AdminOrganizationManagement from "./admin/organization/AdminOrganizationManagement";
import ManageLines from "./venue/lines/ManageLines";
import CreateLine from "./venue/lines/CreateLine";
import Login from "./authentication/Login";
import Logout from "./authentication/Logout";
import LoggedInBasedRouting from "./authentication/LoggedInBasedRouting";
import Navbar from "./Navbar";
import PickVenueToManage from "./venue/PickVenueToManage";
import PickOrganization from "./organization/PickOrganization";

function App() {
    const [, forceUpdate] = useState(0);

    return (
        <>
            <Router>
                <Navbar/>
                <Switch>
                    <LoggedInBasedRouting path="/user/join/organization" roles={['ANY']} component={JoinOrganization}/>
                    <LoggedInBasedRouting path="/user/inbox" roles={['ANY']} component={Inbox}/>
                    <LoggedInBasedRouting path="/user" component={UserDetails}/>
                    <LoggedInBasedRouting path="/admin/channels" roles={['ADMIN']} component={ChannelOverview}/>
                    <LoggedInBasedRouting path="/admin/organizationManagement/create" roles={['ADMIN']}
                                          component={AdminCreateOrganization}/>
                    <LoggedInBasedRouting path="/admin/organizationManagement" roles={['ADMIN']}
                                          component={AdminOrganizationManagement}/>
                    <LoggedInBasedRouting path="/admin/NotificationOverview" roles={['ADMIN']}
                                          component={NotificationOverview}/>
                    <LoggedInBasedRouting path="/admin/venueManagement" roles={['ADMIN']}
                                          component={AdminVenueManagement}/>
                    <LoggedInBasedRouting path="/admin/venue/create" roles={['ADMIN']} component={CreateVenue}
                                          action={'create'}/>
                    <LoggedInBasedRouting path="/admin/venue/edit" roles={['ADMIN']} component={CreateVenue}
                                          action={'edit'}/>
                    <LoggedInBasedRouting path="/admin" roles={['ADMIN']} component={AdminDetails}/>
                    <LoggedInBasedRouting path="/organization/pendingrequests" roles={['ORGANIZATION_LEADER']}
                                          component={OrganizationJoinRequests}/>
                    <LoggedInBasedRouting path="/organization/membermanagement" roles={['ORGANIZATION_LEADER']}
                                          component={MemberManagement}/>
                    <LoggedInBasedRouting path="/organization/memberassignment/assign" roles={['ORGANIZATION_LEADER']}
                                          component={AssignMembersToLine}/>
                    <LoggedInBasedRouting path="/organization/linemanagement" roles={['ORGANIZATION_LEADER']}
                                          component={OrganizationLines}/>
                    <LoggedInBasedRouting path="/organizations" roles={['MEMBER', 'ORGANIZATION_LEADER']}
                                          component={PickOrganization}/>
                    <LoggedInBasedRouting path="/organization" roles={['MEMBER', 'ORGANIZATION_LEADER']}
                                          component={OrganizationDetails}/>
                    <LoggedInBasedRouting path="/venue/events/create" roles={['VENUE_MANAGER']}
                                          component={CreateEvent}/>
                    <LoggedInBasedRouting path="/venue/event/lines" roles={['VENUE_MANAGER', 'LINE_MANAGER']}
                                          component={AddEventLines}/>
                    <LoggedInBasedRouting path="/venue/event" roles={['VENUE_MANAGER', 'LINE_MANAGER']}
                                          component={EventDetails}/>
                    <LoggedInBasedRouting path="/venue/events" roles={['LINE_MANAGER', 'VENUE_MANAGER']}
                                          component={EventManagement}/>
                    <LoggedInBasedRouting path="/venue/lines/edit" roles={['VENUE_MANAGER']} component={CreateLine}
                                          action={"edit"}/>
                    <LoggedInBasedRouting path="/venue/lines/create" roles={['VENUE_MANAGER']} component={CreateLine}
                                          action={"create"}/>
                    <LoggedInBasedRouting path="/venue/lines" roles={['VENUE_MANAGER', 'LINE_MANAGER']}
                                          component={ManageLines}/>
                    <LoggedInBasedRouting path="/venue/select" roles={['VENUE_MANAGER', 'LINE_MANAGER']}
                                          component={PickVenueToManage}/>
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
