import {fireEvent, screen} from '@testing-library/react';
import {enableFetchMocks} from 'jest-fetch-mock'
import NotificationOverview from "../../components/admin/NotificationOverview";
import {sleep} from "../../js/Sleep";
import {act} from "react-dom/test-utils";
import {RenderComponent} from "../TestUtilities";

enableFetchMocks()

let pageSettings = {
    content: [],
    number: 10,
    first: false,
    last: false,
    totalPages: 20
};

let request = {
    body: "test user",
    creationDate: [2021, 4, 28, 10, 59, 57, 509317000],
    eventId: "1",
    id: "1",
    title: "Request to join KdG ACCEPTED",
    type: "USER_JOINED",
    urgency: "NORMAL",
    usedChannel: "EMAIL",
    userId: "1"
}

let request2 = {
    body: "test user",
    creationDate: [2021, 4, 28, 10, 59, 57, 509317000],
    eventId: "",
    id: "2",
    title: "Request to join KdG ACCEPTED",
    type: "USER_JOINED",
    urgency: "NORMAL",
    usedChannel: "EMAIL",
    userId: ""
}

let request3 = {
    body: "test user",
    creationDate: [2021, 4, 28, 10, 59, 57, 509317000],
    eventId: "500",
    id: "3",
    title: "Request to join KdG ACCEPTED",
    type: "USER_JOINED",
    urgency: "NORMAL",
    usedChannel: "EMAIL",
    userId: "500",
    price: 0.5
}

let eventsDto = {
    event: ["2", "1", "3"]
}

let notificationTypes = {
    notificationTypes: ["USER_CREATED", "USER_JOINED", "USER_ACCEPTED", "USER_DECLINED", "USER_PROMOTED", "USER_DEMOTED", "USER_CANCELED", "EVENT_CREATED", "EVENT_PUBLISHED", "EVENT_CONFIRMED", "EVENT_CANCELED", "WEEKLY_DIGEST", "STAFFING_REMINDER", "LINE_ASSIGNED", "LINE_CANCELED"]
}

let user = {
    "id": "1",
    "userPreferences": {"id": "1", "normalChannel": "EMAIL", "urgentChannel": "SMS"},
    "firstname": "John",
    "lastname": "Doe"
};

let event = {
    "id": "1",
    "name": "Test Event",
    "date": [2037, 5, 3, 8, 24],
    "eventStatus": "CREATED",
    "venue": {"id": "1", "name": "Groenplaats"}
};

let dataDto = {
    notificationDtoPage: pageSettings,
    userDtos: [user],
    eventDtos: [event]
};

function mockFetch(content = dataDto, simulateNetworkError = false) {
    fetch.enableMocks();
    fetch.resetMocks();
    fetch.mockResponse(async request => {
        if (request.url.includes("/admin/eventId")) {
            return Promise.resolve(JSON.stringify(eventsDto))
        } else if (request.url.includes("/admin/notificationTypes")) {
            return Promise.resolve(JSON.stringify(notificationTypes))
        } else if (request.url.includes("/admin/notifications")) {
            if (simulateNetworkError) return Promise.resolve("hjgj")
            return Promise.resolve(JSON.stringify(content))
        } else
            return Promise.reject(new Error("unknown URL"))
    })
}

test("dropdown", async () => {
    await act(async () => {
        mockFetch()
        RenderComponent(NotificationOverview)
        let types = screen.queryByText("Notification Types")
        expect(types).toBeInTheDocument();
        fireEvent.click(types)
    })
}, 5000)


test("RenderNotification - fail", async () => {
    await act(async () => {
        mockFetch(dataDto, true)
        RenderComponent(NotificationOverview)
        await sleep(50)
        let notRendered = screen.getAllByText(/Something went wrong while fetching all notifications/i)
        expect(notRendered[0]).toBeInTheDocument()
    })
}, 5000)


test("RenderNoNotification", async () => {
    await act(async () => {
        mockFetch()
        RenderComponent(NotificationOverview)
        await sleep(50)
        let notRendered = screen.getAllByText(/No notifications in your overview/i)
        expect(notRendered[0]).toBeInTheDocument()
    })
}, 5000)

test("RenderNotification - success", async () => {
    await act(async () => {

        let notifications = {...pageSettings, content: [request, request2]};
        let dto = {...dataDto, notificationDtoPage: notifications};
        mockFetch(dto)
        const {container} = RenderComponent(NotificationOverview)
        await sleep(50)
        let button =container.querySelector(".MuiButtonBase-root")
        expect(button).toBeInTheDocument()
        fireEvent.click(button)
    })
}, 5000)

test("modalClose", async () => {
    await act(async () => {
        let notifications = {...pageSettings, content: [request, request3]};
        let dto = {notificationDtoPage: notifications, userDtos: [], eventDtos: []};
        mockFetch(dto)
        const {container} = RenderComponent(NotificationOverview)
        await sleep(50)
        let button = container.querySelector(".MuiButtonBase-root")
        expect(button).toBeInTheDocument()
        fireEvent.click(button)
    })
}, 5000)


