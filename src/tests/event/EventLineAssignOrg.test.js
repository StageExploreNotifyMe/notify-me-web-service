import {fireEvent, render, screen, waitForElementToBeRemoved} from '@testing-library/react';
import {Router} from 'react-router-dom';
import {createMemoryHistory} from 'history';
import EventLineAssignOrganization from "../../components/event/EventLineAssignOrganization";
import {enableFetchMocks} from "jest-fetch-mock";
import {sleep} from "../../js/Sleep";
import {waitForLoadingSpinner} from "../TestUtilities";

enableFetchMocks()
const history = createMemoryHistory();
const route = '/venue/events/1';
history.push(route);

let page = {
    content: [],
    number: 0,
    first: true,
    last: false,
    totalPages: 0
};
let org = {"id": "1", "name": "KdG"}

let line = {
    "id": "1",
    "line": {
        "id": "1",
        "name": "Main Entrance Bar",
        "description": "The bar at the main entrance of the venue",
        "venueDto": {"id": "1", "name": "Groenplaats"}
    },
    "event": {
        "id": "1",
        "name": "test",
        "date": [2021, 5, 2, 15, 6, 18, 355000000],
        "eventStatus": "CREATED",
        "venue": {"id": "1", "name": "Groenplaats"}
    },
    "organization": null,
    "assignedUsers": []
}

function mockFetch(simulateNetworkError = false, data = page) {
    fetch.enableMocks()
    fetch.resetMocks()

    fetch.mockResponse(async request => {
        if (simulateNetworkError) return Promise.reject(new Error("Simulated error"));
        await sleep(10)
        if (request.url.includes("/organization")) {
            return Promise.resolve(JSON.stringify(data))
        } else {
            return Promise.reject(new Error("Unknown URL"))
        }
    })
}

function renderComponent() {
    let mockAssign = jest.fn();
    let mockCancel = jest.fn();
    localStorage.setItem("venue", JSON.stringify({name: "TestVenue", id: "1"}));
    localStorage.setItem("event.line.assign", JSON.stringify(line));
    const {container} = render(<Router history={history}><EventLineAssignOrganization assignOrg={mockAssign} cancel={mockCancel}/></Router>);
    return {container, mockAssign, mockCancel};
}

test('Render EventLineAssignOrg component - no organizations', async () => {
    mockFetch();
    const {container} = renderComponent();
    await waitForLoadingSpinner(container)
    expect(screen.getByText(new RegExp('No organizations found'))).toBeInTheDocument()
    let cancelButton = screen.getByText(new RegExp("Cancel"));
    expect(cancelButton).toBeInTheDocument()
    fireEvent.click(cancelButton);
}, 5000);

test('Render EventLineAssignOrg component - with organizations', async () => {
    let data = {...page, content: [org]};
    mockFetch(false, data);
    const {container} = renderComponent();
    await waitForLoadingSpinner(container)
    expect(screen.getByText(new RegExp(org.name))).toBeInTheDocument()

    let assignButton = screen.getAllByText(new RegExp("Assign"))[1];
    expect(assignButton).toBeInTheDocument()
    fireEvent.click(assignButton);
}, 5000);
