import {fireEvent, screen, waitForElementToBeRemoved} from '@testing-library/react';
import EventManagement from "../../components/venue/EventManagement";
import {enableFetchMocks} from "jest-fetch-mock";
import {sleep} from "../../js/Sleep";
import {act} from "react-dom/test-utils";
import {RenderComponent} from "../TestUtilities";

enableFetchMocks()

test('Render Event management', async () => {
    await act(async () => {
        mockFetch();
        const {container, createButton} = await renderEventManagement();
        let icon = container.querySelector(".makeStyles-clickable-1");
        expect(icon).toBeInTheDocument();
        fireEvent.click(icon);
        expect(mockHistoryPush).toHaveBeenCalledWith('/venue/event');

        fireEvent.click(createButton)
        expect(mockHistoryPush).toHaveBeenCalledWith('/venue/events/create');

        let editEventIcon = container.querySelector(".makeStyles-clickable-1");
        expect(editEventIcon).toBeInTheDocument()
        fireEvent.click(editEventIcon)
        expect(mockHistoryPush).toHaveBeenCalledWith('/venue/event');
    })
}, 5000);

test('Render Event management - no events', async () => {
    await act(async () => {
        mockFetch({...events, content: []});
        await renderEventManagement();
        expect(screen.getByText(/No events scheduled/i)).toBeInTheDocument();
        let createSpan = screen.getByText(/here/i);
        expect(createSpan).toBeInTheDocument()
        fireEvent.click(createSpan)
        expect(mockHistoryPush).toHaveBeenCalledWith('/venue/events/create');
    })
}, 5000);

test('Render Event management - network error', async () => {
    await act(async () => {
        mockFetch(events, true);
        await renderEventManagement(false);
        await sleep(50)
        expect(screen.getByText(/Something went wrong/i)).toBeInTheDocument();
    })
}, 5000);

let venue = {name: "TestVenue", id: "1"}
const mockHistoryPush = jest.fn();

let event = {
    id: "1",
    name: "Test Event",
    date: [2021, 5, 8, 16, 6],
    eventStatus: "CREATED",
    venue: {id: "1", name: "Groenplaats"}
};

let events = {
    content: [event],
    last: true,
    totalPages: 1,
    totalElements: 0,
    number: 0,
    size: 20,
    first: true,
    numberOfElements: 0
};

function mockFetch(data = events, simulateNetworkError = false) {
    fetch.enableMocks()
    fetch.resetMocks()
    let response = JSON.stringify(data)
    let status = {status: 200};
    if (simulateNetworkError) {
        response = "qsdklfj{??q{mokj}{}";
        status = {status: 500}
    }
    fetch.mockResponses([response, status])
}

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useHistory: () => ({
        push: mockHistoryPush,
    }),
}));

async function renderEventManagement(waitForRemoved = true) {
    localStorage.setItem('IsLoggedIn', "true")
    localStorage.setItem("venue", JSON.stringify(venue));
    localStorage.setItem("user", JSON.stringify({
        firstname: "Test",
        lastname: "Test",
        id: "1",
        roles: ["VENUE_MANAGER", "MEMBER", "ORGANIZATION_LEADER", "LINE_MANAGER", "ADMIN"],
        userPreferences: {id: "3", normalChannel: "EMAIL", urgentChannel: "SMS"}
    }));
    localStorage.setItem("currentEvent", JSON.stringify(event));
    const {container} = RenderComponent(EventManagement);
    let spinner = container.querySelector(".loading");
    expect(spinner).toBeInTheDocument()
    if (waitForRemoved) await waitForElementToBeRemoved(spinner)
    expect(screen.getByText(/Venue /i)).toBeInTheDocument();
    const createButton = screen.getByText(/Create Event/i);
    expect(createButton).toBeInTheDocument();
    return {createButton, spinner, container};
}


