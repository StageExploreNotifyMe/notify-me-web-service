import {createMemoryHistory} from "history";
import {fireEvent, render, screen} from "@testing-library/react";
import {Router} from "react-router-dom";
import OrganizationLines from "../../components/organization/OrganizationLines";
import {sleep} from "../../js/Sleep";
import {waitForLoadingSpinner} from "../TestUtilities";
import {enableFetchMocks} from "jest-fetch-mock";

enableFetchMocks();
let mockHistoryPush = jest.fn();
let lastFetchUrl = "";
jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useHistory: () => ({
        push: mockHistoryPush,
    }),
}));

const line = {
    "id": "1",
    "line": {
        "id": "1",
        "name": "Main Entrance Bar",
        "description": "The bar at the main entrance of the venue",
        "venueDto": {"id": "1", "name": "Groenplaats"}
    },
    "event": {
        "id": "1",
        "name": "Test",
        "date": [2021, 5, 21, 12, 22],
        "eventStatus": "CREATED",
        "venue": {"id": "1", "name": "Groenplaats"}
    },
    "organization": {"id": "1", "name": "KdG"},
    "assignedUsers": []
};

const organizationLines = {
    "content": [],
    "last": true,
    "totalElements": 1,
    "totalPages": 1,
    "number": 0,
    "size": 20,
    "first": true,
    "numberOfElements": 1,
    "empty": false
};

function mockFetch(simulateNetworkError = false, withLine = true) {
    fetch.enableMocks()
    fetch.resetMocks()
    mockHistoryPush = jest.fn();

    fetch.mockResponse(async request => {
        lastFetchUrl = request.url;
        if (simulateNetworkError) return Promise.reject(new Error("Simulated error"));
        await sleep(10)
        if (request.url.includes("/line/organization/")) {
            let data = {...organizationLines};
            if (withLine) data.content = [line];
            return Promise.resolve(JSON.stringify(data))
        } else {
            return Promise.reject(new Error("Unknown URL"))
        }
    })
}

function renderAssignMembersToLine() {
    const history = createMemoryHistory();
    const route = '/organization/1/memberassignment';
    history.push(route);
    localStorage.setItem("organization.memberassignment.line", JSON.stringify(organizationLines));
    const {container} = render(
        <Router history={history}>
            <OrganizationLines/>
        </Router>,
    );
    expect(screen.getByText(new RegExp('Manage lines'))).toBeInTheDocument()
    return {container};
}

test('OrganizationLines - empty', async () => {
    mockFetch(false, false);
    const {container} = renderAssignMembersToLine();
    await waitForLoadingSpinner(container)
    expect(screen.getByText(new RegExp('No lines assigned to your organization'))).toBeInTheDocument()
}, 5000);

test('OrganizationLines - with network error', async () => {
    mockFetch(true, false);
    renderAssignMembersToLine();
    await sleep(20)
    expect(screen.getByText(new RegExp('Something went wrong'))).toBeInTheDocument()
}, 5000);

test('OrganizationLines - with data', async () => {
    mockFetch();
    const {container} = renderAssignMembersToLine();
    await waitForLoadingSpinner(container)
    expect(screen.getByText(new RegExp('Main Entrance Bar'))).toBeInTheDocument()
    let assignMembersButton = container.querySelector(".is-clickable");
    expect(assignMembersButton).toBeInTheDocument();
    fireEvent.click(assignMembersButton);
    expect(mockHistoryPush).toHaveBeenCalledWith("/organization/" + line.id + "/memberassignment/assign")
}, 5000);