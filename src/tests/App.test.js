import App from '../components/App';
import {fireEvent, screen} from '@testing-library/react';
import {sleep} from "../js/Sleep";
import {RenderComponent} from "./TestUtilities";

const mockHistoryPush = jest.fn();

const renderWithRouter = ({route = '/'} = {}, isLoggedIn) => {
    localStorage.setItem("IsLoggedIn", isLoggedIn.toString())
    return RenderComponent(App, {}, [route])
}

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useHistory: () => ({
        push: mockHistoryPush,
    }),
}));

test('Render App Component', () => {
    let route = ""
    renderWithRouter({route}, true)
    expect(screen.getAllByText(/Notify Me/i)[0]).toBeInTheDocument()
}, 5000);

test('Render app not loggedIn', async () => {
    localStorage.setItem("user", JSON.stringify({}));
    const {container} = renderWithRouter({route: "/"}, false)
    let open = screen.getAllByText(/Open/i)[0]
    expect(open).toBeInTheDocument()
    fireEvent.click(open)
    await sleep(50)
    expect(mockHistoryPush).toHaveBeenCalledWith("/login")
}, 5000)
