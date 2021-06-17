import {getBase} from "../../js/FetchBase";
import React, {useEffect, useState} from "react";
import {useSnackbar} from 'notistack';
import {
    Container,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography
} from "@material-ui/core";

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
        if (loading) return <TableBody><TableCell colSpan={2}>No channels</TableCell></TableBody>
        return channels.map(c =>
            <TableBody>
                <TableCell>{c[1]}</TableCell>
                <TableCell>{c[0]}</TableCell>
            </TableBody>
        )
    }

    return <Container maxWidth={"md"}>
        <Typography gutterBottom variant="h4" component="h2">Overview Notifications</Typography>
        <TableContainer component={Paper}>
            <Table aria-label="simple table">
                <TableHead>
                    <TableRow>
                        <TableCell>Channel</TableCell>
                        <TableCell>Amount</TableCell>
                    </TableRow>
                </TableHead>
                <RenderChannels/>
            </Table>
        </TableContainer>
    </Container>
}
export default ChannelOverview