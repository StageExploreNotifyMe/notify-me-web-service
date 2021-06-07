import {render, screen} from '@testing-library/react';

import {Router} from 'react-router-dom';
import {createMemoryHistory} from 'history';
import {enableFetchMocks} from 'jest-fetch-mock'
import {sleep} from "../../js/Sleep";
import OrganizationJoinRequests from "../../components/organization/OrganizationJoinRequests";
import {waitForLoadingSpinner} from "../TestUtilities";
import {act} from "react-dom/test-utils";

enableFetchMocks()

let organization = {id: "1", name: "KdG"};

let userOrg = {
    "id": "2",
    "user": {
        "id": "2",
        "userPreferences": {"id": "2", "normalChannel": "EMAIL", "urgentChannel": "SMS"},
        "firstname": "Jane",
        "lastname": "Doe"
    },
    "organization": organization,
    "role": "MEMBER",
    "status": "PENDING"
};

let joinRequestPage = {
    "content": [],
    "last": true,
    "totalPages": 0,
    "totalElements": 0,
    "number": 0,
    "size": 20,
    "first": true,
    "numberOfElements": 0,
};

function mockFetch(simulateNetworkError = false, noUsers = false) {
    fetch.enableMocks()
    fetch.resetMocks()

    fetch.mockResponse(async request => {
        if (simulateNetworkError) return Promise.reject(new Error("Simulated error"));
        await sleep(10)
        if (request.url.includes("/organization/")) {
            return Promise.resolve(JSON.stringify(organization))
        } else if (request.url.includes("userorganization/requests/")) {
            let content = joinRequestPage;
            if (!noUsers) {
                content = {...joinRequestPage, content: [userOrg]};
            }

            return Promise.resolve(JSON.stringify(content))
        }

        return Promise.reject(new Error("Unknown URL"))
    })
}

function renderMemberManagement() {
    const history = createMemoryHistory();
    const route = '/organization/pendingrequests';
    history.push(route);
    localStorage.setItem("organization", JSON.stringify({"id": "1","name": "KdG"}));
    const {container} = render(
        <Router history={history}>
            <OrganizationJoinRequests/>
        </Router>,
    );
    return container;
}

test('OrganizationJoinRequests - render', async () => {
    await act(async () => {
        mockFetch();
        const container = renderMemberManagement();
        await waitForLoadingSpinner(container)
        await sleep(20)
        expect(screen.getByText(new RegExp("Organization " + organization.name))).toBeInTheDocument()
        expect(screen.getByText(new RegExp(userOrg.user.firstname + " " + userOrg.user.lastname))).toBeInTheDocument()
    })
}, 5000);

test('OrganizationJoinRequests - no requests', async () => {
    await act(async () => {
        mockFetch(false, true);
        const container = renderMemberManagement();
        await waitForLoadingSpinner(container)
        await sleep(20)
        expect(screen.getByText(new RegExp("Organization " + organization.name))).toBeInTheDocument()
        expect(screen.getByText(new RegExp("No pending"))).toBeInTheDocument()
    })
}, 5000);

test('OrganizationJoinRequests - network error', async () => {
    await act(async () => {
        mockFetch(true);
        renderMemberManagement();
        await sleep(20);
        expect(screen.getAllByText(new RegExp("Something went wrong"))[0]).toBeInTheDocument()
    })
}, 5000);
