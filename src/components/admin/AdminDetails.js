import {useHistory} from "react-router-dom";

import React from 'react';

const AdminDetails = () => {

    const history = useHistory();

    const AdminNavCard = (props) => {
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
        <h2 className="title is-2">Admin Details</h2>
        <div className="columns is-multiline">
            <div className="column is-4 is-12-mobile"><AdminNavCard card={{
                title: "Notification details",
                body: "See all the information about all the notifications that have been send",
                link: "/admin/NotificationOverview"
            }}/></div>
            <div className="column is-4 is-12-mobile"><AdminNavCard card={{
                title: "Organization Management",
                body: "Manage the organizations known in the system",
                link: "/admin/organizationManagement"
            }}/></div>
            <div className="column is-4 is-12-mobile"><AdminNavCard card={{
                title: "Sent notifications overview",
                body: "See how many messages have been sent via which channels",
                link: "/admin/channels"
            }}/></div>
        </div>
    </div>

}
export default AdminDetails