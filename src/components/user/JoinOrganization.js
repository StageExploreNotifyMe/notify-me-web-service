import Organization from "./Organization";
//import Spinner from "../util/Spinner";

const JoinOrganization = () => {
    let organizations = [
        {id: "1", name: "Company 1", hasJoined: false},
        {id: "2", name: "Company 2", hasJoined: true}
    ];
    let loading = true;
    //todo: fetch data
    loading = false;

    const RenderOrganizations = () => {
        //if (loading) return <Spinner/>
        return organizations.map(org =>
            <Organization className="panel-block" key={org.id} content={org}/>
        );
    }

    return <div className="panel">
            <div className="panel-heading has-text-centered-mobile">
                <h2 className=" title is-3">Join Organizations</h2>
            </div>
            <RenderOrganizations/>
        </div>
}

export default JoinOrganization