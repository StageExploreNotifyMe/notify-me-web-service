import React, {useEffect, useState} from 'react';
import {toast} from "bulma-toast";
import {getBase} from "../../js/FetchBase";
import PageControls from "../util/PageControls";
import {dateArrayToDate} from "../../js/DateTime";


const Inbox = () => {
    let notificationDate = null;
    const [notification, setNotification] = useState(null)
    const [urgency, setUrgency] = useState({urgency: "URGENT"})
    const [activePage, setActivePage] = useState(0);
    const [notificationPage, setNotificationPage] = useState({
        content: [],
        number: 0,
        first: true,
        last: false,
        totalPages: 0
    })


    async function fetchNotifications() {
        try {
            let result = await getBase("/user/inbox/" + localStorage.getItem('user.id') + "/pending/" + activePage);
            setNotificationPage(result)

        } catch {
            toast({
                message: 'Something went wrong while trying to fetch your notifications', type: 'is-danger'
            })
        }
    }

    function confirmUrgent(urgent) {
        if (urgent) {
            setUrgency("URGENT")
        } else {
            setUrgency("NORMAL")
        }
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

    function onPageChange(e) {
        setActivePage(e);
        fetchNotifications();
    }

    useEffect(() => {
        fetchNotifications();
    }, [activePage]);

    const RenderNotifications = () => {
        if (notificationPage.content.length === 0) return <div className="box">No notifications in your inbox</div>
        return notificationPage.content.filter(n => n.urgency === urgency).map(not =>
            <div onClick={() => {
                setNotification(not);
            }} className="box is-clickable">
                <p className="field">{not.title}</p>
                <p className="field-body">{not.body}</p>
            </div>)
    }

    return <div>
        <h2>Inbox</h2>
        <div className="columns">
            <div className="column is-one-quarter">
                <div className="panel-tabs">
                    <a onClick={() => {
                        confirmUrgent(true);
                        setUrgency(0);
                    }}>Urgent</a>
                    <a onClick={() => {
                        confirmUrgent(false);
                    }}>Normal</a>
                </div>
                <RenderNotifications/>
            </div>
            <div className="column">
                <ShowFullNotification/>
            </div>
        </div>
        {
            notificationPage.content.length === 0 ? "" :
                <div className="control">
                    <PageControls showButtons={true} pageSettings={notificationPage}
                                  changePage={(e) => onPageChange(e)}/>
                </div>
        }
    </div>
}


export default Inbox