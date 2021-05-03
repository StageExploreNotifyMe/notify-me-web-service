import {render, screen, waitForElementToBeRemoved} from '@testing-library/react';

import {Router} from 'react-router-dom';
import {createMemoryHistory} from 'history';
import {enableFetchMocks} from 'jest-fetch-mock'
import {sleep} from "../../js/Sleep";
import OrganizationJoinRequests from "../../components/organization/OrganizationJoinRequests";

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
    const route = '/organization/1/pendingrequests';
    history.push(route);

    const {container} = render(
        <Router history={history}>
            <OrganizationJoinRequests/>
        </Router>,
    );
    return container;
}

async function waitForLoadingSpinner(container) {
    let loadingSpinner = container.querySelector('.loading');
    expect(loadingSpinner).toBeInTheDocument()
    await waitForElementToBeRemoved(loadingSpinner)
    return loadingSpinner;
}

test('OrganizationJoinRequests - render', async () => {
    mockFetch();
    const container = renderMemberManagement();
    await waitForLoadingSpinner(container)
    expect(screen.getByText(new RegExp("Organization " + organization.name))).toBeInTheDocument()

    await waitForLoadingSpinner(container);
    expect(screen.getByText(new RegExp(userOrg.user.firstname + " " + userOrg.user.lastname))).toBeInTheDocument()
}, 5000);

test('OrganizationJoinRequests - no requests', async () => {
    mockFetch(false, true);
    const container = renderMemberManagement();
    await waitForLoadingSpinner(container)
    expect(screen.getByText(new RegExp("Organization " + organization.name))).toBeInTheDocument()

    await waitForLoadingSpinner(container);
    expect(screen.getByText(new RegExp("No pending"))).toBeInTheDocument()
}, 5000);

test('OrganizationJoinRequests - network error', async () => {
    mockFetch(true);
    renderMemberManagement();
    await sleep(20);
    expect(screen.getByText(new RegExp("Something went wrong"))).toBeInTheDocument()
}, 5000);