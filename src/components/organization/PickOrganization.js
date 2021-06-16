import {getBase} from "../../js/FetchBase";

import {useHistory} from "react-router-dom";
import React, {useEffect, useState} from "react";
import Spinner from "../util/Spinner";
import {useSnackbar} from "notistack";
import {Container, List, ListItem, ListItemText, ListSubheader, Typography} from "@material-ui/core";

const PickOrganizationToManage = () => {

    const history = useHistory();
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState([]);
    const {enqueueSnackbar} = useSnackbar();

    const orgString = localStorage.getItem("organization");
    if (orgString !== null) {
        const org = JSON.parse(orgString);
        if (org.id !== undefined) {
            history.replace("/organization");
        }
    }

    async function fetchPageData() {
        try {
            let data = await getBase("/userorganization/user/" + localStorage.getItem("user.id"));
            setData(data.userOrganizations);
            setLoading(false);
        } catch {
            enqueueSnackbar('Something went wrong while trying to fetch all the venues you are a part of', {
                variant: 'error',
            });
        }
    }

    useEffect(() => {
        fetchPageData();
    }, [loading]);

    function onOrgClick(userOrg) {
        localStorage.setItem("userorganization", JSON.stringify(userOrg));
        localStorage.setItem("organization", JSON.stringify(userOrg.organization));
        history.push("/organization");
    }

    const RenderOrgs = () => {
        if (loading) return <Spinner/>

        return data.map(ev => {
            return <ListItem key={ev.id} component="li" divider={true} button>
                <ListItemText primary={ev.organization.name} onClick={() => onOrgClick(ev)}/>
            </ListItem>
        })
    }

    return <Container maxWidth="xl">
        <Typography gutterBottom variant="h4" component="h2">
            Please select which organization you'd like to see information on now:
        </Typography>
        <List component="ul" aria-label="main mailbox folders" subheader={
            <ListSubheader key={"subheader"} component="li" id="nested-list-subheader">
                Organizations
            </ListSubheader>
        }>
            <RenderOrgs/>
        </List>
    </Container>
};

export default PickOrganizationToManage;