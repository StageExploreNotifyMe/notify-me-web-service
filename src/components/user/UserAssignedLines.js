import React, {useEffect, useState} from "react";
import {getBase, postBase} from "../../js/FetchBase";
import {toast} from "bulma-toast";
import PageControls from "../util/PageControls";
import Spinner from "../util/Spinner";
import {dateArrayToDate} from "../../js/DateTime";

const UserAssignedLines = () => {

    let userId = localStorage.getItem("user.id");

    const [linesPage, setLinesPage] = useState({
        content: [],
        number: 0,
        first: true,
        last: false,
        totalPages: 0
    })
    const [loading, setLoading] = useState(true);
    const [activePage, setActivePage] = useState(0);

    async function fetchUserLines() {
        try {
            let userLines = await getBase("/user/" + userId + "/lines?page=" + activePage);

            setLinesPage(userLines)
            setLoading(false)
        } catch {
            toast({
                message: 'Something went wrong while trying to fetch the lines you were assigned to',
                type: 'is-danger'
            })
        }
    }

    useEffect(() => {
        fetchUserLines();
    }, [activePage]);

    function onPageChange(e) {
        setActivePage(e);
        setLoading(true);
        fetchUserLines();
    }

    function cancelAttendance(line) {
        let body = {eventLineId: line.id, memberId: userId};
        postBase("/line/" + line.id + "/cancel/member", JSON.stringify(body)).then(() => onPageChange(activePage)).catch(() =>
            toast({
                message: 'Something went wrong while trying to cancel your attendance',
                type: 'is-danger'
            })
        )
    }

    const RenderVenueLines = () => {
        if (loading) return <Spinner/>
        if (linesPage.content.length === 0) return <div className="panel-block">You currently have no lines assigned to
            you.</div>
        return linesPage.content.map(line => {
            const eventDate = dateArrayToDate(line.event.date);
            return <div className="panel-block columns" key={line.id}>
                <p className="column">{line.event.name} {line.line.name} </p>
                <p className="column">{eventDate.toLocaleTimeString()} {eventDate.toLocaleDateString()}</p>
                <p className="column is-2">
                    <button className="button is-danger" onClick={() => cancelAttendance(line)}>
                        Cancel attendance
                    </button>
                </p>
            </div>
        });
    }

    return <>
        <h2 className="title is-3">Your assigned lines:</h2>
        <RenderVenueLines/>
        {
            linesPage.content.length === 0 ? "" :
                <div className="control">
                    <PageControls showButtons={true} pageSettings={linesPage}
                                  changePage={(e) => onPageChange(e)}/>
                </div>
        }
    </>
}

export default UserAssignedLines