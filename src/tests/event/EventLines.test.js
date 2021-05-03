import {fireEvent, render, screen, waitForElementToBeRemoved} from '@testing-library/react';
import {Router} from 'react-router-dom';
import {createMemoryHistory} from 'history';
import {enableFetchMocks} from 'jest-fetch-mock'
import EventLines from "../../components/event/EventLines";
import {sleep} from "../../js/Sleep";
import React from "react";
import {waitForLoadingSpinner} from "../TestUtilities";

enableFetchMocks()
const history = createMemoryHistory();
const route = '/venue/events/1';
history.push(route);
let mockHistoryPush = jest.fn();
jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useHistory: () => ({
        push: mockHistoryPush,
    }),
}));

let page = {
    content: [],
    number: 0,
    first: true,
    last: false,
    totalPages: 0
};
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
let org = {"id": "1", "name": "KdG"}

function mockFetch(simulateNetworkError = false, content = page) {
    fetch.enableMocks()
    fetch.resetMocks()

    fetch.mockResponse(async request => {
        if (simulateNetworkError) return Promise.reject(new Error("Simulated error"));
        await sleep(10)
        if (request.url.includes("/line/event/")) {
            return Promise.resolve(JSON.stringify(content))
        } else {
            return Promise.reject(new Error("Unknown URL"))
        }
    })
}

function renderComponent() {
    mockHistoryPush = jest.fn();
    localStorage.setItem("venue", JSON.stringify({name: "TestVenue", id: "1"}));
    const {container} = render(<Router history={history}><EventLines/></Router>);
    return {container};
}

test('Render event lines component - no lines', async () => {
    mockFetch();
    const {container} = renderComponent();
    await waitForLoadingSpinner(container)
    expect(screen.getByText(new RegExp('No lines assigned to this event'))).toBeInTheDocument()
}, 5000);

test('Render event lines component - network error', async () => {
    mockFetch(true);
    renderComponent();
    expect(screen.getByText(new RegExp('Something went wrong'))).toBeInTheDocument()
}, 5000);

test('Render event lines component - with lines & organization', async () => {
    let lineWithOrg = {...line, organization: org};
    let data = {...page, content: [lineWithOrg]}
    mockFetch(false, data);
    const {container} = renderComponent();
    await waitForLoadingSpinner(container)
    expect(screen.getByText(new RegExp('Organization: ' + org.name))).toBeInTheDocument()
    let addButton =screen.getByText(new RegExp('Add'))
    expect(addButton).toBeInTheDocument()
    fireEvent.click(addButton);
}, 5000);

test('Render event lines component - with lines, without organization', async () => {
    let data = {...page, content: [line]}
    mockFetch(false, data);
    const {container} = renderComponent();
    await waitForLoadingSpinner(container)
    expect(screen.getByText(new RegExp('Unassigned'))).toBeInTheDocument()
    let assignButton = container.querySelector('.is-clickable')
    expect(assignButton).toBeInTheDocument()
    fireEvent.click(assignButton);
}, 5000);
