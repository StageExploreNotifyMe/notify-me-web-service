import {fireEvent, render, screen, waitForElementToBeRemoved} from '@testing-library/react';
import EventManagement from "../../components/venue/EventManagement";
import {enableFetchMocks} from "jest-fetch-mock";
import {sleep} from "../../js/Sleep";

enableFetchMocks()

test('Render Event management', async () => {
    mockFetch();
    const {createButton, container} = await renderEventManagement();
    fireEvent.click(createButton)
    expect(mockHistoryPush).toHaveBeenCalledWith('/venue/events/create');

    let editEventIcon = container.querySelector(".is-clickable");
    expect(editEventIcon).toBeInTheDocument()
    fireEvent.click(editEventIcon)
    expect(mockHistoryPush).toHaveBeenCalledWith('/venue/events/' + events.content[0].id);
}, 5000);

test('Render Event management - no events', async () => {
    mockFetch({...events, content: []});
    await renderEventManagement();
    expect(screen.getByText(/No events scheduled/i)).toBeInTheDocument();
    let createSpan = screen.getByText(/here/i);
    expect(createSpan).toBeInTheDocument()
    fireEvent.click(createSpan)
    expect(mockHistoryPush).toHaveBeenCalledWith('/venue/events/create');
}, 5000);

test('Render Event management - network error', async () => {
    mockFetch(events, true);
    await renderEventManagement(false);
    await sleep(50)
    expect(screen.getByText(/Something went wrong/i)).toBeInTheDocument();
}, 5000);

let venue = {name: "TestVenue", id: "1"}
const mockHistoryPush = jest.fn();

let events = {
    content: [{
        id: "1",
        name: "Test Event",
        date: [2021, 5, 8, 16, 6],
        eventStatus: "CREATED",
        venue: {id: "1", name: "Groenplaats"}
    }],
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
        response = "qsdklfj{ùq{mokj}{}";
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
    localStorage.setItem("venue", JSON.stringify(venue));
    const {container} = render(<EventManagement/>);
    let spinner = container.querySelector(".loading");
    expect(spinner).toBeInTheDocument()
    if (waitForRemoved) await waitForElementToBeRemoved(spinner)
    expect(screen.getByText(/Venue /i)).toBeInTheDocument();
    const createButton = screen.getByText(/Create Event/i);
    expect(createButton).toBeInTheDocument();
    return {createButton, spinner, container};
}
