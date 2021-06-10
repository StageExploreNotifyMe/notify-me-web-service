import {useHistory} from "react-router-dom";

import React from 'react';
import UnlockAccess from "../authentication/UnlockAccess";

const OrganizationDetails = () => {
    const org = JSON.parse(localStorage.getItem("organization"));
    const history = useHistory();

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

    function changeOrg() {
        localStorage.setItem("userorganization", JSON.stringify({}));
        localStorage.setItem("organization", JSON.stringify({}));
        history.push('/organizations');
    }

    return <div className="is-flex is-flex-direction-column is-align-self-center mx-4 mt-1">
        <h2 className="title is-2">Organization {org.name}</h2>
        <div className="mb-2">
            <button onClick={() => changeOrg()} className="button is-link">Change Organization</button>
        </div>

        <UnlockAccess request={['ORGANIZATION_LEADER']}>
            <div className="columns is-multiline">
                <div className="column is-4 is-12-mobile"><OrganizationNavCard card={{
                    title: "Line management",
                    body: "Manage the lines assigned to your organization",
                    link: "/organization/linemanagement"
                }}/></div>
                <div className="column is-4 is-12-mobile"><OrganizationNavCard card={{
                    title: "Member Management",
                    body: "Promote and demote members",
                    link: "/organization/membermanagement"
                }}/></div>
                <div className="column is-4 is-12-mobile"><OrganizationNavCard card={{
                    title: "Join Requests",
                    body: "See all the pending join requests for your organization",
                    link: "/organization/pendingrequests"
                }}/></div>
            </div>
        </UnlockAccess>
    </div>
}

export default OrganizationDetails