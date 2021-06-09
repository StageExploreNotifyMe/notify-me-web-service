import {fireEvent, screen} from "@testing-library/react";
import AssignMembersToLine from "../../components/organization/AssignMembersToLine";
import {sleep} from "../../js/Sleep";
import {RenderComponent, waitForLoadingSpinner} from "../TestUtilities";
import {enableFetchMocks} from "jest-fetch-mock";
import {act} from "react-dom/test-utils";

enableFetchMocks();
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

const userpage = {
    "content": [],
    "last": true,
    "totalElements": 2,
    "totalPages": 1,
    "number": 0,
    "size": 20,
    "first": true,
    "numberOfElements": 2,
    "empty": false
};

const user = {
    "id": "1",
    "user": {
        "id": "1",
        "userPreferences": {"id": "1", "normalChannel": "EMAIL", "urgentChannel": "SMS"},
        "firstname": "John",
        "lastname": "Doe"
    },
    "organization": {"id": "1", "name": "KdG"},
    "role": "MEMBER",
    "status": "ACCEPTED"
};

let memberAssigned = false;

function mockFetch(simulateNetworkError = false, withUsers = true) {
    fetch.enableMocks()
    fetch.resetMocks()

    fetch.mockResponse(async request => {
        if (simulateNetworkError) return Promise.resolve(new Error("Simulated error"));
        await sleep(10)
        if (request.url.includes("/assign/member")) {
            memberAssigned = true;
            return Promise.resolve(JSON.stringify(line))
        } else if (request.url.includes("/line/")) {
            let data = {...line}
            if (memberAssigned) {
                data.assignedUsers = [user];
            }
            return Promise.resolve(JSON.stringify(data))
        } else if (request.url.includes("/userorganization/")) {
            let data = {...userpage};
            if (withUsers) {
                data.content = [user];
            }
            return Promise.resolve(JSON.stringify(data))
        } else {
            return Promise.reject(new Error("Unknown URL"))
        }
    })
}

function renderAssignMembersToLine() {
    const route = '/organization/memberassignment/assign';
    localStorage.setItem("organization.memberassignment.line", JSON.stringify(line));
    localStorage.setItem("organization", JSON.stringify({"id": "1", "name": "KdG"}));
    memberAssigned = false;

    const {container} = RenderComponent(AssignMembersToLine, {}, [route]);
    return {container};
}

test('Assign members to line - no users', async () => {
    await act(async () => {
        mockFetch(false, false);
        const {container} = renderAssignMembersToLine();
        expect(screen.getByText(new RegExp('Assign members'))).toBeInTheDocument()
        await waitForLoadingSpinner(container)
        await sleep(20);
        expect(screen.getByText(new RegExp('No users in your organization'))).toBeInTheDocument()
    })
}, 5000);

test('Assign members to line', async () => {
    await act(async () => {
        mockFetch(false, true);
        const {container} = renderAssignMembersToLine();
        expect(screen.getByText(new RegExp('Assign members'))).toBeInTheDocument()
        await waitForLoadingSpinner(container)
        await sleep(20);
        expect(screen.getByText(new RegExp('Main Entrance Bar'))).toBeInTheDocument()
        expect(screen.getByText(new RegExp('John Doe'))).toBeInTheDocument()
        let checkbox = container.querySelector("input");
        await sleep(20)
        expect(checkbox).toBeInTheDocument()
        expect(checkbox).not.toBeChecked()
        fireEvent.click(checkbox);
        await sleep(40);
        checkbox = container.querySelector("input");
        expect(checkbox).toBeChecked()
        fireEvent.click(checkbox);
    })
}, 5000);