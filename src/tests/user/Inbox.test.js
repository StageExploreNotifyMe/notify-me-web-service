import {fireEvent, render, screen} from '@testing-library/react';
import Inbox from "../../components/user/Inbox";
import {enableFetchMocks} from 'jest-fetch-mock'
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

test("inbox", () => {
    render(<Inbox/>)
    expect(screen.getByText(/Inbox/)).toBeInTheDocument()
}, 5000);

test("buttons", () => {
    render(<Inbox/>)
    let urgentButton = screen.queryByText(/Urgent/i)
    expect(urgentButton).toBeInTheDocument()
    let normalButton = screen.queryByText(/All/i)
    expect(normalButton).toBeInTheDocument()
    fireEvent.click(urgentButton);
    fireEvent.click(normalButton);
}, 5000);

test("RenderNotifications -success", async () => {
    mockFetch({...pageSettings, content: [request]})
    const {container} =  render(<Inbox/>);
    await sleep(40)
    expect(screen.queryByText(new RegExp(request.body))).toBeInTheDocument()


    let notification = container.querySelectorAll("div.is-clickable");
    expect(notification.length).toBe(1);
    expect(notification[0]).toBeInTheDocument();
    fireEvent.click(notification[0]);
    await sleep(40);

    let normalButton = screen.queryByText(/All/i)
    expect(normalButton).toBeInTheDocument()
    fireEvent.click(normalButton);
}, 5000)
