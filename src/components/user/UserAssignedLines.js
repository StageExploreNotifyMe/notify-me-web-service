import React from "react";
import {getBase, postBase} from "../../js/FetchBase";

import {dateArrayToDate} from "../../js/DateTime";
import PagedList from "../util/PagedList";
import {useSnackbar} from 'notistack';
import {Button, Paper, Table, TableBody, TableCell, TableContainer} from "@material-ui/core";

const UserAssignedLines = () => {
    let userId = localStorage.getItem("user.id");
    const {enqueueSnackbar} = useSnackbar();

    async function fetchUserLines(activePage) {
        try {
            return await getBase("/user/" + userId + "/lines?page=" + activePage);
        } catch {
            enqueueSnackbar("Something went wrong while trying to fetch the lines you were assigned to", {
                variant: 'error',
            });
        }
    }

    function cancelAttendance(line, forceUpdateFnc) {
        let body = {eventLineId: line.id, memberId: userId};
        postBase("/line/" + line.id + "/cancel/member", JSON.stringify(body)).then(() => forceUpdateFnc()).catch(() =>
            enqueueSnackbar("Something went wrong while trying to cancel your attendance", {
                variant: "error"
            })
        )
    }

    const RenderNoContent = () => {
        return <div className="panel-block">
            You currently have no lines assigned to you.
        </div>
    }

    const RenderVenueLines = (props) => {
        const line = props.data;
        const eventDate = dateArrayToDate(line.event.date);
        return <TableContainer component={Paper}>
            <Table>
                <TableBody>
                    <TableCell align="left" width={300}>{line.event.name} {line.line.name}</TableCell>
                    <TableCell
                        align="left"
                        width={300}>{eventDate.toLocaleTimeString()} {eventDate.toLocaleDateString()}</TableCell>
                    <TableCell align="right" width={300}>
                        <Button color="secondary" onClick={() => cancelAttendance(line, props.update)}> Cancel
                            attendance</Button>
                    </TableCell>
                </TableBody>
            </Table>
        </TableContainer>

    }

    return <>
        <h2 className="title is-3">Your assigned lines:</h2>
        <PagedList fetchDataFnc={fetchUserLines} RenderListItem={RenderVenueLines} IsEmptyComponent={RenderNoContent}/>
    </>
}

export default UserAssignedLines