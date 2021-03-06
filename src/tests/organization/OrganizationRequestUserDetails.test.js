import {fireEvent, screen} from '@testing-library/react';
import OrganizationRequestUserDetail from "../../components/organization/OrganizationRequestUserDetail";

import {enableFetchMocks} from 'jest-fetch-mock'
import {act} from "react-dom/test-utils";
import {RenderComponent} from "../TestUtilities";

enableFetchMocks()
fetch.enableMocks();

let request = {
    id: "1",
    role: "MEMBER",
    status: "PENDING",
    organization: {
        id: "1",
        name: "KdG"
    },
    user: {
        firstname: "test",
        id: "1",
        inbox: [],
        lastname: "user",
        userPreferences:
            {
                id: "1",
                normalChannel: "EMAIL",
                urgentChannel: "SMS"
            }
    }
}

function mockFetch(simulateNetworkError = false) {
    fetch.resetMocks();

    if (simulateNetworkError) {
        fetch.mockResponses(["qsdfaezmokj}{}", {status: 500}])
    } else {
        let json = JSON.stringify(request)
        fetch.mockResponses([json, {status: 200}])
    }
}

function renderOrganizationRequestUserDetail() {
    localStorage.setItem("organization", JSON.stringify({"id": "1", "name": "KdG"}));
    const {container} = RenderComponent(OrganizationRequestUserDetail, {request: request});
    expect(screen.getByText(new RegExp(request.user.firstname + " " + request.user.lastname))).toBeInTheDocument()
    let acceptButton = screen.queryByText(/Accept/i);
    expect(acceptButton).toBeInTheDocument()
    let rejectButton = screen.queryByText(/Reject/i);
    expect(rejectButton).toBeInTheDocument()

    return {container, acceptButton, rejectButton};
}

test('OrganizationRequestUserDetail - accept', async () => {
    await act(async () => {
        mockFetch();
        const {acceptButton} = renderOrganizationRequestUserDetail();
        fireEvent.click(acceptButton)
    })
}, 5000);

test('OrganizationRequestUserDetail - decline', async () => {
    await act(async () => {
        mockFetch();
        const {rejectButton} = renderOrganizationRequestUserDetail();
        fireEvent.click(rejectButton)
    })
}, 5000);

test('OrganizationRequestUserDetail - accept - fail', async () => {
    await act(async () => {
        mockFetch(true);
        const {acceptButton} = renderOrganizationRequestUserDetail();
        fireEvent.click(acceptButton)
        setTimeout(() => {
            expect(screen.getByText(new RegExp("Something went wrong"))).toBeInTheDocument()
        }, 50);
    })
}, 5000);



