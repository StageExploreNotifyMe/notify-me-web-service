import {act, fireEvent, render, screen, waitForElementToBeRemoved} from '@testing-library/react';
import {enableFetchMocks} from "jest-fetch-mock";
import {sleep} from "../../../js/Sleep";
import AdminOrganizationManagement from "../../../components/admin/organization/AdminOrganizationManagement";

enableFetchMocks()

test('Render Admin Org management', async () => {
    await act(async () => {
        mockFetch({...orgPage, content: [org]});
        const {container, createButton} = await renderAdminOrgMngmt();
        expect(screen.getByText(new RegExp(org.name))).toBeInTheDocument();
        let icon = container.querySelector(".is-clickable");
        expect(icon).toBeInTheDocument();
        fireEvent.click(icon);
        expect(mockHistoryPush).toHaveBeenCalledWith('/admin/organizationManagement/1/edit');

        fireEvent.click(createButton)
        expect(mockHistoryPush).toHaveBeenCalledWith('/admin/organizationManagement/create');
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
        expect(screen.getByText(/Something went wrong/i)).toBeInTheDocument();
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
    const {container} = render(<AdminOrganizationManagement/>);
    let spinner = container.querySelector(".loading");
    expect(spinner).toBeInTheDocument()
    if (waitForRemoved) await waitForElementToBeRemoved(spinner)
    expect(screen.getByText(/Organization Management/i)).toBeInTheDocument();
    const createButton = screen.getByText(/Create Organization/i);
    expect(createButton).toBeInTheDocument();
    return {createButton, spinner, container};
}
