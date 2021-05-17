import React, {useEffect, useState} from "react";
import PageControls from "../util/PageControls";
import Spinner from "../util/Spinner";

const PagedList = (props) => {
    const [page, setPage] = useState({
        content: [],
        number: 0,
        first: true,
        last: true,
        totalPages: 0
    })
    const [loading, setLoading] = useState(true);
    const [hasErrored, setHasErrored] = useState(false);
    const [activePage, setActivePage] = useState(0);
    let pageControlSettings = {
        showButtons: true,
        sizeModifier : "is-medium"
    }

    if (props.pageControls !== undefined) {
        pageControlSettings = props.pageControls
    }

    async function internalFetchData() {
        try {
            let data = await props.fetchDataFnc(activePage);
            setPage(data);
            setHasErrored(false);
            setLoading(false);
            return activePage;
        } catch {
            setHasErrored(true);
        }

    }

    useEffect(() => {
        internalFetchData();
    }, [activePage]);

    function onPageChange(e) {
        setActivePage(e);
        setLoading(true);
        internalFetchData();
    }

    function forceUpdate() {
        onPageChange(activePage);
    }

    const RenderList = () => {
        if (loading) return <Spinner/>
        if (page.content.length === 0) return <div className="panel-block">{props.IsEmptyComponent({update: forceUpdate})}</div>
        return page.content.map(data => props.RenderListItem({key: data.id, data: data, update: forceUpdate}));
    }

    const RenderPageControls = () => {
        if (loading) return "";
        if (page.content.length === 0) return "";
        if (page.totalPages === 1) return "";
        return <div className="control">
            <PageControls showButtons={pageControlSettings.showButtons} sizeModifier={pageControlSettings.sizeModifier} pageSettings={page}
                          changePage={(e) => onPageChange(e)}/>
        </div>
    }

    if (hasErrored) return "";

    return <>
        <RenderList/>
        <RenderPageControls/>
    </>
};

export default PagedList;