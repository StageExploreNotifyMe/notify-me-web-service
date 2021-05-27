import {fireEvent, render} from '@testing-library/react';
import Registration from "../../components/authentication/Registration";
import {sleep} from "../../js/Sleep";
import {act} from "react-dom/test-utils";
import {enableFetchMocks} from "jest-fetch-mock";

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
function mockFetch(simulateNetworkError = false, withUsers = true) {
    fetch.enableMocks()
    fetch.resetMocks()

    fetch.mockResponse(async () => {
        if (simulateNetworkError) return Promise.resolve(new Error("Simulated error"));
        await sleep(5)
        return Promise.resolve(JSON.stringify({success:true}))
    })
}

let testTimeout = 5000;

function renderComponent() {
    const {container} = render(<Registration/>);
    mockFetch();
    let submitButton = container.querySelector("button.is-link");
    expect(submitButton).toBeInTheDocument()
    return {container, submitButton}
}

test('Register', async () => {
    await act(async () => {
        const {container, submitButton} = renderComponent();

        let showIcon = container.querySelectorAll("span.icon")[6];
        let passwordInput = container.querySelector("#passwordInput");
        expect(passwordInput.type).toBe("password")
        fireEvent.click(showIcon);
        await sleep(20);
        expect(passwordInput.type).toBe("text")

        fireEvent.click(submitButton)
        expect(mockHistoryPush).not.toHaveBeenCalled()

        let inputs = container.querySelectorAll("input").length;
        for (let i = 0; i < inputs; i++) {
            let input = container.querySelectorAll("input")[i];
            fireEvent.change(input, {target: {value: "AFirstName"}})
            await sleep(5);
            //expect(input.value).toBe("AFirstName")
        }

        fireEvent.click(submitButton)
        await sleep(40);
        expect(mockHistoryPush).toHaveBeenCalled()
    })
}, testTimeout);