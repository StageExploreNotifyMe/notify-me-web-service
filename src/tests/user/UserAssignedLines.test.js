import {fireEvent, screen} from '@testing-library/react';
import UserAssignedLines from "../../components/user/UserAssignedLines";
import {sleep} from "../../js/Sleep";
import {enableFetchMocks} from "jest-fetch-mock";
import {RenderComponent, waitForLoadingSpinner} from "../TestUtilities";
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
        "date": [2090, 5, 5, 9, 53],
        "eventStatus": "CREATED",
        "venue": {"id": "1", "name": "Groenplaats"}
    },
    "organization": {"id": "1", "name": "KdG"},
    "assignedUsers": [{
        "id": "1",
        "userPreferences": {"id": "1", "normalChannel": "EMAIL", "urgentChannel": "SMS"},
        "firstname": "John",
        "lastname": "Doe"
    }]
};

const linesPage = {
    "content": [],
    "last": true,
    "totalPages": 1,
    "totalElements": 1,
    "number": 0,
    "size": 20,
    "first": true,
    "numberOfElements": 1,
    "empty": false
};

let hasCanceled = false;

function mockFetch(simulateNetworkError = false, isAssigned = true) {
    fetch.enableMocks()
    fetch.resetMocks()

    fetch.mockResponse(async request => {
        if (simulateNetworkError) return Promise.resolve(new Error("Simulated error"));
        await sleep(10)
        if (request.url.includes("/cancel/member")) {
            hasCanceled = true;
            return Promise.resolve(JSON.stringify(linesPage))
        } else if (request.url.includes("/user/")) {
            let data = {...linesPage};
            if (isAssigned && !hasCanceled) {
                data.content = [line];
            }
            return Promise.resolve(JSON.stringify(data))
        } else {
            return Promise.reject(new Error("Unknown URL"))
        }
    })
}

function renderComponent() {
    hasCanceled = false;
    localStorage.setItem("user.id", "1");
    const {container} = RenderComponent(UserAssignedLines)
    return {container};
}

test('User assigned lines', async () => {
    await act(async () => {
        mockFetch()
        const {container} = renderComponent();
        expect(screen.getByText(/Your assigned lines/i)).toBeInTheDocument();
        await waitForLoadingSpinner(container);
        expect(screen.getByText(/Main Entrance Bar/i)).toBeInTheDocument();
        let cancelButton = screen.getByText(/Cancel/i);
        expect(cancelButton).toBeInTheDocument();
        fireEvent.click(cancelButton);
        await sleep(10);
        await waitForLoadingSpinner(container);
        expect(screen.getByText(/no lines assigned to/i)).toBeInTheDocument();
    })
}, 5000);

test('User assigned lines - network error', async () => {
    await act(async () => {
        mockFetch(true)
        renderComponent();
        await sleep(20);
        expect(screen.getByText(/Something went wrong/i)).toBeInTheDocument();
    })
}, 5000);
