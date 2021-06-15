import {fireEvent, screen} from '@testing-library/react';
import EventDetails from "../../components/event/EventDetails";
import {RenderComponent, waitForLoadingSpinner} from "../TestUtilities";
import {enableFetchMocks} from "jest-fetch-mock";
import {sleep} from "../../js/Sleep";
import {act} from "react-dom/test-utils";

enableFetchMocks()
const route = '/venue/events/1';

let event = {
    "id": "1",
    "name": "Test Event",
    "date": [2037, 5, 3, 8, 24],
    "eventStatus": "CREATED",
    "venue": {"id": "1", "name": "Groenplaats"}
};

function mockFetch(simulateNetworkError = false, data = event) {
    fetch.enableMocks()
    fetch.resetMocks()

    fetch.mockResponse(async request => {
        if (simulateNetworkError) return Promise.reject(new Error("Simulated error"));
        await sleep(10)
        if (request.url.includes("/event/")) {
            return Promise.resolve(JSON.stringify(data))
        } else {
            return Promise.reject(new Error("Unknown URL"))
        }
    })
}

function renderComponent() {
    localStorage.setItem('IsLoggedIn', "true")
    localStorage.setItem("currentEvent", JSON.stringify(event));
    localStorage.setItem("venue", JSON.stringify({name: "TestVenue", id: "1"}));
    localStorage.setItem("user", JSON.stringify({
        firstname: "Test",
        lastname: "Test",
        id: "1",
        roles: ["VENUE_MANAGER", "MEMBER", "ORGANIZATION_LEADER", "LINE_MANAGER", "ADMIN"],
        userPreferences: {id: "3", normalChannel: "EMAIL", urgentChannel: "SMS"}
    }));
    const {container} = RenderComponent(EventDetails, {}, [route]);
    return {container};
}

test('Render addEventLines component - network error', async () => {
    await act(async () => {
        mockFetch(true)
        const {container} = renderComponent();
        let loadingSpinner = container.querySelector('.loading');
        expect(loadingSpinner).toBeInTheDocument()
        await sleep(20);
        expect(screen.getByText(new RegExp("Something went wrong"))).toBeInTheDocument()
    })
}, 5000);

test('Render addEventLines component - created event', async () => {
    await act(async () => {
        mockFetch()
        const {container} = renderComponent();
        await waitForLoadingSpinner(container);
        expect(screen.getAllByText(new RegExp(event.name)).length).toBeGreaterThan(0)
        let createdButton = screen.getByText(new RegExp("CREATED"));
        expect(createdButton).toBeVisible()
        fireEvent.click(createdButton);
        let cancelButton = screen.getAllByText(new RegExp("Cancel"))[0];
        expect(cancelButton).toBeVisible()
        fireEvent.click(cancelButton)
    })
}, 5000);

test('Render addEventLines component - public event', async () => {
    await act(async () => {
        let pubEvent = {...event, eventStatus: "PUBLIC"};
        mockFetch(false, pubEvent)
        const {container} = renderComponent();
        await waitForLoadingSpinner(container);
        let createdButton = screen.getByText(new RegExp("PUBLIC"));
        expect(createdButton).toBeVisible()
        fireEvent.click(createdButton);
        let cancelButton = screen.getAllByText(new RegExp("Private"))[0];
        expect(cancelButton).toBeVisible()
        fireEvent.click(cancelButton)
    })
}, 5000);

test('Render addEventLines component - canceled event', async () => {
    await act(async () => {
        let canEvent = {...event, eventStatus: "CANCELED"};
        mockFetch(false, canEvent)
        const {container} = renderComponent();
        await waitForLoadingSpinner(container);
        let createdButton = screen.getByText(new RegExp("CANCELED"));
        expect(createdButton).toBeVisible()
        fireEvent.click(createdButton);
        let cancelButton = screen.getAllByText(new RegExp("Public"))[0];
        expect(cancelButton).toBeVisible()
        fireEvent.click(cancelButton)
    })
}, 5000);

test('Render addEventLines component - close dialog', async () => {
    await act(async () => {
        let canEvent = {...event, eventStatus: "CANCELED"};
        mockFetch(false, canEvent)
        const {container} = renderComponent();
        await waitForLoadingSpinner(container);
        let createdButton = screen.getByText(new RegExp("CANCELED"));
        expect(createdButton).toBeVisible()
        fireEvent.click(createdButton);
        screen.debug()
        let closeDiagDiv = document.querySelector(".MuiBackdrop-root");
        fireEvent.click(closeDiagDiv)
        await sleep(20);
    })
}, 5000);