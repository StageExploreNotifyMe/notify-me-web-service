import {enableFetchMocks} from "jest-fetch-mock";
import {sleep} from "../../js/Sleep";
import {RenderComponent} from "../TestUtilities";
import Registration from "../../components/authentication/Registration";
import ConfirmRegistration from "../../components/authentication/ConfirmRegistration";
import {act} from "react-dom/test-utils";
import {fireEvent, screen} from "@testing-library/react";

let mockHistoryPush = jest.fn();

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useHistory: () => ({
        push: mockHistoryPush,
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

function renderComponent() {
    const {container} = RenderComponent(ConfirmRegistration);
    mockFetch();
    let submitButton = container.querySelector(".MuiButtonBase-root");
    expect(submitButton).toBeInTheDocument()
    return {container, submitButton}
}

function getInputFields(container) {
    let elements = {};
    for (let id of ["emailCode", "smsCode"]) {
        elements[id] = container.querySelector("#" + id);
    }
    return elements
}

test('Register - invalid form', async () => {
    await act(async () => {
        const {submitButton} = renderComponent();
        fireEvent.click(submitButton);
        await sleep(40);
        expect(mockHistoryPush).not.toHaveBeenCalled()
    })
}, 5000);

test('Register - valid form', async () => {
    await act(async () => {
        const {container} = renderComponent();
        const {submitButton} = renderComponent();
        const {emailCode} = getInputFields(container);
        fireEvent.change(emailCode, {target: {value: "5555"}})
        const {smsCode} = getInputFields(container);
        fireEvent.change(smsCode, {target: {value: "5555"}})
        await sleep(20)
        fireEvent.click(submitButton);
        await sleep(40);
            })
}, 5000);