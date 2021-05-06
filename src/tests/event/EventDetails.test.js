import {render, screen} from '@testing-library/react';
import {Router} from 'react-router-dom';
import {createMemoryHistory} from 'history';
import EventDetails from "../../components/event/EventDetails";
import {waitForLoadingSpinner} from "../TestUtilities";
import {enableFetchMocks} from "jest-fetch-mock";
import {sleep} from "../../js/Sleep";

enableFetchMocks()
const history = createMemoryHistory();
const route = '/venue/events/1';
history.push(route);

let event = {"id":"1","name":"Test Event","date":[2037,5,3,8,24],"eventStatus":"CREATED","venue":{"id":"1","name":"Groenplaats"}};

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
    localStorage.setItem("venue", JSON.stringify({name: "TestVenue", id: "1"}));
    const {container} = render(<Router history={history}><EventDetails/></Router>);
    return {container};
}

test('Render addEventLines component - network error', async () => {
    mockFetch(true)
    const {container} =renderComponent();
    let loadingSpinner = container.querySelector('.loading');
    expect(loadingSpinner).toBeInTheDocument()
    await sleep(20);
    expect(screen.getByText(new RegExp("Something went wrong"))).toBeInTheDocument()
}, 5000);

test('Render addEventLines component - loaded', async () => {
    mockFetch()
    const {container} =renderComponent();
    await waitForLoadingSpinner(container);
    expect(screen.getByText(new RegExp(event.name))).toBeInTheDocument()
}, 5000);