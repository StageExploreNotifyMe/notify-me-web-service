import {fireEvent, render} from '@testing-library/react';
import {act} from "react-dom/test-utils";
import {sleep} from "../../js/Sleep";
import Login from "../../components/authentication/Login";
import {enableFetchMocks} from "jest-fetch-mock";

enableFetchMocks();
const mockHistoryPush = jest.fn();
const mockCloseModal = jest.fn();

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useHistory: () => ({
        push: mockHistoryPush,
    }),
}));

function RenderComponent(hasCloseModalFunction) {
    if (hasCloseModalFunction) {
        return render(<Login closeModal={mockCloseModal}/>);
    } else {
        return render(<Login/>);
    }
}

function mockFetch(successfulLogin = true) {
    fetch.enableMocks()
    fetch.resetMocks()

    fetch.mockResponse(() => {
        if (successfulLogin) return Promise.resolve(JSON.stringify({jwt: "", userDto: {}}))
        return Promise.resolve();
    })
}

test('Login - 1', async () => {
    await act(async () => {
        mockFetch();
        const {container} = RenderComponent(false);

        let emailInput = container.querySelectorAll("input")[0];
        fireEvent.change(emailInput, {target: {value: "test@user.com"}})
        await sleep(20);
        expect(emailInput.value).toBe("test@user.com")

        let button = container.querySelector("button");
        fireEvent.click(button);
        await sleep(20);
        expect(mockHistoryPush).toHaveBeenCalledWith("/")
        expect(mockCloseModal).not.toHaveBeenCalled()
    })
}, 5000);

test('Login - 2', async () => {
    await act(async () => {
        mockFetch();
        const {container} = RenderComponent(true);

        let passwordInput = container.querySelectorAll("input")[1];
        fireEvent.change(passwordInput, {target: {value: "1234"}})
        await sleep(20);
        expect(passwordInput.value).toBe("1234")


        let button = container.querySelector("button");
        fireEvent.click(button);
        await sleep(20);
        expect(mockHistoryPush).toHaveBeenCalledWith("/")
        expect(mockCloseModal).toHaveBeenCalled()
    })
}, 5000);

test('Login - showPassword', async () => {
    await act(async () => {
        mockFetch();
        const {container} = RenderComponent(true);
        let passwordInput = container.querySelectorAll("input")[1];
        expect(passwordInput.type).toBe("password");
        await sleep(5)
        fireEvent.click(container.querySelector(".is-clickable"));
        await sleep(20);
        expect(passwordInput.type).toBe("text");
    })
}, 5000);



