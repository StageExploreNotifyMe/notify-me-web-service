import {fireEvent, screen} from '@testing-library/react';
import OrganizationDetails from "../../components/organization/OrganizationDetails";
import {enableFetchMocks} from 'jest-fetch-mock'
import {act} from "react-dom/test-utils";
import {sleep} from "../../js/Sleep";
import {RenderComponent} from "../TestUtilities";

enableFetchMocks()

let organization = {id: "1", name: "KdG"};

function mockFetch(simulateNetworkError = false) {
    fetch.enableMocks()
    fetch.resetMocks()
    let response = JSON.stringify(organization)
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
        push: mockHistoryPush
    }),
}));

function renderOrganizationDetails() {
    localStorage.setItem("user", JSON.stringify({
        firstname: "Test",
        lastname: "Test",
        id: "1",
        roles: ["VENUE_MANAGER", "MEMBER", "ORGANIZATION_LEADER", "LINE_MANAGER", "ADMIN"],
        userPreferences: {id: "3", normalChannel: "EMAIL", urgentChannel: "SMS"}
    }));
    const route = '/organization';
    localStorage.setItem("organization", JSON.stringify({"id": "1", "name": "KdG"}));
    const {container} = RenderComponent(OrganizationDetails, {}, [route]);
    return container;
}

test('OrganizationDetails - Render', async () => {
    await act(async () => {
        mockFetch();
        const container = renderOrganizationDetails();
        expect(screen.getByText(new RegExp("Organization " + organization.name))).toBeInTheDocument()

        let navButton = container.querySelector("button");
        expect(navButton).toBeInTheDocument();
        fireEvent.click(navButton);
        await sleep(20);
        expect(mockHistoryPush).toHaveBeenCalledWith("/organizations")

        let changeButton = (screen.getByText(new RegExp("Change Organization")));
        expect(changeButton).toBeInTheDocument();
        fireEvent.click(changeButton);
        await sleep(20);
        expect(mockHistoryPush).toHaveBeenCalledWith("/organizations")
    })
}, 5000);


