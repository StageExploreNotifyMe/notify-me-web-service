import {getBase, postBase} from "../../js/FetchBase";
import React, {useEffect, useRef, useState} from 'react';

import classnames from "classnames";
import {useSnackbar} from "notistack";
import {
    FormControl,
    FormControlLabel,
    FormLabel,
    Grid,
    InputLabel,
    MenuItem,
    Radio,
    RadioGroup,
    Select
} from "@material-ui/core";

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
            <FormControlLabel key={"normal-" + pref}
                              value={pref}
                              checked={pref === channel.normalChannel}
                              label={pref}
                              control={<Radio/>}
                              onChange={() => onPreferenceChanged(pref, "normal")}>

            </FormControlLabel>
        )
    }

    const RenderUrgentPreferences = () => {
        if (loadingPreferences) return <p>no notifications rendered</p>
        return notificationPreferences.map(pref =>
            <FormControlLabel key={"urgent-" + pref}
                              value={pref}
                              checked={pref === channel.urgentChannel}
                              label={pref}
                              control={<Radio/>}
                              onChange={() => onPreferenceChanged(pref, "urgent")}>
            </FormControlLabel>
        )
    };


    const LanguageDropdown = () => {
        return languages.map(l =>
           <MenuItem>
                {l.language}
           </MenuItem>
        )
    }

    return <><h2>User Preferences</h2>
        <Grid container
              direction="row"
              spacing={3}
        >
            <Grid item xs={6} sm={3}>
                <FormControl>
                    <FormLabel>Normal Notifications:</FormLabel>
                    <RadioGroup>
                        <RenderNormalPreferences/>
                    </RadioGroup>
                </FormControl>
            </Grid>
            <Grid item xs={6} sm={3}>
                <FormControl>
                    <FormLabel>Urgent Notifications:</FormLabel>
                    <RadioGroup>
                        <RenderUrgentPreferences/>
                    </RadioGroup>
                </FormControl>
            </Grid>
        </Grid>
        <div ref={menu} className={classnames("dropdown", {"is-active": open})}>
            <div className="dropdown-trigger" onClick={e => {
                e.preventDefault();
                setOpen(!open)
            }}>
                           </div>
            <div>
            <FormControl style={{minWidth: 120}}>
                <InputLabel>Language</InputLabel>
                <Select>
                    <LanguageDropdown/>
                </Select>
            </FormControl>
            </div>
        </div>

    </>
}

export default UserPreferences