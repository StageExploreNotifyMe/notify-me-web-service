import {act, fireEvent, screen, waitForElementToBeRemoved} from '@testing-library/react';
import {enableFetchMocks} from "jest-fetch-mock";
import {sleep} from "../../../js/Sleep";
import AdminOrganizationManagement from "../../../components/admin/organization/AdminOrganizationManagement";
import {RenderComponent} from "../../TestUtilities";

enableFetchMocks()

test('Render Admin Org management', async () => {
    await act(async () => {
        mockFetch({...orgPage, content: [org]});
        const {createButton} = await renderAdminOrgMngmt();
        expect(screen.getByText(new RegExp(org.name))).toBeInTheDocument();
        fireEvent.click(createButton)
        expect(mockHistoryPush).toHaveBeenCalledWith('/admin/organizationManagement/create');
    })
}, 5000);

test('Render Admin Org management - close modal - 1', async () => {
    await act(async () => {
        mockFetch({...orgPage, content: [org]});
        const {container} = await renderAdminOrgMngmt();
        let editIcon = container.querySelector(".is-clickable");
        expect(editIcon).toBeInTheDocument();
        await openModal(editIcon, container);
        await closeModal(container, ".modal-background");
    })
}, 5000);

test('Render Admin Org management - close modal - 2', async () => {
    await act(async () => {
        mockFetch({...orgPage, content: [org]});
        const {container} = await renderAdminOrgMngmt();
        let editIcon = container.querySelector(".is-clickable");
        expect(editIcon).toBeInTheDocument();
        await openModal(editIcon, container);
        await closeModal(container, ".modal-close");
    })
}, 5000);

test('Render Admin Org management - close modal - 3', async () => {
    await act(async () => {
        mockFetch({...orgPage, content: [org]});
        const {container} = await renderAdminOrgMngmt();
        let editIcon = container.querySelector(".is-clickable");
        expect(editIcon).toBeInTheDocument();
        await openModal(editIcon, container);
        await closeModal(container, ".is-danger");
    })
}, 5000);

test('Render Admin Org management - edit', async () => {
    await act(async () => {
        mockFetch({...orgPage, content: [org]});
        const {container} = await renderAdminOrgMngmt();
        let editIcon = container.querySelector(".is-clickable");
        expect(editIcon).toBeInTheDocument();
        await openModal(editIcon, container);
        let changeNameField = container.querySelector("input");
        await typeInInput(changeNameField, "This is a test");
        let submitButton = container.querySelector(".is-success");
        fireEvent.click(submitButton);
        await sleep(20);
        expect(screen.getByText(/Something went wrong while trying to update this organization/i)).toBeInTheDocument();
    })
}, 5000);

test('Render Admin Org management - no events', async () => {
    await act(async () => {
        mockFetch({...orgPage, content: []});
        await renderAdminOrgMngmt();
        expect(screen.getByText(/No organizations/i)).toBeInTheDocument();
        let createSpan = screen.getByText(/here/i);
        expect(createSpan).toBeInTheDocument()
        fireEvent.click(createSpan)
        expect(mockHistoryPush).toHaveBeenCalledWith('/admin/organizationManagement/create');
    })
}, 5000);

test('Render Admin Org management - network error', async () => {
    await act(async () => {
        mockFetch(orgPage, true);
        await renderAdminOrgMngmt(false);
        await sleep(50)
        expect(screen.getByText(/Something went wrong while trying to fetch/i)).toBeInTheDocument();
    })
}, 5000);

let org = {name: "testOrg", id: "1"}
let orgPage = {
    content: [],
    last: true,
    totalPages: 1,
    totalElements: 0,
    number: 0,
    size: 20,
    first: true,
    numberOfElements: 0
};

function mockFetch(data = orgPage, simulateNetworkError = false) {
    fetch.enableMocks()
    fetch.resetMocks()
    let response = JSON.stringify(data)
    let status = {status: 200};
    if (simulateNetworkError) {
        response = "qsdklfj{ùq{mokj}{}";
        status = {status: 500}
    }
    fetch.mockResponses([response, status])
}

const mockHistoryPush = jest.fn();
jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useHistory: () => ({
        push: mockHistoryPush,
    }),
}));

async function renderAdminOrgMngmt(waitForRemoved = true) {
    const {container} = RenderComponent(AdminOrganizationManagement);
    let spinner = container.querySelector(".loading");
    expect(spinner).toBeInTheDocument()
    if (waitForRemoved) await waitForElementToBeRemoved(spinner)
    expect(screen.getByText(/Organization Management/i)).toBeInTheDocument();
    const createButton = screen.getByText(/Create Organization/i);
    expect(createButton).toBeInTheDocument();
    return {createButton, spinner, container};
}

async function openModal(icon, container) {
    fireEvent.click(icon);
    await sleep(20);

    let modal = container.querySelector(".is-active");
    expect(modal).toBeInTheDocument();
}

async function closeModal(container, className) {
    fireEvent.click(container.querySelector(className))
    await sleep(20);
    expect(container.querySelectorAll(".is-active").length).toBe(0);
}


async function typeInInput(inputElement, toType = "") {
    fireEvent.change(inputElement, {target: {value: toType}})
    await sleep(40);
    expect(inputElement.value).toBe(toType)
}
