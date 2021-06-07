import {fireEvent, render, screen} from '@testing-library/react';
import {enableFetchMocks} from 'jest-fetch-mock'
import {act} from "react-dom/test-utils";
import PickOrganization from "../../components/organization/PickOrganization";
import {sleep} from "../../js/Sleep";
import {waitForLoadingSpinner} from "../TestUtilities";

enableFetchMocks()

let organization = {id: "1", name: "KdG"};
let user = {
    "id": "1",
    "userPreferences": {"id": "1", "normalChannel": "EMAIL", "urgentChannel": "SMS"},
    "firstname": "John",
    "lastname": "Doe",
    "roles": ["MEMBER", "ADMIN", "LINE_MANAGER", "VENUE_MANAGER"]
};
let userOrg = {
    "userOrganizations": [{
        "id": "1",
        "user": user,
        "organization": organization,
        "role": "MEMBER",
        "status": "ACCEPTED"
    }]
};

function mockFetch(simulateNetworkError = false) {
    fetch.enableMocks()
    fetch.resetMocks()

    fetch.mockResponse(async () => {
        if (simulateNetworkError) return Promise.resolve(new Error("Simulated error"));
        await sleep(10)
        return Promise.resolve(JSON.stringify(userOrg))
    })
}

const mockHistoryPush = jest.fn();
const mockHistoryReplace = jest.fn();
jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useHistory: () => ({
        push: mockHistoryPush,
        replace: mockHistoryReplace
    }),
}));

function renderOrganizationDetails(withOrg = false) {
    localStorage.setItem("user", JSON.stringify({
        firstname: "Test",
        lastname: "Test",
        id: "1",
        roles: ["VENUE_MANAGER", "MEMBER", "ORGANIZATION_LEADER", "LINE_MANAGER", "ADMIN"],
        userPreferences: {id: "3", normalChannel: "EMAIL", urgentChannel: "SMS"}
    }));
    if (withOrg) localStorage.setItem("organization", JSON.stringify({"id": "1", "name": "KdG"}));
    const {container} = render(<PickOrganization/>);
    return {container};
}

test('Pick Organization - Render', async () => {
    await act(async () => {
        mockFetch();
        const {container} = renderOrganizationDetails();
        await waitForLoadingSpinner(container)
        expect(screen.getByText(new RegExp(organization.name))).toBeInTheDocument()
        let button = screen.getByText("Details");
        expect(button).toBeInTheDocument();
        fireEvent.click(button);
        await sleep(20);
        expect(mockHistoryPush).toHaveBeenCalledWith("/organization")
    })
}, 5000);

test('Pick Organization - Render already picked', async () => {
    await act(async () => {
        mockFetch();
        renderOrganizationDetails(true);
        expect(mockHistoryReplace).toHaveBeenCalledWith("/organization")
    })
}, 5000);


