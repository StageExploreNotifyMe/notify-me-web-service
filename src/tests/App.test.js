import App from '../components/App';
import {BrowserRouter} from "react-router-dom";
import {fireEvent, render, screen} from '@testing-library/react';
import {sleep} from "../js/Sleep";

const mockHistoryPush = jest.fn();

const renderWithRouter = (ui, {route = '/'} = {}, isLoggedIn) => {
    localStorage.setItem("IsLoggedIn", isLoggedIn.toString())
    window.history.pushState({}, 'Test page', route)
    return render(ui, {wrapper: BrowserRouter})
}

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useHistory: () => ({
        push: mockHistoryPush,
    }),
}));

test('Render App Component', () => {
    let route = ""
    renderWithRouter(<App/>, {route}, true)
    expect(screen.getAllByText(/Notify Me/i)[1]).toBeInTheDocument()

    route = "/lqdfjsdksmdks";
    renderWithRouter(<App/>, {route}, true)
    expect(screen.getByText(/404 placeholder/i)).toBeInTheDocument()
}, 5000);

test('Render app not loggedIn', async () => {
    localStorage.setItem("user", JSON.stringify({}));
    const {container} =  renderWithRouter(<App/>, {route:"/"},false)
   let open = container.querySelector(".card-footer-item")
    expect(open).toBeInTheDocument()
    fireEvent.click(open)
    await sleep(50)
    expect(mockHistoryPush).toHaveBeenCalledWith("/login")
}, 5000)
