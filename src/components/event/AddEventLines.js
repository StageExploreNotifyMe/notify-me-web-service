import React from "react";
import {getBase, postBase} from "../../js/FetchBase";
import PagedList from "../util/PagedList";
import {useSnackbar} from 'notistack';
import {
    Container,
    Paper,
    Switch,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Tooltip,
    Typography
} from "@material-ui/core";

const AddEventLines = () => {
    const event = JSON.parse(localStorage.getItem("currentEvent"));
    const venue = JSON.parse(localStorage.getItem("venue"));
    const userId = JSON.parse(localStorage.getItem("user.id"));
    const {enqueueSnackbar} = useSnackbar();

    async function fetchVenueLines() {
        try {
            let addedLinesProm = getBase("/line/event/" + event.id);
            let venueLinesProm = getBase("/line/venue/" + venue.id);

            let addedLines = (await addedLinesProm).content;
            let venueLines = await venueLinesProm;
            venueLines.content.map(venueLine => {
                venueLine.alreadyAdded = (addedLines.find(addedLine => addedLine.line.id === venueLine.id) !== undefined && addedLines.find(addedLine => addedLine.eventLineStatus !== "CANCELED") !== undefined);
                return venueLine
            });

            return venueLines;
        } catch {
            enqueueSnackbar("Something went wrong while trying to fetch the lines for your venue", {
                variant: 'error',
            });
        }
    }

    function onLineChange(e, line, forceUpdateFnc) {
        let added = e.target.checked;
        if (!added) {
            enqueueSnackbar("Not Implemented", {
                severity: "warning"
            });
            return;
        }

        line.alreadyAdded = added;
        postBase("/line/event/add", JSON.stringify({
            lineId: line.id,
            eventId: event.id,
            lineManagerId: userId
        })).then(() => {
            forceUpdateFnc();
        }).catch(() => {
            enqueueSnackbar("Something went wrong while trying to fetch the lines for your venue", {
                variant: 'error',
            });
        });
    }

    const RenderVenueLines = (props) => {
        const line = props.data
        if (line === undefined) return "";
        return <TableRow key={line.id}>
            <TableCell padding="checkbox" align="center">
                <Switch
                    checked={line.alreadyAdded}
                    onChange={(e) => onLineChange(e, line, props.update)}
                    inputProps={{'aria-label': 'secondary checkbox'}}
                />
            </TableCell>
            <TableCell align={"center"}>
                <Tooltip title={line.description}>
                    <p>{line.name}</p>
                </Tooltip>
            </TableCell>
        </TableRow>
    }

    return <Container maxWidth={"xl"}>
        <Typography gutterBottom variant="h4" component="h2" align={"center"}>
            Add Lines to this event
        </Typography>

        <Container maxWidth={"sm"}>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableCell> </TableCell>
                        <TableCell align={"center"}>Line</TableCell>
                    </TableHead>
                    <TableBody>
                        <PagedList fetchDataFnc={fetchVenueLines} RenderListItem={RenderVenueLines}
                                   IsEmptyComponent={() => <p>No lines found for your venue</p>}/>
                    </TableBody>
                </Table>
            </TableContainer>
        </Container>
    </Container>
};

export default AddEventLines;