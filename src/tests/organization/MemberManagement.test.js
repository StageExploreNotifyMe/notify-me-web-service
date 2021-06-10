import {fireEvent, render, screen} from '@testing-library/react';

import {Router} from 'react-router-dom';
import {createMemoryHistory} from 'history';
import {enableFetchMocks} from 'jest-fetch-mock'
import MemberManagement from "../../components/organization/MemberManagement";
import {sleep} from "../../js/Sleep";
import {waitForLoadingSpinner} from "../TestUtilities";
import {act} from "react-dom/test-utils";

enableFetchMocks()

let organization = {id: "1", name: "KdG"};
let organizationLeader = {
    "id": "1",
    "user": {
        "id": "1",
        "userPreferences": {"id": "1", "normalChannel": "EMAIL", "urgentChannel": "SMS"},
        "firstname": "John",
        "lastname": "Doe"
    },
    "organization": organization,
    "role": "ORGANIZATION_LEADER",
    "status": "ACCEPTED"
};
let member = {
    "id": "2",
    "user": {
        "id": "2",
        "userPreferences": {"id": "2", "normalChannel": "EMAIL", "urgentChannel": "SMS"},
        "firstname": "Jane",
        "lastname": "Doe"
    },
    "organization": organization,
    "role": "MEMBER",
    "status": "ACCEPTED"
};

let userPage = {
    "content": [],
    "last": true,
    "totalPages": 1,
    "totalElements": 0,
    "number": 0,
    "size": 20,
    "first": true,
    "numberOfElements": 0
};

function mockFetch(simulateNetworkError = false, noUsers = false) {
    fetch.enableMocks()
    fetch.resetMocks()

    fetch.mockResponse(async request => {
        if (simulateNetworkError) return Promise.reject(new Error("Simulated error"));
        await sleep(10)
        if (request.url.includes("/organization/")) {
            return Promise.resolve(JSON.stringify(organization))
        } else if (request.url.includes("/users")) {
            let content = userPage;
            if (!noUsers) {
                content = {...userPage, content: [organizationLeader, member]};
            }
            return Promise.resolve(JSON.stringify(content));
        } else if (request.url.includes("promote")) {
            return Promise.resolve(JSON.stringify({ok: true}))
        } else if (request.url.includes("demote")) {
            return Promise.resolve(JSON.stringify({ok: true}))
        } else {
            return Promise.reject(new Error("Unknown URL"))
        }
    })
}

function renderMemberManagement() {
    const history = createMemoryHistory();
    const route = '/organization/membermanagement';
    history.push(route);
    localStorage.setItem("organization", JSON.stringify({"id": "1","name": "KdG"}));
    const {container} = render(
        <Router history={history}>
            <MemberManagement/>
        </Router>,
    );
    return container;
}

test('MemberManagement', async () => {
    await act(async () => {
        mockFetch();
        const container = renderMemberManagement();

        await waitForLoadingSpinner(container);
        await sleep(20);
        expect(screen.getByText(new RegExp("Organization " + organization.name))).toBeInTheDocument()

        let promoteButton = screen.getByText(/Promote/i);
        expect(promoteButton).toBeInTheDocument()
        fireEvent.click(promoteButton);
        await sleep(20);
        expect(promoteButton).not.toBeInTheDocument();

        await waitForLoadingSpinner(container);

        let demoteButton = screen.getByText(/Demote/i);
        expect(demoteButton).toBeInTheDocument();
        fireEvent.click(demoteButton);
        await sleep(20);
        expect(demoteButton).not.toBeInTheDocument();
        await waitForLoadingSpinner(container);
    })
}, 5000);

test('MemberManagement - loading failed', async () => {
    await act(async () => {
        mockFetch(true);
        renderMemberManagement();
        await sleep(20);
        expect(screen.getAllByText(new RegExp('Something went wrong'))[0]).toBeInTheDocument()
    })
}, 5000);

test('MemberManagement - No users', async () => {
    await act(async () => {
        mockFetch(false, true);
        renderMemberManagement();
        await sleep(30);
        expect(screen.getByText(new RegExp('No users'))).toBeInTheDocument()
    })
}, 5000);
