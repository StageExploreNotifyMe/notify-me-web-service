import {fireEvent, screen} from '@testing-library/react';
import Inbox from "../../components/user/Inbox";
import {enableFetchMocks} from 'jest-fetch-mock'
import {sleep} from "../../js/Sleep";
import {act} from "react-dom/test-utils";
import {RenderComponent} from "../TestUtilities";

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

function doRender() {
    localStorage.setItem("user", JSON.stringify({id: "1", userPreferences: {id: "1", normalChannel: "EMAIL", urgentChannel: "SMS"}, firstname: "John", lastname: "Doe"}));
    const {container} = RenderComponent(Inbox)
    expect(screen.getByText(/Inbox/)).toBeInTheDocument()
    return container;
}

test("inbox", () => {
    act(() => {
        doRender();
    })
}, 5000);

test("buttons", () => {
    act(() => {
        doRender()
        let urgentButton = screen.queryByText(/Urgent/i)
        expect(urgentButton).toBeInTheDocument()
        let normalButton = screen.queryByText(/All/i)
        expect(normalButton).toBeInTheDocument()
        fireEvent.click(urgentButton);
        fireEvent.click(normalButton);
    })
}, 5000);

test("RenderNotifications -success", async () => {
    await act(async () => {
        await renderWithNotifications();

        let normalButton = screen.queryByText(/All/i)
        expect(normalButton).toBeInTheDocument()
        fireEvent.click(normalButton);
        await sleep(20);
    })
}, 5000)

test("RenderNotifications - urgent", async () => {
    await act(async () => {
        await renderWithNotifications();

        let urgentButton = screen.queryByText(/Urgent/i)
        expect(urgentButton).toBeInTheDocument()
        fireEvent.click(urgentButton);
        await sleep(20);
    })
}, 5000)

async function renderWithNotifications() {
    mockFetch({...pageSettings, content: [request]})
    const container = doRender();
    await sleep(40)
    expect(screen.queryByText(new RegExp(request.body))).toBeInTheDocument()
    let notification = container.querySelectorAll(".MuiCardContent-root");
    expect(notification[0]).toBeInTheDocument();
    fireEvent.click(notification[0]);
    await sleep(40);
}
