import {toast} from "bulma-toast";
import {getBase} from "../../js/FetchBase";
import PagedList from "../util/PagedList";
import React, {useEffect, useState} from "react";
import {dateArrayToDate} from "../../js/DateTime";

const NotificationOverview = () => {
    const [modal, setModal] = useState({
        isActive: false,
        title: "",
        body: "",
        creationDate: "",
        creationTime: "",
        type: "",
        urgency: "",
        usedChannel: "",
        userId: ""
    });

    async function fetchNotifications(activePage) {
        try {
            return await getBase("/admin/notifications/" + activePage);
        } catch {
            toast({
                message: 'Something went wrong while fetching all notifications',
                type: 'is-danger'
            })
        }
    }

    useEffect(() => {
        fetchNotifications();
    }, []);

    const RenderNotifications = (props) => {
        const not = props.data;
        let date = dateArrayToDate(not.creationDate).toLocaleDateString();
        let time = dateArrayToDate(not.creationDate).toLocaleTimeString();
        return <div key={props.key} className="panel-block columns">
            <div className="column is-one-quarter">
                <p>{date}</p>
            </div>
            <div className="column is-one-quarter">
                <p>{not.title}</p>
            </div>
            <div className="column is-1">
                <p>{not.userId}</p>
            </div>
            <div className="column is-one-fifth">
                <p>{not.type}</p>
            </div>
            <div className="column is-1">
                <p>{not.usedChannel}</p>
            </div>
            <div className="column is-1">
                <button className="button is-info"
                        onClick={() => setModal(() => ({
                            title: not.title,
                            body: not.body,
                            creationDate: date,
                            creationTime: time,
                            type: not.type,
                            urgency: not.urgency,
                            usedChannel: not.usedChannel,
                            userId: not.userId,
                            isActive: true
                        }))}>Details
                </button>
            </div>
        </div>
    }

    const RenderDetailsModal = () => {
        if (!modal.isActive) return "";
        return <div className="modal is-active">
            <div className="modal-background"
                 onClick={() => setModal(() => ({isActive: false, content: "", title: ""}))}/>
            <div className="modal-content">
                <div className="card">
                    <div className="card-header"><h2 className="title is-3 p-2">{modal.title}</h2></div>
                    <div className="card-content">
                        <p>Date: {modal.creationDate} Time: {modal.creationTime}</p>
                        <p>UserId: {modal.userId}</p>
                        <p>Type: {modal.type}</p>
                        <p>Urgency: {modal.urgency}</p>
                        <p>Channel: {modal.usedChannel}</p>
                        <p>Message: {modal.body}</p>
                    </div>
                </div>
            </div>
            <button className="modal-close is-large" aria-label="close"
                    onClick={() => setModal(() => ({isActive: false, content: "", title: ""}))}/>
        </div>
    }

    const RenderNoNotifications = () => <p>No notifications in your overview</p>;

    return <article>
        <div className="container mt-2">
            <div className="panel">
                <div className="panel-heading has-text-centered-mobile">
                    <h2 className="title is-3">Overview Notifications</h2>
                </div>
                <div className="panel-block columns">
                    <div className="column is-one-quarter">
                        <p>Date</p>
                    </div>
                    <div className="column is-one-quarter">
                        <p>Title</p>
                    </div>
                    <div className="column is-1">
                        <p>UserId</p>
                    </div>
                    <div className="column is-one-fifth">
                        <p>Type</p>
                    </div>
                    <div className="column">
                        <p>Channel</p>
                    </div>
                </div>
                <RenderDetailsModal/>
                <PagedList fetchDataFnc={fetchNotifications} RenderListItem={RenderNotifications}
                           IsEmptyComponent={RenderNoNotifications}
                           pageControls={{showButtons: false, sizeModifier: "is-medium"}}/>
            </div>
        </div>
    </article>
}
export default NotificationOverview
