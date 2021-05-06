import React, {useEffect, useState} from "react";
import {getBase, postBase} from "../../js/FetchBase";
import {toast} from "bulma-toast";
import {useParams} from "react-router-dom";
import PageControls from "../util/PageControls";
import Spinner from "../util/Spinner";

const AddEventLines = () => {
    let {id} = useParams();
    const venue = JSON.parse(localStorage.getItem("venue"));

    const [linesPage, setLinesPage] = useState({
        content: [],
        number: 0,
        first: true,
        last: false,
        totalPages: 0
    })
    const [loading, setLoading] = useState(true);
    const [activePage, setActivePage] = useState(0);
    const [modal, setModal] = useState({
        isActive: false,
        title: "",
        content: ""
    });

    async function fetchVenueLines() {
        try {
            let addedLinesProm = getBase("/line/event/" + id);
            let venueLinesProm = getBase("/line/venue/" + venue.id);

            let addedLines = (await addedLinesProm).content;
            let venueLines = await venueLinesProm;
            venueLines.content.map(venueLine => {
                venueLine.alreadyAdded = (addedLines.find(addedLine => addedLine.line.id === venueLine.id) !== undefined && addedLines.find(addedLine => addedLine.eventLineStatus !== "CANCELED"));
                return venueLine
            });

            setLinesPage(venueLines)
            setLoading(false)
        } catch {
            toast({
                message: 'Something went wrong while trying to fetch the lines for your venue',
                type: 'is-danger'
            })
        }
    }

    useEffect(() => {
        fetchVenueLines();
    }, [activePage]);

    function onPageChange(e) {
        setActivePage(e);
        setLoading(true);
        fetchVenueLines();
    }

    function onLineChange(e, line) {
        let added = e.target.checked;
        if (!added) {
            toast({
                message: 'Not Implemented',
                type: 'is-danger'
            })
            return;
        }

        line.alreadyAdded = added;
        postBase("/line/event/add", JSON.stringify({lineId: line.id, eventId: id})).then(() => {
            onPageChange(activePage)
        });
    }

    const RenderVenueLines = () => {
        if (loading) return <Spinner/>
        if (linesPage.content.length === 0) return <div className="panel-block">No lines found for your venue.</div>
        return linesPage.content.map(line => {
            return <div className="panel-block columns" key={line.id}>
                <div className="column is-1">
                    <input type="checkbox"
                           className="switch is-success" checked={line.alreadyAdded}
                           onChange={(e) => onLineChange(e, line)}/>
                    <label className="is-hidden"> Add {line.name}</label>
                </div>

                <div className="is-clickable column"
                     onClick={() => setModal(() => ({
                         title: line.name,
                         content: line.description,
                         isActive: true
                     }))}>{line.name}</div>
            </div>
        });
    }

    const RenderDescriptionModal = () => {
        if (!modal.isActive) return "";

        return <div className="modal is-active">
            <div className="modal-background"
                 onClick={() => setModal(() => ({isActive: false, content: "", title: ""}))}/>
            <div className="modal-content">
                <div className="card">
                    <div className="card-header"><h2 className="title is-3 p-2">{modal.title}</h2></div>
                    <div className="card-content"> {modal.content}</div>
                </div>
            </div>
            <button className="modal-close is-large" aria-label="close"
                    onClick={() => setModal(() => ({isActive: false, content: "", title: ""}))}/>
        </div>
    }

    return <div className="panel">
        <div className="panel-heading">
            <h2 className="title is-3">Add Lines to this event</h2>
        </div>
        <RenderDescriptionModal/>
        <RenderVenueLines/>
        {
            linesPage.content.length === 0 ? "" :
                <div className="control">
                    <PageControls showButtons={true} pageSettings={linesPage}
                                  changePage={(e) => onPageChange(e)}/>
                </div>
        }
    </div>
};

export default AddEventLines;