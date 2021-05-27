import {fireEvent, render, screen} from '@testing-library/react';
import {act} from "react-dom/test-utils";
import Navbar from "../components/Navbar";
import {sleep} from "../js/Sleep";

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

async function openModal(container, buttonText, querySelector) {
    fireEvent.click(screen.queryByText(new RegExp(buttonText)));
    await sleep(20);
    let element = container.querySelector(querySelector);
    expect(element).toBeInTheDocument()
    return element;
}

async function closeModal(modalCloseButton) {
    fireEvent.click(modalCloseButton);
    await sleep(20);
    expect(modalCloseButton).not.toBeInTheDocument()
}

test('Navbar - login', async () => {
    await act(async () => {
        const {container} = RenderComponent();
        let modalBackground = await openModal(container, "Log in", ".modal-background");
        await closeModal(modalBackground);

        let modalCloseButton = await openModal(container, "Log in", ".modal-close");
        await closeModal(modalCloseButton);
    })
}, 5000);

test('Navbar - logout - 1', async () => {
    await act(async () => {
        const {container} = RenderComponent(true);
        let modalBackground = await openModal(container, "Log out", ".modal-background");
        await closeModal(modalBackground);
    })
}, 5000);

test('Navbar - logout - 2', async () => {
    await act(async () => {
        const {container} = RenderComponent(true);

        let modalCloseButton = await openModal(container, "Log out", ".modal-close");
        await closeModal(modalCloseButton);
    })
}, 5000);

