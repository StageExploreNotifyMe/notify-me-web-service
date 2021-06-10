import {getBase, postBase} from "../../js/FetchBase";
import React, {useEffect, useRef, useState} from 'react';

import classnames from "classnames";
import {useSnackbar} from "notistack";

const UserPreferences = () => {
    const [notificationPreferences, setNotificationPreferences] = useState(null)
    const [loadingPreferences, setLoadingPreferences] = useState(true)
    const [channel, setChannel] = useState(null)
    const [open, setOpen] = useState(false)
    const menu = useRef();
    const {enqueueSnackbar} = useSnackbar();
    let languages = [
        {id: "1", language: "English"},
        {id: "2", language: "Nederlands"}
    ];

    async function fetchNotificationPreferences() {
        try {
            let possibleChannelsProm = getBase("/user/preferences");
            let userChannelsProm = getBase("/user/" + localStorage.getItem("user.id") + "/channel");
            setChannel(await userChannelsProm);
            setNotificationPreferences((await possibleChannelsProm).notificationChannels);
            setLoadingPreferences(false);
        } catch (e) {
            enqueueSnackbar('Something went wrong while trying to fetch your notificationPreferences', {
                variant: 'error',
            });
        }
    }

    function confirmChangeChannel(body) {
        postBase("/user/" + localStorage.getItem("user.id") + "/preferences/channel", JSON.stringify(body)).then(() => {
        }).catch(() => {
            enqueueSnackbar('Something went wrong while trying to save your channel', {
                variant: 'error',
            });
        })
    }

    function onPreferenceChanged(newPreference, type) {
        let newPrefObj = {...channel};
        if (type === "normal") {
            newPrefObj.normalChannel = newPreference;
        } else if (type === "urgent") {
            newPrefObj.urgentChannel = newPreference;
        } else {
            return;
        }
        setChannel(() => (newPrefObj))
        confirmChangeChannel(newPrefObj)
    }

    useEffect(() => {
        fetchNotificationPreferences();
    }, [loadingPreferences]);

    const RenderNormalPreferences = () => {
        if (loadingPreferences) return <p>no notifications rendered</p>
        return notificationPreferences.map(pref =>
            <label key={"normal-" + pref} className="radio">
                <input
                    aria-label="Radio Button"
                    checked={pref === channel.normalChannel}
                    onChange={() => onPreferenceChanged(pref, "normal")}
                    type="radio" id={"radioNormal"}/>
                {pref}
            </label>
        )
    }

    const RenderUrgentPreferences = () => {
        if (loadingPreferences) return <p>no notifications rendered</p>
        return notificationPreferences.map(pref =>
            <label key={"urgent-" + pref} className="radio">
                <input
                    checked={pref === channel.urgentChannel}
                    onChange={() => onPreferenceChanged(pref, "urgent")}
                    type="radio" id={"radioUrgent"}/>
                {pref}
            </label>
        )
    }
    const LanguageDropdown = () => {
        return languages.map(l =>
            <a className="dropdown-item" key={l.id}>
                {l.language}
            </a>
        )
    }

    return <><h2>User Preferences</h2>
        <div className="control">
            <label className="radio">Normal Notifications: </label>
            <RenderNormalPreferences/>
        </div>
        <div className="control">
            <label>Urgent Notifications: </label>
            <RenderUrgentPreferences/>
        </div>
        <div ref={menu} className={classnames("dropdown", {"is-active": open})}>
            <div className="dropdown-trigger" onClick={e => {
                e.preventDefault();
                setOpen(!open)
            }}>
                <button className="button" aria-haspopup="true" aria-controls="dropdown-menu">
                    <span>Language</span>
                    <span className="icon is-small">
        <i className="fas fa-angle-down" aria-hidden="true"></i>
      </span>
                </button>
            </div>
            <div className="dropdown-menu" id="dropdown-menu" role="menu">
                <div className="dropdown-content">
                    <LanguageDropdown/>
                </div>
            </div>
        </div>
    </>
}

export default UserPreferences