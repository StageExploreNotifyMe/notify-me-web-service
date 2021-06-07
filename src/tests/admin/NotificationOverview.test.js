import {fireEvent, render, screen} from '@testing-library/react';
import {enableFetchMocks} from 'jest-fetch-mock'
import NotificationOverview from "../../components/admin/NotificationOverview";
import {sleep} from "../../js/Sleep";
import {act} from "react-dom/test-utils";

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

let event = {
    event: ["2", "1", "3"]
}

let notificationTypes = {
    notificationTypes: ["USER_CREATED", "USER_JOINED", "USER_ACCEPTED", "USER_DECLINED", "USER_PROMOTED", "USER_DEMOTED", "USER_CANCELED", "EVENT_CREATED", "EVENT_PUBLISHED", "EVENT_CONFIRMED", "EVENT_CANCELED", "WEEKLY_DIGEST", "STAFFING_REMINDER", "LINE_ASSIGNED", "LINE_CANCELED"]
}

function mockFetch(content = pageSettings, simulateNetworkError=false) {
    fetch.enableMocks();
    fetch.resetMocks();
    fetch.mockResponse(async request => {
        if (request.url.includes("/admin/eventId")) {
            return Promise.resolve(JSON.stringify(event))
        } else if (request.url.includes("/admin/notificationTypes")) {
            return Promise.resolve(JSON.stringify(notificationTypes))
        } else if (request.url.includes("/admin/notifications")) {
            if (simulateNetworkError)  return Promise.resolve("hjgj")
            return Promise.resolve(JSON.stringify(content))
        } else
            return Promise.reject(new Error("unknown URL"))
    })
}

test("dropdown", async () => {
    await act(async () => {
        mockFetch()
        const {container} = render(<NotificationOverview/>)
        let types = container.querySelector(".select")
        await sleep(20)
        expect(types).toBeInTheDocument();
        fireEvent.click(types)
    })
}, 5000)


test("RenderNotification - fail", async () => {
    await act(async () => {
        mockFetch(pageSettings, true)
        render(<NotificationOverview/>)
        await sleep(50)
        let notRendered = screen.getAllByText(/Something went wrong while fetching all notifications/i)
        expect(notRendered[0]).toBeInTheDocument()
    })
}, 5000)


test("RenderNoNotification", async () => {
    await act(async () => {
        mockFetch({...pageSettings, content: []})
        render(<NotificationOverview/>)
        await sleep(50)
        let notRendered = screen.getAllByText(/No notifications in your overview/i)
        expect(notRendered[0]).toBeInTheDocument()
    })
}, 5000)

test("RenderNotification - success", async () => {
    await act(async () => {
        mockFetch({...pageSettings, content: [request]})
        const {container} = render(<NotificationOverview/>)
        await sleep(50)
        let button = screen.queryByText(/Details/i)
        expect(button).toBeInTheDocument()
        fireEvent.click(button)
        closeModal(container, '.modal-background')
    })
}, 5000)

test("modalClose", async () => {
    await act(async () => {
        mockFetch({...pageSettings, content: [request]})
        const {container} = render(<NotificationOverview/>)
        await sleep(50)
        let button = screen.queryByText(/Details/i)
        expect(button).toBeInTheDocument()
        fireEvent.click(button)
        closeModal(container, '.modal-close')
    })
}, 5000)

function closeModal(container, selector) {
    let closeByBackground = container.querySelector(selector)
    expect(closeByBackground).toBeInTheDocument()
    fireEvent.click(closeByBackground);
    expect(container.querySelectorAll('.modal').length).toBe(0);
}
