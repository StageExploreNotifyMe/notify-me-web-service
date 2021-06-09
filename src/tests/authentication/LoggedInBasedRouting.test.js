import {screen} from '@testing-library/react';
import {act} from "react-dom/test-utils";
import {createMemoryHistory} from "history";
import UserDetails from "../../components/user/UserDetails";
import LoggedInBasedRouting from "../../components/authentication/LoggedInBasedRouting";
import {RenderComponent} from "../TestUtilities";

const user = {
    "id": "1",
    "userPreferences": {"id": "1", "normalChannel": "EMAIL", "urgentChannel": "SMS"},
    "firstname": "John",
    "lastname": "Doe",
    roles: []
};

function doRender(isLoggedIn, userRoles = []) {
    const history = createMemoryHistory();
    const route = '/user';
    history.push(route);
    if (isLoggedIn) {
        localStorage.setItem("user", JSON.stringify({...user, roles: userRoles}));
        localStorage.setItem("user.id", user.id);
        localStorage.setItem('IsLoggedIn', "true")
    }
    const {container} = RenderComponent(LoggedInBasedRouting, {path: "/user", roles: ['ADMIN'], component: UserDetails}, [route])
    return container;
}

test('logged in based routing - not logged in', async () => {
    await act(async () => {
        doRender(false);
        expect(screen.queryAllByText(new RegExp(user.firstname + " " + user.lastname)).length).toBe(0)
    })
}, 5000);

test('logged in based routing - unauthorized', async () => {
    await act(async () => {
        doRender(true);
        expect(screen.getByText("403 Access denied")).toBeInTheDocument()
    })
}, 5000);

test('logged in based routing - logged in', async () => {
    await act(async () => {
        doRender(true, ['ADMIN']);
        expect(screen.getByText(new RegExp(user.firstname + " " + user.lastname))).toBeInTheDocument()
    })
}, 5000);
