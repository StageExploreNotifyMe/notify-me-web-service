import Organization from "./Organization";
import {getBase} from "../../js/FetchBase";
import {useSnackbar} from 'notistack';
import PagedList from "../util/PagedList";

const JoinOrganization = () => {
    const {enqueueSnackbar} = useSnackbar();

    async function fetchOrganizations(activePage) {
        try {
            let organizationsProm = getBase("/organization?page=" + activePage);
            let userOrganizationsProm = getBase("/userorganization/user/" + localStorage.getItem('user.id'));

            let organizations = await organizationsProm;
            let userOrganizations = await userOrganizationsProm;

            let content = organizations.content.map(org => {
                let userOrg = userOrganizations.userOrganizations.find(uo => uo.organization.id === org.id);
                if (userOrg !== undefined) {
                    org.status = userOrg.status
                } else {
                    org.status = "unknown";
                }
                org.hasJoined = (org.status === "ACCEPTED")

                return org
            });

            return {...organizations, content: content};
        } catch {
            enqueueSnackbar('Something went wrong while trying to save your data', {
                variant: 'error',
            });
        }
    }

    const RenderOrganizations = (props) => {
        return <Organization className="panel-block" key={props.key} content={props.data}/>
    }

    return <article className="panel">
        <div className="panel-heading has-text-centered-mobile">
            <h2 className=" title is-3">Join Organizations</h2>
        </div>
        <section>
            <PagedList fetchDataFnc={fetchOrganizations} RenderListItem={RenderOrganizations}
                       IsEmptyComponent={() => <p>No organizations found</p>}/>
        </section>
    </article>
}

export default JoinOrganization