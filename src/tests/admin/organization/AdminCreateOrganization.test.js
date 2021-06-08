import {act, fireEvent, screen} from '@testing-library/react';
import AdminCreateOrganization from "../../../components/admin/organization/AdminCreateOrganization";
import {sleep} from "../../../js/Sleep";
import {enableFetchMocks} from "jest-fetch-mock";
import {RenderComponent} from "../../TestUtilities";

enableFetchMocks()

let mockHistoryPush = jest.fn();
let mockHistoryGoBack = jest.fn();

let page = {
    content: [],
    last: true,
    totalPages: 1,
    totalElements: 0,
    number: 0,
    size: 20,
    first: true,
    numberOfElements: 0
};

let user = {
    firstname: "John",
    lastname: "Doe",
    id: "1"
};

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useHistory: () => ({
        push: mockHistoryPush,
        goBack: mockHistoryGoBack
    }),
}));

function renderComponent(fetchData = page, simulateNetworkError = false) {
    mockFetch(fetchData, simulateNetworkError);
    localStorage.setItem("venue", JSON.stringify({name: "TestVenue", id: "1"}));
    const {container} = RenderComponent(AdminCreateOrganization);
    let submitButton = screen.queryByText(/Submit/i);
    expect(submitButton).toBeInTheDocument()
    let cancelButton = screen.queryByText(/Cancel/i);
    expect(cancelButton).toBeInTheDocument()
    return {container, submitButton, cancelButton}
}

async function typeInInput(inputElement, toType = "") {
    fireEvent.change(inputElement, {target: {value: toType}})
    await sleep(40);
    expect(inputElement.value).toBe(toType)
}

function getNameInput(container) {
    let nameInput = container.querySelectorAll("input")[0];
    expect(nameInput).not.toBeNull()
    expect(nameInput).toBeInTheDocument()
    return nameInput;
}

function mockFetch(data, simulateNetworkError) {
    fetch.enableMocks()
    fetch.resetMocks()
    fetch.mockResponse(async request => {
        if (simulateNetworkError) return Promise.reject("Simulated error");
        await sleep(5)
        if (request.url.includes("/user?page=")) {
            return Promise.resolve(JSON.stringify(data))
        } else {
            return Promise.reject(new Error("Unknown URL"))
        }
    })
}

test('Create Organization - go back', async () => {
    await act(async () => {
        const {cancelButton} = renderComponent();
        fireEvent.click(cancelButton)
        expect(mockHistoryGoBack).toHaveBeenCalled();
    })
}, 5000);

test('Create Organization - name input - empty', async () => {
    await act(async () => {
        const {container, submitButton} = renderComponent();
        let nameInput = getNameInput(container)
        expect(nameInput.value).toBe("")
        fireEvent.click(submitButton)
        expect(mockHistoryPush).not.toHaveBeenCalled()
        await sleep(40);
        expect(screen.queryByText(/An organization must have a name/i)).toBeInTheDocument()
    })
}, 5000);

test('Create Organization - fetch error', async () => {
    await act(async () => {
        renderComponent(page, true);
        await sleep(20)
        expect(screen.queryByText(/Something went wrong/i)).toBeInTheDocument()
    })
}, 5000);

test('Create submitButton - name input - type - no user', async () => {
    await act(async () => {
        const {container, submitButton} = renderComponent();
        let nameInput = getNameInput(container);
        expect(nameInput.value).toBe("")
        await typeInInput(nameInput, "test")
        fireEvent.click(submitButton)
        expect(mockHistoryPush).not.toHaveBeenCalled()
        await sleep(40);
        expect(screen.queryByText(/Please select a user to be the organization leader/i)).toBeInTheDocument()
    })
}, 5000);

test('Create submitButton - name input - type - with user', async () => {
    await act(async () => {
        let data = {...page, content: [user]};
        const {container} = renderComponent(data);
        let nameInput = getNameInput(container);
        expect(nameInput.value).toBe("")
        await typeInInput(nameInput, "test")
        let userDiv = screen.queryByText(new RegExp(user.firstname + " " + user.lastname));
        expect(userDiv).toBeInTheDocument();
        fireEvent.click(userDiv);
        await sleep(20);
        expect(screen.queryByText(new RegExp("Select the organization leader: " + user.firstname))).toBeInTheDocument()
    })
}, 5000);
