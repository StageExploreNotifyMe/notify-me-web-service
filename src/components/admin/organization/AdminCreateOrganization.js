import React, {useState} from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faExclamationTriangle} from "@fortawesome/free-solid-svg-icons";
import {useHistory} from "react-router-dom";
import {getBase, postBase} from "../../../js/FetchBase";
import {toast} from "bulma-toast";
import PagedList from "../../util/PagedList";

const AdminCreateOrganization = () => {
    const history = useHistory();

    const [organization, setOrganization] = useState({
        name: "",
        userId: "",
        user: {}
    })
    const [validationState, setValidationState] = useState({
        noUser: false,
        noName: false
    })

    function isValidState() {
        let noName = organization.name === "";
        let noUser = organization.userId === "";

        setValidationState(prevState => ({
            ...prevState,
            noName: noName,
            noUser: noUser
        }))
        console.error(noName, noUser)

        return (!noName && ! noUser);
    }

    async function fetchUsers(activePage) {
        try {
            return await getBase("/user?page=" + activePage);
        } catch {
            toast({
                message: 'Something went wrong while fetching all users',
                type: 'is-danger'
            })
        }
    }

    const RenderUsers = (props) => {
        const user = props.data;

        return <div key={props.key}
                    className={`panel-block is-clickable ${user.id === organization.userId ? "has-background-primary" : ""}`}
                    onClick={() => setOrganization(prevState => ({
                        ...prevState,
                        userId: user.id,
                        user: user
                    }))}
        >
            {user.firstname} {user.lastname}
        </div>
    }

    function submitEvent(e) {
        e.preventDefault();

        if( !isValidState()) return;

        postBase("/organization/create", JSON.stringify({
            organizationName: organization.name,
            userId: organization.userId
        })).then(() => {
            history.goBack();
        }).catch((error) => {
            if (error.info.status === 409) {
                toast({
                    message: 'There is already an organization with the name ' + organization.name,
                    type: 'is-danger',
                    duration: 5000
                })
            } else {
                toast({
                    message: 'Something went wrong while trying to create your organization',
                    type: 'is-danger'
                })
            }
        })
    }

    return <article className="container mt-2">
        <div className="level">
            <div className="level-left"><h2 className="title is-2 level-item">Create Organization</h2></div>
        </div>
        <form>
            <div className="field">
                <label className="label">Name</label>
                <div className={`control ${validationState.noName ? 'has-icons-right' : ''}`}>
                    <input className={`input ${validationState.noName ? 'is-danger' : ''}`} type="text"
                           placeholder="Name of the organization" value={organization.name}
                           onChange={e => {
                               setOrganization(prevState => ({
                                   ...prevState,
                                   name: e.target.value
                               }))
                               setValidationState(prevState => ({
                                   ...prevState,
                                   noName: e.target.value === ""
                               }))
                           }}/>
                    <span
                        className={`icon is-small is-right ${validationState.noName ? '' : 'is-hidden'}`}>
                            <FontAwesomeIcon icon={faExclamationTriangle}/>
                        </span>
                    <p className={`help is-danger ${validationState.noName ? '' : 'is-hidden'}`}>
                        An organization must have a name
                    </p>
                </div>

                <div className="panel mt-4">
                    <div className="panel-heading has-text-centered-mobile">
                        <h2 className="title is-5">Select the organization
                            leader{organization.user.firstname !== undefined ? (": " + organization.user.firstname + " " + organization.user.lastname) : ""}</h2>
                    </div>
                    <PagedList fetchDataFnc={fetchUsers} RenderListItem={RenderUsers}
                               IsEmptyComponent={() => <p>No users found</p>}
                               pageControls={{showButtons: true, sizeModifier: "is-small"}}/>
                </div>
                <p className={`help is-danger ${validationState.noUser ? '' : 'is-hidden'}`}>
                    Please select a user to be the organization leader
                </p>

            </div>

            <div className="field is-grouped">
                <div className="control">
                    <button onClick={(e) => submitEvent(e)} className="button is-link"
                            disabled={validationState.dateInpast || validationState.noName}>Submit
                    </button>
                </div>
                <div className="control">
                    <button onClick={() => history.goBack()} className="button is-link is-light">Cancel</button>
                </div>
            </div>
        </form>

    </article>;
}

export default AdminCreateOrganization