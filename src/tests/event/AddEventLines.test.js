import {fireEvent, screen} from '@testing-library/react';
import AddEventLines from "../../components/event/AddEventLines";
import {enableFetchMocks} from "jest-fetch-mock";
import {sleep} from "../../js/Sleep";
import {RenderComponent, waitForLoadingSpinner} from "../TestUtilities";
import {act} from "react-dom/test-utils";

const route = '/venue/events/1/lines';
enableFetchMocks()

let lines = {
    "content": [{
        "id": "1",
        "name": "Main Entrance Bar",
        "description": "The bar at the main entrance of the venue",
        "venueDto": {"id": "1", "name": "Groenplaats"}
    }, {
        "id": "3",
        "name": "Parking area",
        "description": "People are needed to direct cars to where to park in the parking lot",
        "venueDto": {"id": "1", "name": "Groenplaats"}
    }, {
        "id": "2",
        "name": "VIP Bar",
        "description": "The bar in the VIP area",
        "venueDto": {"id": "1", "name": "Groenplaats"}
    }],
    "pageable": {
        "sort": {"sorted": false, "unsorted": true, "empty": true},
        "offset": 0,
        "pageSize": 20,
        "pageNumber": 0,
        "paged": true,
        "unpaged": false
    },
    "last": true,
    "totalPages": 1,
    "totalElements": 3,
    "number": 0,
    "size": 20,
    "sort": {"sorted": false, "unsorted": true, "empty": true},
    "first": true,
    "numberOfElements": 3,
    "empty": false
};
let event = {
    "id": "1",
    "name": "test",
    "date": [2021, 5, 2, 15, 6, 18, 0],
    "eventStatus": "CREATED",
    "venue": {"id": "1", "name": "Groenplaats"}
};

let eventLines = {
    "content": [{
        "id": "1",
        "line": {
            "id": "1",
            "name": "Main Entrance Bar",
            "description": "The bar at the main entrance of the venue",
            "venueDto": {"id": "1", "name": "Groenplaats"}
        },
        "event": event,
        "organization": {"id": "1", "name": "KdG"},
        "assignedUsers": []
    }],
    "pageable": {
        "sort": {"sorted": false, "unsorted": true, "empty": true},
        "offset": 0,
        "pageSize": 20,
        "pageNumber": 0,
        "paged": true,
        "unpaged": false
    },
    "last": true,
    "totalPages": 1,
    "totalElements": 1,
    "number": 0,
    "size": 20,
    "sort": {"sorted": false, "unsorted": true, "empty": true},
    "first": true,
    "numberOfElements": 1,
    "empty": false
};

function mockFetch(simulateNetworkError = false, isEmpty = false) {
    fetch.enableMocks()
    fetch.resetMocks()

    fetch.mockResponse(async request => {
        if (simulateNetworkError) return Promise.reject("Simulated error");
        await sleep(10)
        if (request.url.includes("/line/event/")) {
            let data = {...eventLines}
            if (isEmpty) data.content = [];
            return Promise.resolve(JSON.stringify(data))
        } else if (request.url.includes("/line/venue/")) {
            let data = {...lines}
            if (isEmpty) data.content = [];
            return Promise.resolve(JSON.stringify(data))
        } else {
            return Promise.reject(new Error("Unknown URL"))
        }
    })
}

function renderComponent() {
    localStorage.setItem("venue", JSON.stringify({name: "TestVenue", id: "1"}));
    localStorage.setItem("currentEvent", JSON.stringify(event));
    const {container} = RenderComponent(AddEventLines, {}, [route])
    return {container};
}

test('Render addEventLines component - empty', async () => {
    await act(async () => {
        mockFetch(false, true);
        const {container} = renderComponent();
        expect(screen.getByText(/Add Lines to this event/i)).toBeInTheDocument()
        await waitForLoadingSpinner(container)
    })
}, 5000);

test('Render addEventLines component', async () => {
    await act(async () => {
        mockFetch();
        const {container} = renderComponent();
        expect(screen.getByText(/Add Lines to this event/i)).toBeInTheDocument()
        await waitForLoadingSpinner(container)

        let input = container.querySelectorAll('input')[0]

        expect(input).toBeInTheDocument()
        fireEvent.click(input);
        expect(screen.getByText(/Not Implemented/i)).toBeInTheDocument()

        let input2 = container.querySelectorAll('input')[1]
        expect(input2).toBeInTheDocument()
        fireEvent.click(input2);
    })
}, 5000);
