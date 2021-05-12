import {useHistory, useParams} from "react-router-dom";

import React, {useEffect, useState} from 'react';
import {getBase} from "../../js/FetchBase";
import {toast} from "bulma-toast";

import Spinner from "../util/Spinner";

const OrganizationDetails = () => {
    let {id} = useParams();
    const history = useHistory();

    const [organizationState, setOrganizationState] = useState(null)

    async function fetchOrganizationData() {
        try {
            let result = await getBase("/organization/" + id);
            setOrganizationState(result);
        } catch {
            toast({
                message: 'Something went wrong while trying to fetch the organization data',
                type: 'is-danger'
            })
        }
    }

    useEffect(() => {
        fetchOrganizationData();
    }, []);

    if (organizationState === null) {
        return <div className="is-flex is-flex-direction-column is-align-self-center mx-4 mt-1">
            <Spinner/>
        </div>;
    }

    const OrganizationNavCard = (props) => {
        return (<div className="card">
            <header className="card-header">
                <p className="card-header-title">{props.card.title}</p>
            </header>
            <div className="card-content">
                {props.card.body}
            </div>
            <footer className="card-footer">
                <button className="card-footer-item button is-link"
                        onClick={(e) => {
                            e.preventDefault();
                            history.push(props.card.link)
                        }}>
                    Open
                </button>
            </footer>
        </div>);
    }

    return <div className="is-flex is-flex-direction-column is-align-self-center mx-4 mt-1">
        <h2 className="title is-2">Organization {organizationState.name}</h2>
        <div className="columns is-multiline">
            <div className="column is-4 is-12-mobile"><OrganizationNavCard card={{
                title: "Line management",
                body: "Manage the lines assigned to your organization",
                link: "/organization/" + id + "/linemanagement"
            }}/></div>
            <div className="column is-4 is-12-mobile"><OrganizationNavCard card={{
                title: "Member Management",
                body: "Promote and demote members",
                link: "/organization/" + id + "/membermanagement"
            }}/></div>
            <div className="column is-4 is-12-mobile"><OrganizationNavCard card={{
                title: "Join Requests",
                body: "See all the pending join requests for your organization",
                link: "/organization/" + id + "/pendingrequests"
            }}/></div>
        </div>
    </div>

}

export default OrganizationDetails