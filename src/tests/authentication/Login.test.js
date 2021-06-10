import {fireEvent} from '@testing-library/react';
import {act} from "react-dom/test-utils";
import {sleep} from "../../js/Sleep";
import Login from "../../components/authentication/Login";
import {enableFetchMocks} from "jest-fetch-mock";
import {RenderComponent} from "../TestUtilities";

enableFetchMocks();
const mockHistoryPush = jest.fn();

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useHistory: () => ({
        push: mockHistoryPush,
    }),
}));

function doRender() {
    return RenderComponent(Login)
}

function mockFetch(successfulLogin = true) {
    fetch.enableMocks()
    fetch.resetMocks()

    fetch.mockResponse(() => {
        if (successfulLogin) return Promise.resolve(JSON.stringify({jwt: "", userDto: {roles: [], id: ""}}))
        return Promise.resolve();
    })
}

test('Login - 1', async () => {
    await act(async () => {
        mockFetch();
        const {container} = doRender();

        let emailInput = container.querySelectorAll("input")[0];
        fireEvent.change(emailInput, {target: {value: "test@user.com"}})
        await sleep(20);
        expect(emailInput.value).toBe("test@user.com")

        fireEvent.click(container.querySelectorAll("button")[1]);
        await sleep(20);
        expect(mockHistoryPush).toHaveBeenCalledWith("/")
    })
}, 5000);

test('Login - 2', async () => {
    await act(async () => {
        mockFetch();
        const {container} = doRender();

        let passwordInput = container.querySelectorAll("input")[1];
        fireEvent.change(passwordInput, {target: {value: "1234"}})
        await sleep(20);
        expect(passwordInput.value).toBe("1234")

        fireEvent.click(container.querySelectorAll("button")[1]);
        await sleep(20);
        expect(mockHistoryPush).toHaveBeenCalledWith("/")
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



