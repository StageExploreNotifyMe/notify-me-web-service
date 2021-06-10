import {getBase} from "../../js/FetchBase";
import React, {useEffect, useState} from "react";
import {useSnackbar} from 'notistack';

const ChannelOverview = () => {

    const [loading, setLoading] = useState(true)
    const [channels, setChannels] = useState([])
    const {enqueueSnackbar} = useSnackbar();

    async function fetchChannelsAmount() {
        try {
            let result = await getBase("/admin/channelAmount");
            setLoading(false)
            setChannels(result.notificationAmounts)
            return result
        } catch {
            enqueueSnackbar("Something went wrong while fetching all channels", {
                severity: "error"
            });
        }
    }

    useEffect(() => {
        fetchChannelsAmount();
    }, [loading]);

    const RenderChannels = () => {
        if (loading) return <p>No channels</p>
        return channels.map(c =>
            <div className="panel-block columns">
                <div className="column is-one-third">
                    <p>{c[1]}</p>
                </div>
                <div className="column">
                    <p>{c[0]}</p>
                </div>
            </div>
        )
    }

    return <article>
        <div className="container mt-2">
            <div className="panel">
                <div className="panel-heading has-text-centered-mobile">
                    <h2 className="title is-3">Overview Notifications</h2>
                </div>
                <div className="panel-block columns">
                    <div className="column is-one-third">
                        <p>Channel</p>
                    </div>
                    <div className="column ">
                        <p>Amount</p>
                    </div>
                </div>
                <RenderChannels/>
            </div>
        </div>
    </article>
}
export default ChannelOverview