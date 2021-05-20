import PagedList from "../../util/PagedList";
import React from "react";
import {useHistory} from "react-router-dom";
import {getBase} from "../../../js/FetchBase";
import {toast} from "bulma-toast";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faEdit} from "@fortawesome/free-solid-svg-icons";
import ReactTooltip from "react-tooltip";

const ManageLines = () => {

    const history = useHistory();
    const createLineLink = "/venue/lines/create";
    const venue = JSON.parse(localStorage.getItem("venue"));

    async function fetchPageData(activePage) {
        try {
            return await getBase("/line/venue/" + venue.id + "?page=" + activePage);
        } catch {
            toast({
                message: 'Something went wrong while trying to fetch your lines',
                type: 'is-danger'
            })
        }
    }

    const RenderLines = (props) => {
        let line = props.data;
        return <div className="panel-block columns" key={line.id}>
            <div className="column" data-tip="" data-for={line.id}> {line.name}
                <ReactTooltip id={line.id} place="top" type="dark" effect="solid">
                    {line.description}
                </ReactTooltip></div>
            <div className="column">Required people: {line.numberOfRequiredPeople}</div>
            <div className="column is-1">
                <span className="icon is-clickable" onClick={() => {
                    localStorage.setItem("editLine", JSON.stringify(line));
                    history.push("/venue/lines/edit");
                }}>
                    <FontAwesomeIcon icon={faEdit}/>
                </span>
            </div>
        </div>
    }

    const RenderNoLines = () => {
        return <div className="panel-block">
            No lines for your venue yet. Create the first one now by clicking&nbsp;
            <span className="has-text-link is-clickable" onClick={() => history.push(createLineLink)}>
                here
            </span>
            !
        </div>
    };

    return <div className="container mt-2">
        <div className="level">
            <div className="level-left"><h2 className="title is-2 level-item">Line Management</h2></div>
            <div className="level-right">
                <button onClick={() => {
                    history.push(createLineLink)
                }} className="button is-link level-item">
                    Create Line
                </button>
            </div>
        </div>
        <div className="panel">
            <div className="panel-heading has-text-centered-mobile">
                <h2 className="title is-3">Lines</h2>
            </div>
            <PagedList fetchDataFnc={fetchPageData} RenderListItem={RenderLines} IsEmptyComponent={RenderNoLines}/>
        </div>
    </div>;
};

export default ManageLines