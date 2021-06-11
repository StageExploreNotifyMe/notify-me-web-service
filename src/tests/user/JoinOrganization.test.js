import {act, screen} from '@testing-library/react';
import JoinOrganization from '../../components/user/JoinOrganization';
import {sleep} from "../../js/Sleep";
import {enableFetchMocks} from "jest-fetch-mock";
import {RenderComponent} from "../TestUtilities";

enableFetchMocks()
let orgs = [{"id": "1", "name": "KdG"}, {"id": "2", "name": "notKdG"}];

let organizations = {
    "content": orgs,
    "last": true,
    "totalElements": 1,
    "totalPages": 1,
    "number": 0,
    "size": 20,
    "first": true,
    "numberOfElements": 1,
    "empty": false
};

let user = {
    "id": "1",
    "userPreferences": {"id": "1", "normalChannel": "EMAIL", "urgentChannel": "SMS"},
    "firstname": "John",
    "lastname": "Doe"
};

let userOrganizations = {
    "userOrganizations": [
        {
            "id": "1",
            "user": user,
            "organization": {"id": "1", "name": "KdG"},
            "role": "ORGANIZATION_LEADER",
            "status": "ACCEPTED"
        },
        {
            "id": "2",
            "user": user,
            "organization": {"id": "2", "name": "notKdG"},
            "role": "MEMBER",
            "status": "PENDING"
        }
    ]
};

function mockFetch(simulateNetworkError = false, noUserOrgs = false, noOrgs = false) {
    fetch.enableMocks()
    fetch.resetMocks()

    fetch.mockResponse(async request => {
        if (simulateNetworkError) return Promise.reject("Simulated error");
        await sleep(5)
        if (request.url.includes("/organization?page=")) {
            if (noOrgs) {
                return Promise.resolve(JSON.stringify({...organizations, content:[]}))
            } else {
                return Promise.resolve(JSON.stringify(organizations))
            }
        } else if (request.url.includes("/userorganization/user/")) {
            if (noUserOrgs) {
                return Promise.resolve(JSON.stringify({userOrganizations: []}))
            } else {
                return Promise.resolve(JSON.stringify(userOrganizations))
            }
        } else {
            return Promise.reject(new Error("Unknown URL"))
        }
    })
}

test('Render join organization', async () => {
    await act(async () => {
        mockFetch();
        RenderComponent(JoinOrganization)
        expect(screen.getByText(/Join Organizations/i)).toBeInTheDocument()
        await sleep(40);
        expect(screen.getByText(/notKdG/i)).toBeInTheDocument()
    })
}, 5000);

test('Render join organization - no requests', async () => {
    await act(async () => {
        mockFetch(false, true);
        RenderComponent(JoinOrganization)
        expect(screen.getByText(/Join Organizations/i)).toBeInTheDocument()
        await sleep(40);
        expect(screen.getByText(/notKdG/i)).toBeInTheDocument()
        expect(screen.getAllByText(/unknown/i)[0]).toBeInTheDocument()
    })
}, 5000);

test('Render join organization - no organizations', async () => {
    await act(async () => {
        mockFetch(false, true, true);
        RenderComponent(JoinOrganization)
        expect(screen.getByText(/Join Organizations/i)).toBeInTheDocument()
        await sleep(40);
        expect(screen.getByText(/No organizations found/i)).toBeInTheDocument()
    })
}, 5000);
