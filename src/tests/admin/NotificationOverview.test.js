import {fireEvent, render, screen} from '@testing-library/react';
import {enableFetchMocks} from 'jest-fetch-mock'
import NotificationOverview from "../../components/admin/NotificationOverview";
import {sleep} from "../../js/Sleep";

enableFetchMocks()
fetch.enableMocks();

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
    id: "1",
    title: "Request to join KdG ACCEPTED",
    type: "USER_JOINED",
    urgency: "NORMAL",
    usedChannel: "EMAIL",
    userId: "1"
}

function mockFetch(content = pageSettings) {
    fetch.resetMocks();
    let json = JSON.stringify(content);
    fetch.mockResponses([json, {status: 200}])
}

test("RenderNotification - fail", async () => {
    render(<NotificationOverview/>)
    let notRendered = screen.getAllByText(/Something went wrong while fetching all notifications/i)
    expect(notRendered[0]).toBeInTheDocument()
}, 5000)

test("RenderNoNotification", async () => {
    mockFetch({...pageSettings, content: []})
    render(<NotificationOverview/>)
    await sleep(50)
    let notRendered = screen.getAllByText(/No notifications in your overview/i)
    expect(notRendered[0]).toBeInTheDocument()
}, 5000)

test("RenderNotification - success", async () => {
    mockFetch({...pageSettings, content: [request]})
    const {container} = render(<NotificationOverview/>)
    await sleep(50)
    let button = screen.queryByText(/Details/i)
    expect(button).toBeInTheDocument()
    fireEvent.click(button)
    closeModal(container, '.modal-background')
}, 5000)

test("modalClose", async () => {
    mockFetch({...pageSettings, content: [request]})
    const {container} = render(<NotificationOverview/>)
    await sleep(50)
    let button = screen.queryByText(/Details/i)
    expect(button).toBeInTheDocument()
    fireEvent.click(button)
    closeModal(container, '.modal-close')
}, 5000)

function closeModal(container, selector) {
    let closeByBackground = container.querySelector(selector)
    expect(closeByBackground).toBeInTheDocument()
    fireEvent.click(closeByBackground);
    expect(container.querySelectorAll('.modal').length).toBe(0);
}
