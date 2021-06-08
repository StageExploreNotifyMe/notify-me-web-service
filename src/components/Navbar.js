import React, {useEffect, useState} from "react";
import {Link as RouterLink, useHistory} from "react-router-dom";
import {AppBar, Breadcrumbs, Button, Toolbar, Typography} from "@material-ui/core";
import {makeStyles} from "@material-ui/styles";
import {isClickable} from "../style/StyleUtils";
import Link from '@material-ui/core/Link';

const Navbar = () => {
    const history = useHistory();
    const classes = useStyles();
    const [paths, setPaths] = useState(window.location.pathname.split('/').filter((x) => x));
    useEffect(() => {
        if (!history.listen) return history;
        return history.listen((location) => {
            setPaths(location.pathname.split('/').filter((x) => x));
        })
    }, [history])

    function getPathName(path) {
        let name = breadcrumbNameMap[path.toLowerCase()];
        if (name === undefined) name = '';
        return name.replaceAll('/', ' ');
    }

    function navigateTo(url) {
        history.push(url);
    }

    const RenderAuthButtons = () => {
        if (localStorage.getItem("IsLoggedIn") === "true") {
            return <Button color="inherit" onClick={() => navigateTo("/logout")}>
                Log out
            </Button>

        }
        return <>
            <Button color="inherit" onClick={() => navigateTo("/register")}>
                <strong>Sign up</strong>
            </Button>
            <Button color="inherit" onClick={() => navigateTo("/login")}>
                Log in
            </Button>
        </>
    };
    const RenderBreadCrum = () => {
        if (paths.length === 0) return "";

        return <Toolbar variant="dense"><Breadcrumbs aria-label="breadcrumb">
            <Link color="inherit" to="/" component={RouterLink}> Home </Link>
            {paths.map((value, index) => {
                const to = `/${paths.slice(0, index + 1).join('/')}`;
                let pathName = getPathName(to);
                if (pathName === "") return "";
                if (index === paths.length - 1) {
                    return <Typography color="textPrimary" key={to}>
                        {pathName}
                    </Typography>
                }
                return <Link color="inherit" to={to} key={to} component={RouterLink}>
                    {pathName}
                </Link>

            })}
        </Breadcrumbs></Toolbar>;
    }

    return <>
        <AppBar position="static" className={classes.marginBottom}>
            <Toolbar>
                <Typography variant="h6" className={classes.title} onClick={() => navigateTo("/")}>
                    Notify Me
                </Typography>
                <RenderAuthButtons/>
            </Toolbar>
            <RenderBreadCrum/>
        </AppBar>
    </>
}

const useStyles = makeStyles((theme) => ({
    title: {
        flexGrow: 1,
        ...isClickable
    },
    marginBottom: {
        marginBottom: 6
    }
}));

const breadcrumbNameMap = {
    '/user': 'User',
    '/user/join/organization': 'Join Organization',
    '/user/join': '',
    '/user/inbox': 'Inbox',
    '/admin': 'Admin',
    '/admin/channels': 'Notification Channel Overview',
    '/admin/organizationmanagement': 'Organization Management',
    '/admin/organizationmanagement/create': 'Create Organization',
    '/admin/notificationoverview': 'Notification Overview',
    '/admin/venuemanagement': 'Venue Management',
    '/admin/venue/create': 'Create Venue',
    '/admin/venue/edit': 'Edit Venue',
    '/organization/pendingrequests': 'Pending Join Requests',
    '/organization/membermanagement': 'Member Management',
    '/organization/membermanagement/assign': 'Assign Member',
    '/organization/linemanagement': 'Line Management',
    '/organizations': 'Organizations',
    '/organization': 'Organization',
    '/venue/events/create': 'Create',
    '/venue/events': 'Events',
    '/venue/events/:id/lines': 'Manage lines',
    '/venue/lines/create': 'Create',
    '/venue/lines': 'Lines',
    '/venue/select': 'Select Venue',
    '/register': 'Register',
    '/logout': 'Log Out',
    '/login': 'Log In',
};

export default Navbar;