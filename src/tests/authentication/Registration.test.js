import {fireEvent, screen} from '@testing-library/react';
import Registration from "../../components/authentication/Registration";
import {sleep} from "../../js/Sleep";
import {act} from "react-dom/test-utils";
import {enableFetchMocks} from "jest-fetch-mock";
import {RenderComponent} from "../TestUtilities";

let mockHistoryPush = jest.fn();
let mockHistoryGoBack = jest.fn();

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useHistory: () => ({
        push: mockHistoryPush,
        goBack: mockHistoryGoBack
    }),
}));

enableFetchMocks();

function mockFetch(simulateNetworkError = false) {
    fetch.enableMocks()
    fetch.resetMocks()

    fetch.mockResponse(async () => {
        if (simulateNetworkError) return Promise.resolve(new Error("Simulated error"));
        await sleep(5)
        return Promise.resolve(JSON.stringify({success: true}))
    })
}

let testTimeout = 5000;
let inputTimeout = 5;

function renderComponent() {
    const {container} = RenderComponent(Registration);
    mockFetch();
    let submitButton = container.querySelector(".MuiButtonBase-root");
    expect(submitButton).toBeInTheDocument()
    return {container, submitButton}
}

function getInputFields(container) {
    let elements = {};
    for (let id of ["firstNameInput", "lastNameInput", "emailInput", "phoneInput", "passwordInput", "passwordRepeatInput"]) {
        elements[id] = container.querySelector("#" + id);
    }
    return elements
}

test('Register - toggle PW visibility', async () => {
    await act(async () => {
        const {container} = renderComponent();
        screen.debug()
        let showIcon = container.querySelector(".MuiInputBase-inputAdornedEnd");
        const {passwordInput} = getInputFields(container);
        expect(passwordInput.type).toBe("password")
        fireEvent.click(showIcon);
        await sleep(20);
        expect(passwordInput.type).toBe("text")
    })
}, testTimeout);

test('Register - invalid form', async () => {
    await act(async () => {
        const {submitButton} = renderComponent();
        fireEvent.click(submitButton);
        await sleep(40);
        expect(mockHistoryPush).not.toHaveBeenCalled()
    })
}, testTimeout);

test('Register - field - firstname', async () => {
    await act(async () => {
        const {container} = renderComponent();
        const {firstNameInput} = getInputFields(container);
        let value = "AFirstName"
        fireEvent.change(firstNameInput, {target: {value: value}})
        await sleep(inputTimeout);
        expect(firstNameInput.value).toBe(value)
    })
}, testTimeout);

test('Register - field - lastname', async () => {
    await act(async () => {
        const {container} = renderComponent();
        const {lastNameInput} = getInputFields(container);
        let value = "ALastName"
        fireEvent.change(lastNameInput, {target: {value: value}})
        await sleep(inputTimeout);
        expect(lastNameInput.value).toBe(value)
    })
}, testTimeout);

test('Register - field - emailInput', async () => {
    await act(async () => {
        const {container} = renderComponent();
        const {emailInput} = getInputFields(container);
        let value = "example@email.com"
        fireEvent.change(emailInput, {target: {value: value}})
        await sleep(inputTimeout);
        expect(emailInput.value).toBe(value)
    })
}, testTimeout);

test('Register - field - phoneInput', async () => {
    await act(async () => {
        const {container} = renderComponent();
        const {phoneInput} = getInputFields(container);
        let value = "+3200000000000"
        fireEvent.change(phoneInput, {target: {value: value}})
        await sleep(inputTimeout);
        expect(phoneInput.value).toBe(value)
    })
}, testTimeout);

test('Register - field - passwordInput', async () => {
    await act(async () => {
        const {container} = renderComponent();
        const {passwordInput} = getInputFields(container);
        let value = "password"
        fireEvent.change(passwordInput, {target: {value: value}})
        await sleep(inputTimeout);
        expect(passwordInput.value).toBe(value)
    })
}, testTimeout);

test('Register - field - passwordRepeatInput', async () => {
    await act(async () => {
        const {container} = renderComponent();
        const {passwordRepeatInput} = getInputFields(container);
        let value = "password"
        fireEvent.change(passwordRepeatInput, {target: {value: value}})
        await sleep(inputTimeout);
        expect(passwordRepeatInput.value).toBe(value)
    })
}, testTimeout);

test('Register - valid form', async () => {
    await act(async () => {
        const {container, submitButton} = renderComponent();

        const {
            firstNameInput,
            lastNameInput,
            emailInput,
            phoneInput,
            passwordInput,
            passwordRepeatInput
        } = getInputFields(container);
        firstNameInput.value = "Test";
        expect(firstNameInput.value).toBe("Test")
        lastNameInput.value = "User";
        expect(lastNameInput.value).toBe("User")
        phoneInput.value = "+320000";
        expect(phoneInput.value).toBe("+320000")
        emailInput.value = "test@user.com";
        expect(emailInput.value).toBe("test@user.com")
        passwordInput.value = "1234";
        expect(passwordInput.value).toBe("1234")
        passwordRepeatInput.value = "1234";
        expect(passwordRepeatInput.value).toBe("1234")

        fireEvent.click(submitButton)
        await sleep(inputTimeout)
    })
}, testTimeout);