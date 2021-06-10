import {act, fireEvent, screen, waitForElementToBeRemoved} from '@testing-library/react';
import {enableFetchMocks} from "jest-fetch-mock";
import {sleep} from "../../../js/Sleep";
import ManageLines from "../../../components/venue/lines/ManageLines";
import {RenderComponent} from "../../TestUtilities";

enableFetchMocks()

test('Render Line management', async () => {
    await act(async () => {
        mockFetch({...page, content: [line]});
        const {container, createButton} = await renderAdminOrgMngmt();
        expect(screen.getByText(new RegExp(line.name))).toBeInTheDocument();

        let icon = container.querySelector(".makeStyles-clickable-1");
        expect(icon).toBeInTheDocument();
        fireEvent.click(icon);
        expect(mockHistoryPush).toHaveBeenCalledWith('/venue/lines/edit');

        fireEvent.click(createButton)
        expect(mockHistoryPush).toHaveBeenCalledWith('/venue/lines/create');
    })
}, 5000);

test('Render line management - no lines', async () => {
    await act(async () => {
        mockFetch({...page, content: []});
        await renderAdminOrgMngmt();
        expect(screen.getByText(/No lines/i)).toBeInTheDocument();
        let createSpan = screen.getByText(/here/i);
        expect(createSpan).toBeInTheDocument()
        fireEvent.click(createSpan)
        expect(mockHistoryPush).toHaveBeenCalledWith('/venue/lines/create');
    })
}, 5000);

test('Render line management - network error', async () => {
    await act(async () => {
        mockFetch(page, true);
        await renderAdminOrgMngmt(false);
        await sleep(50)
        expect(screen.getByText(/Something went wrong/i)).toBeInTheDocument();
    })
}, 5000);

let line = {
    "id": "2",
    "name": "Catering",
    "description": "The catering during events",
    "venueDto": {"id": "1", "name": "Groenplaats"},
    "numberOfRequiredPeople": 1
}
let page = {
    content: [],
    last: true,
    totalPages: 1,
    totalElements: 0,
    number: 0,
    size: 20,
    first: true,
    numberOfElements: 0
};


function mockFetch(data = page, simulateNetworkError = false) {
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

const mockHistoryPush = jest.fn();
jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useHistory: () => ({
        push: mockHistoryPush,
    }),
}));

async function renderAdminOrgMngmt(waitForRemoved = true) {
    localStorage.setItem("venue", JSON.stringify({name: "TestVenue", id: "1"}));
    const {container} = RenderComponent(ManageLines);
    let spinner = container.querySelector(".loading");
    expect(spinner).toBeInTheDocument()
    if (waitForRemoved) await waitForElementToBeRemoved(spinner)
    expect(screen.getByText(/Line Management/i)).toBeInTheDocument();
    const createButton = screen.getByText(/Create Line/i);
    expect(createButton).toBeInTheDocument();
    return {createButton, spinner, container};
}
