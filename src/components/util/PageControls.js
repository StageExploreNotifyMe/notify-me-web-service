const RenderPageControls = (props) => {
    let currPage = props.pageSettings.number + 1;
    let totalPages = props.pageSettings.totalPages;
    let sizeModifier = "";
    if (props.sizeModifier !== undefined) sizeModifier = props.sizeModifier;

    function renderBeforeButtons() {
        if (props.pageSettings.first) return null;
        let buttons = [];

        if (currPage < 4) {
            for (let i = 1; i < currPage; i++) {
                buttons.push(<li key={i}>
                    <a href="" className={`pagination-link ${sizeModifier}`} aria-label={"Goto page" + i}
                       onClick={(e) => changePage(e, i - 1)}>
                        {i}
                    </a>
                </li>)
            }
        } else {
            buttons.push(<li key={1}>
                <a href="" className={`pagination-link ${sizeModifier}`} aria-label={"Goto page" + 1}
                   onClick={(e) => changePage(e, 0)}>
                    1
                </a></li>)
            buttons.push(<li key={-1}><span className={`pagination-ellipsis ${sizeModifier}`}>&hellip;</span></li>)
            buttons.push(<li key={currPage - 1}>
                <a href="" className={`pagination-link ${sizeModifier}`} aria-label={"Goto page" + currPage - 1}
                   onClick={(e) => changePage(e, currPage - 2)}>
                    {currPage - 1}
                </a></li>)
        }

        return buttons;
    }

    function renderAfterButtons() {
        if (props.pageSettings.last) return null;

        let buttons = [];


        if (totalPages - currPage > 2) {
            buttons.push(<li key={currPage + 1}>
                <a href="" className={`pagination-link ${sizeModifier}`} aria-label={"Goto page" + currPage - 1}
                   onClick={(e) => changePage(e, currPage)}>
                    {currPage + 1}
                </a></li>)
            buttons.push(<li key={-2}><span className={`pagination-ellipsis ${sizeModifier}`}>&hellip;</span></li>)
            buttons.push(<li key={totalPages + 1}>
                <a href="" className={`pagination-link ${sizeModifier}`} aria-label={"Goto page" + totalPages}
                   onClick={(e) => changePage(e, totalPages - 1)}>
                    {totalPages}
                </a></li>)

        } else {
            for (let i = currPage + 1; i < totalPages + 1; i++) {
                buttons.push(<li key={i}>
                    <a href="" className={`pagination-link ${sizeModifier}`} aria-label={"Goto page" + i}
                       onClick={(e) => changePage(e, i - 1)}>{i}</a>
                </li>)
            }
        }

        return buttons;
    }

    function changePage(e, pageNumber) {
        e.preventDefault();
        if (pageNumber < 0) return;
        if (pageNumber > totalPages - 1) return;

        props.changePage(pageNumber);
    }

    return <nav className={`pagination is-centered ${sizeModifier}`} role="navigation" aria-label="pagination">
        {props.showButtons ?
            <a href="" className={`pagination-previous ${sizeModifier}`} disabled={props.pageSettings.first}
               onClick={(e) => changePage(e, currPage - 2)}>Previous</a> : ""}
        {props.showButtons ?
            <a href="" className={`pagination-next is-current ${sizeModifier}`} disabled={props.pageSettings.last}
               onClick={(e) => changePage(e, currPage)}>Next page</a> : ""}
        <ul className="pagination-list">
            {renderBeforeButtons()}
            <li><a href="" className={`pagination-link is-current ${sizeModifier}`} aria-label={"Page " + currPage}
                   aria-current="page" onClick={(e) => e.preventDefault()}>
                {currPage}
            </a></li>
            {renderAfterButtons()}
        </ul>
    </nav>
}

export default RenderPageControls;