import React, {useEffect, useState} from "react";
import Spinner from "../util/Spinner";
import {Pagination} from "@material-ui/lab";
import {Box, TableCell, TableRow, Typography} from "@material-ui/core";

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

    async function internalFetchData() {
        try {
            let data = await props.fetchDataFnc(activePage);
            if (data === undefined) {
                setHasErrored(true);
            } else {
                setPage(data);
                setHasErrored(false);
                setLoading(false);
            }
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
        if (hasErrored) return "";
        if (page.content.length === 0) return <div
            className="panel-block">{props.IsEmptyComponent({update: forceUpdate})}</div>
        return page.content.map(data => props.RenderListItem({key: data.id, data: data, update: forceUpdate}));
    }

    const RenderPageControls = () => {
        if (loading || hasErrored) return "";
        if (page.content.length === 0) return "";
        if (page.totalPages === 1) return "";
        if (props.colspan) {
            return <TableRow>
                <TableCell colSpan={props.colspan}>
                    <Box my={2} display="flex" justifyContent="center">
                        <Typography gutterBottom variant="body1" align={"center"} component="div">
                            <Pagination
                                count={page.totalPages}
                                defaultPage={1}
                                page={activePage + 1}
                                onChange={(e, page) => onPageChange(page - 1)}
                                boundaryCount={1}
                                siblingCount={1}
                                color="primary"
                            />
                        </Typography>
                    </Box>
                </TableCell>
            </TableRow>
        }

        return <Pagination
            count={page.totalPages}
            defaultPage={1}
            page={activePage + 1}
            onChange={(e, page) => onPageChange(page - 1)}
            boundaryCount={1}
            siblingCount={1}
            color="primary"
        />
    }

    if (hasErrored) return "";

    return <>
        <RenderList/>
        <RenderPageControls/>
    </>
};

export default PagedList;