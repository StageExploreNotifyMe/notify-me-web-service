import {useHistory, useParams} from "react-router-dom";
import {getBase} from "../../js/FetchBase";
import {toast} from "bulma-toast";
import React, {useEffect, useState} from "react";
import PageControls from "../util/PageControls";
import Spinner from "../util/Spinner";
import {dateArrayToDate} from "../../js/DateTime";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faEdit} from "@fortawesome/free-solid-svg-icons";

const OrganizationLines = () => {
    let {id} = useParams();
    const history = useHistory();

    const [linesPage, setLinesPage] = useState({
        content: [],
        number: 0,
        first: true,
        last: false,
        totalPages: 0
    })
    const [loading, setLoading] = useState(true);
    const [activePage, setActivePage] = useState(0);

    async function fetchData() {
        try {
            let requests = await getBase("/line/organization/" + id + "?page=" + activePage);
            setLinesPage(requests)
            setLoading(false)
        } catch {
            toast({
                message: 'Something went wrong while trying to fetch the lines your organization was assigned to',
                type: 'is-danger'
            })
        }
    }

    useEffect(() => {
        fetchData();
    }, [activePage]);

    function onPageChange(e) {
        setActivePage(e);
        setLoading(true);
        fetchData();
    }

    function assignLine(line) {
        localStorage.setItem("organization.memberassignment.line", JSON.stringify(line));
        history.push("/organization/" + line.organization.id + "/memberassignment/assign")
    }

    const RenderJoinRequests = () => {
        if (loading) return <Spinner/>
        if (linesPage.content.length === 0) return <div className="panel-block">
            No lines assigned to your organization
        </div>

        return linesPage.content.map(line => <div className="columns" key={line.id}>
            <p className="column is-2"><span className="title is-6">Event: </span> {line.event.name}</p>
            <p className="column is-3"><span className="title is-6">Line: </span> {line.line.name}</p>
            <p className="column is-3"><span className="title is-6">Date: </span>{dateArrayToDate(line.event.date).toISOString()}</p>
            <p className="column is-3"><span className="title is-6">Current assigned members: </span>{line.assignedUsers.length}</p>
            <p className="column is-1">
                <span className="is-clickable" onClick={() => assignLine(line)}>
                    <span className="icon"><FontAwesomeIcon icon={faEdit}/></span>
                </span>
            </p>
        </div>);
    }

    return <div className="is-flex is-flex-direction-column is-align-self-center mx-4 mt-1">
        <h2 className="title is-2">Assign members to lines</h2>
        <div className="panel">
            <div className="panel-heading has-text-centered-mobile">
                <h2 className=" title is-3">Lines</h2>
            </div>
            <RenderJoinRequests/>
            {
                linesPage.content.length === 0 ? "" :
                    <div className="control">
                        <PageControls showButtons={true} pageSettings={linesPage}
                                      changePage={(e) => onPageChange(e)}/>
                    </div>
            }
        </div>
    </div>
};

export default OrganizationLines