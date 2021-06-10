import {render, screen} from '@testing-library/react';
import {act} from "react-dom/test-utils";
import {createMemoryHistory} from "history";
import {Router} from "react-router-dom";
import UserDetails from "../../components/user/UserDetails";
import LoggedInBasedRouting from "../../components/authentication/LoggedInBasedRouting";

const user = {
    "id": "1",
    "userPreferences": {"id": "1", "normalChannel": "EMAIL", "urgentChannel": "SMS"},
    "firstname": "John",
    "lastname": "Doe",
    roles: []
};

function RenderComponent(isLoggedIn, userRoles = []) {
    const history = createMemoryHistory();
    const route = '/user';
    history.push(route);
    if (isLoggedIn) {
        localStorage.setItem("user", JSON.stringify({...user, roles: userRoles}));
        localStorage.setItem("user.id", user.id);
        localStorage.setItem('IsLoggedIn', "true")
    }
    const {container} = render(
        <Router history={history}>
            <LoggedInBasedRouting path="/user" roles={['ADMIN']} component={UserDetails}/>
        </Router>,
    );
    return {container};
}

test('logged in based routing - not logged in', async () => {
    await act(async () => {
        RenderComponent(false);
        expect(screen.queryAllByText(new RegExp(user.firstname + " " + user.lastname)).length).toBe(0)
    })
}, 5000);

test('logged in based routing - unauthorized', async () => {
    await act(async () => {
        RenderComponent(true);
        expect(screen.getByText("Unauthorized")).toBeInTheDocument()
    })
}, 5000);

test('logged in based routing - logged in', async () => {
    await act(async () => {
        RenderComponent(true, ['ADMIN']);
        expect(screen.getByText(new RegExp(user.firstname + " " + user.lastname))).toBeInTheDocument()
    })
}, 5000);
