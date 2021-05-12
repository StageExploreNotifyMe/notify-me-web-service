import React, {useState} from 'react';
import {toast} from "bulma-toast";
import {getBase} from "../../js/FetchBase";
import {dateArrayToDate} from "../../js/DateTime";
import PagedList from "../util/PagedList";


const Inbox = () => {
    let notificationDate = null;
    const [notification, setNotification] = useState(null)
    const [isDisplayingUrgent, setIsDisplayingUrgent] = useState(false)
    let forceUpdateFnc;

    async function fetchNotifications(activePage) {
        try {
            return await getBase("/user/inbox/" + localStorage.getItem('user.id') + "/pending/" + activePage);
        } catch {
            toast({
                message: 'Something went wrong while trying to fetch your notifications', type: 'is-danger'
            })
        }
    }

    function confirmUrgent(urgent) {
        setIsDisplayingUrgent(urgent)
        if (forceUpdateFnc !== undefined) forceUpdateFnc();
    }

    const ShowFullNotification = () => {
        if (notification === null) {
            return <div className="card">
                <div className="card-header">
                    <h3>No notification selected</h3>
                </div>
            </div>
        }
        let date = dateArrayToDate(notification.creationDate);
        notificationDate = date.toISOString().split('T')[0];
        return <div className="card">
            <div className="card-header">
                <h3>{notification.title}</h3>
            </div>
            <div className="card-content">
                <p>{notification.title}</p>
                <p className="has-text-right">{notificationDate}</p>
                <p>{notification.body}</p>
            </div>
        </div>
    }

    const RenderNotifications = (props) => {
        forceUpdateFnc = props.update;
        const not = props.data;
        if (isDisplayingUrgent && not.urgency !== "URGENT") return "";

        return <div key={props.key} onClick={() => {
            setNotification(not);
        }} className="box is-clickable">
            <p className="field">{not.title}</p>
            <p className="field-body">{not.body}</p>
        </div>
    }

    const RenderNoNotifications = () => <p>No notifications in your inbox</p>;

    return <article>
        <section className="hero is-primary">
            <div className="hero-body">
                <h2 className="title is-2">Inbox</h2>
            </div>
        </section>
        <section className="section">
            <div className="columns">
                <div className="column is-one-quarter panel-tabs has-text-centered">
                    <a onClick={() => confirmUrgent(false)}>
                        All
                    </a>
                    <a onClick={() => confirmUrgent(true)}>
                        Urgent
                    </a>
                </div>
            </div>
            <div className="columns">
                <div className="column is-one-quarter">
                    <PagedList fetchDataFnc={fetchNotifications} RenderListItem={RenderNotifications}
                               IsEmptyComponent={RenderNoNotifications}
                               pageControls={{showButtons: false, sizeModifier: "is-small"}}/>
                </div>
                <div className="column">
                    <ShowFullNotification/>
                </div>
            </div>
        </section>
    </article>
}

export default Inbox