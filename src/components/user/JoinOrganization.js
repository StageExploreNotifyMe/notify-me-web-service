import Organization from "./Organization";

const JoinOrganization = () => {
    let organizations = [
        {id: "1", name: "Company 1", hasJoined: false},
        {id: "2", name: "Company 2", hasJoined: true}
    ];

    const RenderOrganizations = () => {
        return organizations.map(org =>
            <Organization className="panel-block" key={org.id} content={org}/>
        );
    }

    return <div>
        <div className="panel">
            <div className="panel-heading has-text-centered-mobile">
                <h2 className=" title is-3">Join Organizations</h2>
            </div>
            <RenderOrganizations/>
        </div>
    </div>
}

export default JoinOrganization