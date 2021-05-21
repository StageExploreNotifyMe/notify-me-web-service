import {useHistory} from "react-router-dom";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faExclamationTriangle} from "@fortawesome/free-solid-svg-icons";
import {useState} from "react";
import {getBase, postBase} from "../../js/FetchBase";
import {toast} from "bulma-toast";
import PagedList from "../util/PagedList";

const CreateVenue = (props) => {
    const isCreating = props.action === 'create'
    const history = useHistory();
    const [validationState, setValidationState] = useState({
        noName: false,
        noUser: false
    })
    let editDto = {
        id: "",
        name: "",
        venueManagerIds: "",
        users: []
    }

    if (!isCreating) {
        let toEdit = JSON.parse(localStorage.getItem("editVenue"));
        editDto = {
            id: toEdit.id,
            name: toEdit.name,
            venueManagerIds: toEdit.venueManagers.map(manager => manager.id),
            users: toEdit.venueManagers
        };
    }
    const [venueDto, setVenueDto] = useState(editDto)

    function submitVenue(e) {
        e.preventDefault()
        if (venueDto.name === "") {
            setValidationState(prev => ({
                ...prev, noName: true
            }))
        }
        let call;
        if (isCreating) {
            call = postBase("/admin/venue/create", JSON.stringify({
                name: venueDto.name,
                venueManagerIds: venueDto.venueManagerIds
            }))
            console.log(venueDto.venueManagerIds)
        } else {
            call = postBase("/admin/venue/edit", JSON.stringify({
                name: venueDto.name,
                id: venueDto.id,
                venueManagers: venueDto.users
            }))
        }
        call.then(() => {
            history.push("/admin/venueManagement")
        }).catch((error) => {
            if (error.info.status === 409) {
                toast({
                    message: 'There is already a venue with the name ' + venueDto.name,
                    type: 'is-danger',
                    duration: 5000
                })
            } else {
                toast({
                    message: 'Something went wrong while trying to create your venue',
                    type: 'is-danger'
                })
            }
        })
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
                    className={`panel-block is-clickable ${user.id === venueDto.venueManagerIds ? "has-background-primary" : ""}`}
                    onClick={() => {
                        if (venueDto.users.filter(u => u.id === user.id).length === 0) {
                            setVenueDto(prevState => ({
                                ...prevState,
                                venueManagerIds: [...venueDto.venueManagerIds, user.id],
                                users: [...venueDto.users, user]
                            }))
                        }
                    }}>
            {user.firstname} {user.lastname}
        </div>
    }

    const RenderSelectedUsers = () => {
        if (venueDto.users.length === 0) {
            return <div>
                <p>No VenueManagers Selected</p>
            </div>
        }
        let selectedUsers = new Set(venueDto.users)
        return [...selectedUsers].map(user => {
            if (!venueDto.users.includes(user)) return <div></div>

            return <div key={user.id} className={`panel-block is-clickable`} onClick={() => removeUser(user)}>
                <p>{user.firstname} {user.lastname}</p>
            </div>
        })
    }

    function removeUser(user) {
        setVenueDto({...venueDto, users: venueDto.users.filter(v => v !== user)})
    }

    return <div className="container mt-2">
        <div className="level">
            <div className="level-left"><h2
                className="title is-2 level-item">{isCreating ? 'Create' : 'Edit'} Venue</h2></div>
        </div>
        <form>
            <div className="field">
                <label className="label">Name</label>
                <div className={`control ${validationState.noName ? 'has-icons-right' : ''}`}>
                    <input className={`input ${validationState.noName ? 'is-danger' : ''}`} type="text"
                           placeholder="Name of the venue" value={venueDto.name}
                           onChange={e => {
                               setVenueDto(prevState => ({
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
                    <p className={`help is-danger ${validationState.noName ? '' : 'is-hidden'}`}>A venue must have a
                        name</p>
                </div>
                <div className="panel mt-4">
                    <div className="panel-heading has-text-centered-mobile">
                        <h2 className="title is-5">Select venueManagers</h2>
                    </div>
                    <PagedList fetchDataFnc={fetchUsers} RenderListItem={RenderUsers}
                               IsEmptyComponent={() => <p>No users found</p>}
                               pageControls={{showButtons: true, sizeModifier: "is-small"}}/>
                </div>

                <div className="panel mt-4">
                    <div className="panel-heading has-text-centered-mobile">
                        <h2 className="title is-5">Selected venue managers
                        </h2>
                    </div>
                    <div className="panel-block">
                        <RenderSelectedUsers/>
                    </div>
                    <p className={`help is-danger ${validationState.noUser ? '' : 'is-hidden'}`}>
                        Please select a user to be the venue manager
                    </p>

                </div>
            </div>
            <div className="field is-grouped">
                <div className="control">
                    <button onClick={(e) => submitVenue(e)} className="button is-link"
                            disabled={validationState.noName}>{isCreating ? "Create" : "Update"}
                    </button>
                </div>
                <div className="control">
                    <button onClick={() => history.goBack()} className="button is-link is-light">Cancel</button>
                </div>
            </div>
        </form>
    </div>
        ;

}
export default CreateVenue