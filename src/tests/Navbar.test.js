import {fireEvent, render, screen} from '@testing-library/react';
import {act} from "react-dom/test-utils";
import Navbar from "../components/Navbar";

const mockHistoryPush = jest.fn();

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useHistory: () => ({
        push: mockHistoryPush,
    }),
}));

function RenderComponent(isLoggedIn = false) {
    localStorage.setItem("IsLoggedIn", isLoggedIn.toString())
    const {container} = render(<Navbar/>);
    return {container};
}

test('Navbar - navigate home', () => {
    act(() => {
        RenderComponent();
        fireEvent.click(screen.queryByText(/Notify Me/i));
        expect(mockHistoryPush).toHaveBeenCalledWith("/")
    })
}, 5000);

test('Navbar - navigate sign up', () => {
    act(() => {
        RenderComponent();
        fireEvent.click(screen.queryByText(/Sign up/i));
        expect(mockHistoryPush).toHaveBeenCalledWith("/register")
    })
}, 5000);

test('Navbar - login', async () => {
    await act(async () => {
        RenderComponent();
        fireEvent.click(screen.queryByText(/Log In/i));
        expect(mockHistoryPush).toHaveBeenCalledWith("/login")
    })
}, 5000);

test('Navbar - logout', async () => {
    await act(async () => {
        RenderComponent(true);
        fireEvent.click(screen.queryByText(/Log out/i));
        expect(mockHistoryPush).toHaveBeenCalledWith("/logout")
    })
}, 5000);

