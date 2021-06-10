import {fireEvent, screen} from '@testing-library/react';
import {enableFetchMocks} from 'jest-fetch-mock'
import {act} from "react-dom/test-utils";
import {sleep} from "../../js/Sleep";
import {RenderComponent, waitForLoadingSpinner} from "../TestUtilities";
import PickVenueToManage from "../../components/venue/PickVenueToManage";

enableFetchMocks()

let venue = {name: "TestVenue", id: "1"}

let venues = {
    content: [venue],
    last: true,
    totalPages: 1,
    totalElements: 0,
    number: 0,
    size: 20,
    first: true,
    numberOfElements: 0
};

function mockFetch(simulateNetworkError = false, content = [venue]) {
    fetch.enableMocks()
    fetch.resetMocks()

    fetch.mockResponse(async () => {
        if (simulateNetworkError) return Promise.resolve(new Error("Simulated error"));
        await sleep(10)
        return Promise.resolve(JSON.stringify({...venues, content: content}))
    })
}

const mockHistoryPush = jest.fn();
jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useHistory: () => ({
        push: mockHistoryPush
    }),
}));

function renderOrganizationDetails() {
    localStorage.setItem("user.id", "1");
    const {container} = RenderComponent(PickVenueToManage);
    return {container};
}

test('Pick Venue - Render', async () => {
    await act(async () => {
        mockFetch();
        const {container} = renderOrganizationDetails();
        await waitForLoadingSpinner(container)
        expect(screen.getByText(new RegExp(venue.name))).toBeInTheDocument()
        let button = screen.getByText("Manage this venue");
        expect(button).toBeInTheDocument();
        fireEvent.click(button);
        await sleep(20);
        expect(mockHistoryPush).toHaveBeenCalledWith("/")
    })
}, 5000);

test('Pick Venue - no venues', async () => {
    await act(async () => {
        mockFetch(false, []);
        const {container} = renderOrganizationDetails();
        await waitForLoadingSpinner(container)
        expect(screen.getByText(new RegExp("you appear to not be a part of any venue"))).toBeInTheDocument()
    })
}, 5000);

test('Pick Venue - network error', async () => {
    await act(async () => {
        mockFetch(true);
        const {container} = renderOrganizationDetails();
        await waitForLoadingSpinner(container)
        expect(screen.getByText(new RegExp("Something went wrong"))).toBeInTheDocument()
    })
}, 5000);

