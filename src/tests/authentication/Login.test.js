import {fireEvent, screen} from '@testing-library/react';
import {act} from "react-dom/test-utils";
import {sleep} from "../../js/Sleep";
import Login from "../../components/authentication/Login";
import {enableFetchMocks} from "jest-fetch-mock";
import {RenderComponent} from "../TestUtilities";

enableFetchMocks();
const mockHistoryPush = jest.fn();
const mockOnSuccess = jest.fn();

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useHistory: () => ({
        push: mockHistoryPush,
    }),
}));

function doRender(props) {
    return RenderComponent(Login, props)
}

function mockFetch(successfulLogin = true, roles= []) {
    fetch.enableMocks()
    fetch.resetMocks()

    fetch.mockResponse(() => {
        if (successfulLogin) return Promise.resolve(JSON.stringify({jwt: "", userDto: {roles: roles, id: ""}}))
        return Promise.resolve();
    })
}

test('Login - email', async () => {
    await act(async () => {
        mockFetch();
        const {container} = doRender();

        let emailInput = container.querySelectorAll("input")[0];
        fireEvent.change(emailInput, {target: {value: "test@user.com"}})
        await sleep(20);
        expect(emailInput.value).toBe("test@user.com")
    })
}, 5000);

test('Login - password', async () => {
    await act(async () => {
        mockFetch(true, ['LINE_MANAGER']);
        const {container} = doRender({onSuccess: mockOnSuccess});

        let passwordInput = container.querySelectorAll("input")[1];
        fireEvent.change(passwordInput, {target: {value: "1234"}})
        await sleep(20);
        expect(passwordInput.value).toBe("1234")
    })
}, 5000);

test('Login - 2fa - 1', async () => {
    await act(async () => {
        mockFetch(true, ['LINE_MANAGER']);
        const {container} = doRender({onSuccess: mockOnSuccess});
        await do2FALogin(container);
        expect(mockHistoryPush).toHaveBeenCalledWith("/venue/select")
        expect(mockOnSuccess).toHaveBeenCalled()
    })
}, 5000);

test('Login - 2fa - 2', async () => {
    await act(async () => {
        mockFetch(true);
        const {container} = doRender();
        await do2FALogin(container);
        expect(mockHistoryPush).toHaveBeenCalledWith("/")
    })
}, 5000);

async function do2FALogin(container) {
    let codeInput = container.querySelectorAll("input")[2];
    fireEvent.change(codeInput, {target: {value: "1234"}})
    await sleep(20);
    expect(codeInput.value).toBe("1234")

    fireEvent.click(container.querySelector("#loginButton"));
    fireEvent.click(container.querySelector("#loginButton"));
    await sleep(20);
}

test('Login - fail', async () => {
    await act(async () => {
        mockFetch(false, ['LINE_MANAGER']);
        const {container} = doRender({onSuccess: mockOnSuccess});

        fireEvent.click(container.querySelector("#loginButton"));
        await sleep(20);
        expect(screen.queryByText(new RegExp("Something went wrong"))).toBeInTheDocument()
    })
}, 5000);

test('Login - showPassword', async () => {
    await act(async () => {
        mockFetch();
        const {container} = doRender();
        let passwordInput = container.querySelectorAll("input")[1];
        expect(passwordInput.type).toBe("password");
        await sleep(5)
        fireEvent.click(container.querySelector("button"));
        await sleep(20);
        expect(passwordInput.type).toBe("text");
    })
}, 5000);



